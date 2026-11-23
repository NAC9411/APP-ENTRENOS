import { GoogleGenAI, Type } from '@google/genai';

export interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string | undefined>;
}

export interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

type GeminiAction =
  | 'analyze_sector'
  | 'personalize_reflection'
  | 'explain_control'
  | 'suggest_search_terms';

interface GeminiRequestPayload {
  action: GeminiAction;
  data: Record<string, unknown>;
}

function safeString(val: unknown, maxLen = 400): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLen);
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_GUARDRAILS = `Eres un especialista en Seguridad y Salud en el Trabajo (SST) y comunicación empática para propietarios de micro y pequeñas empresas en Latinoamérica, colaborando en la herramienta ENTRE NOS ("La confianza también nos protege").
Reglas estrictas:
1. Usa lenguaje cotidiano, cercano, respetuoso y práctico. Nunca culpes, juzgues ni uses términos clínicos o punitivos (evita "irresponsable", "negligente", "incumplimiento", "evaluación psicométrica", "déficit conductual").
2. Nunca inventes precios, marcas comerciales, nombres de proveedores específicos ni garantices compatibilidad técnica con máquinas concretas.
3. No inventes información personal ni atribuyas emociones que el usuario no haya manifestado explícitamente en sus datos.
4. Siempre recuerda que ENTRE NOS orienta preventivamente y no sustituye la evaluación técnica competente ni la ingeniería de protecciones.
5. Si el contexto sugiere peligro grave o inminente (partes móviles expuestas sin resguardo, altura sin protección, energía viva, espacios confinados o químicos tóxicos sin ventilación), recomienda evitar la exposición y solicitar revisión técnica competente antes de operar.`;

export async function executeGeminiAction(
  payload: GeminiRequestPayload
): Promise<{ statusCode: number; body: Record<string, unknown> }> {
  const ai = getAiClient();
  if (!ai) {
    return {
      statusCode: 200,
      body: {
        fallback: true,
        reason: 'AI_UNAVAILABLE',
        message: 'Operando con inteligencia local precargada.',
      },
    };
  }

  try {
    if (payload.action === 'analyze_sector') {
      const sectorName = safeString(payload.data.sectorName, 160);
      const processDescription = safeString(payload.data.processDescription, 500);
      if (!sectorName && !processDescription) {
        return { statusCode: 400, body: { error: 'Describe el sector o actividad para analizar.' } };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Sector o negocio descrito por el empresario: "${sectorName}".
Actividades o procesos diarios mencionados: "${processDescription}".
Interpreta esta actividad económica en lenguaje sencillo para una micro/pequeña empresa:
1) Resume el riesgo físico prioritario más probable sin alarmismo.
2) Indica si existen indicios posibles de peligro grave o inminente que requieran precaución técnica previa (boolean).
3) Propón 2 preguntas breves adaptadas al proceso (una enfocada en conocimiento práctico del control y otra en condiciones operativas/oportunidad).
4) Sugiere 2 controles físicos genéricos pertinentes (sin marcas ni precios), respondiendo para cada uno qué peligro reduce, cómo funciona, en qué procesos aplica, qué verificar antes de adquirirlo y 2 términos genéricos de búsqueda comercial en español.`,
        config: {
          systemInstruction: SYSTEM_GUARDRAILS,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sectorLabel: { type: Type.STRING },
              mainRiskSummary: { type: Type.STRING },
              possibleSevereHazard: { type: Type.BOOLEAN },
              severeWarningNote: { type: Type.STRING },
              contextualQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    component: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                  },
                },
              },
              suggestedControls: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hazardReduced: { type: Type.STRING },
                    howItWorks: { type: Type.STRING },
                    suitableProcesses: { type: Type.STRING },
                    verifyBeforeBuying: { type: Type.STRING },
                    searchTerms: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return { statusCode: 200, body: { fallback: false, result: parsed } };
    }

    if (payload.action === 'personalize_reflection') {
      const companyName = safeString(payload.data.companyName, 120) || 'tu empresa';
      const sectorName = safeString(payload.data.sectorName, 140);
      const activity = safeString(payload.data.activity, 200);
      const primaryBarrier = safeString(payload.data.primaryBarrier, 40);
      const subBarrier = safeString(payload.data.subBarrier, 60);
      const eisenhowerQuadrant = safeString(payload.data.eisenhowerQuadrant, 80);
      const statedFacts = safeString(payload.data.statedFacts, 450);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Datos reales expresados por el usuario (no inventes emociones ni datos adicionales):
- Empresa: ${companyName}
- Sector: ${sectorName}
- Actividad o riesgo priorizado: ${activity}
- Barrera principal COM-B detectada por reglas locales: ${primaryBarrier} (matiz: ${subBarrier})
- Prioridad percibida en Matriz de Eisenhower: ${eisenhowerQuadrant}
- Respuestas clave dadas por el usuario: ${statedFacts}

Redacta una intervención breve y empática siguiendo: Identificación personal -> Reflexión -> Confianza para actuar -> Primer paso.
Si la barrera es de Capacidad, mantén un tono práctico y didáctico sin insistir en discursos emocionales.
Si es de Oportunidad, enfócate en destrabar tiempo, recursos o proveedores con un primer paso viable.
Si es de Motivación, transforma la confianza pasiva o presión diaria en cuidado activo.`,
        config: {
          systemInstruction: SYSTEM_GUARDRAILS,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              empatheticMessage: { type: Type.STRING },
              reflectiveQuestion: { type: Type.STRING },
              actionBridge: { type: Type.STRING },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return { statusCode: 200, body: { fallback: false, result: parsed } };
    }

    if (payload.action === 'explain_control') {
      const controlName = safeString(payload.data.controlName, 160);
      const sectorName = safeString(payload.data.sectorName, 140);
      const activity = safeString(payload.data.activity, 200);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Explica de forma muy sencilla para un propietario de micro o pequeña empresa del sector "${sectorName}" (proceso: "${activity}") cómo funciona el control físico "${controlName}", qué 3 aspectos técnicos concretos debe verificar antes de comprarlo o instalarlo, y recuerda brevemente que no garantizamos compatibilidad automática sin revisión técnica en sitio.`,
        config: {
          systemInstruction: SYSTEM_GUARDRAILS,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plainExplanation: { type: Type.STRING },
              technicalChecks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              technicalNote: { type: Type.STRING },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return { statusCode: 200, body: { fallback: false, result: parsed } };
    }

    if (payload.action === 'suggest_search_terms') {
      const controlName = safeString(payload.data.controlName, 160);
      const sectorName = safeString(payload.data.sectorName, 140);
      const countryOrCity = safeString(payload.data.location, 80) || 'Colombia y Latinoamérica';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Sugiere 3 términos genéricos de búsqueda comercial en español para cotizar o encontrar distribuidores reales de "${controlName}" aplicable al sector "${sectorName}" (referencia geográfica: ${countryOrCity}). No inventes nombres de empresas, URLs ni precios.`,
        config: {
          systemInstruction: SYSTEM_GUARDRAILS,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              terms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              buyerTip: { type: Type.STRING },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return { statusCode: 200, body: { fallback: false, result: parsed } };
    }

    return { statusCode: 400, body: { error: 'Acción no reconocida.' } };
  } catch (err) {
    console.error('[ENTRE NOS Gemini Handler Error]:', err);
    return {
      statusCode: 200,
      body: {
        fallback: true,
        reason: 'GEMINI_REQUEST_ERROR',
        message: 'Se activó el respaldo local para mantener tu recorrido sin interrupciones.',
      },
    };
  }
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let parsedBody: GeminiRequestPayload;
  try {
    parsedBody = JSON.parse(event.body ?? '{}') as GeminiRequestPayload;
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'JSON inválido en la solicitud.' }),
    };
  }

  const result = await executeGeminiAction(parsedBody);
  return {
    statusCode: result.statusCode,
    headers,
    body: JSON.stringify(result.body),
  };
};
