import React from 'react';
import { Play, Rocket, CheckCircle2 } from 'lucide-react';
import { BusinessContext } from '../types/entreNos';

export interface ProfilePreset {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  description: string;
  expectedOutcome: string;
  business: BusinessContext;
  answers: Record<string, string>;
}

export const TEST_PROFILES: ProfilePreset[] = [
  {
    id: 'A',
    title: 'Caso A · Motivado, pero desconoce qué control instalar',
    description:
      'Propietario de carpintería muy comprometido con el bienestar del equipo, pero sin claridad técnica sobre qué guarda comprar ni cómo verificar compatibilidad.',
    expectedOutcome: 'Barrera principal: Capacidad → Intervención visual práctica sin sermón emocional.',
    business: {
      companyName: 'Ebanistería El Roble',
      ownerRole: 'Propietario / Gerente',
      location: 'Medellín',
      sectorId: 'carpinteria',
      sectorName: 'Carpintería y trabajo en madera',
      activityId: 'carp_sierra',
      activityLabel: 'Corte con sierra circular, escuadradora o ingletadora',
      customProcessDescription: '',
      riskEvaluated: 'Contacto accidental con disco de corte o proyección de astillas.',
      eisenhowerQuadrant: 'urgent_important',
      severeHazardResponse: 'no',
    },
    answers: {
      m1_experience: 'm1_no',
      m2_closeness: 'm2_low',
      m3_production: 'm3_keep',
      m4_wellbeing: 'm4_essential',
      c1_know_control: 'c1_none',
      c2_what_to_search: 'c2_no',
      c3_verify: 'c3_no',
      o1_suppliers: 'o1_medium',
      o2_resources_time: 'o2_ok',
      o3_support_authority: 'o3_ready',
    },
  },
  {
    id: 'B',
    title: 'Caso B · Conoce el control, pero no lo considera urgente',
    description:
      'Dueño de metalmecánica que sabe qué guarda existe, pero siente que la experiencia basta y los pedidos urgentes siempre desplazan las mejoras.',
    expectedOutcome: 'Barrera principal: Motivación (presión productiva) → Reconectar cuidado con continuidad del negocio.',
    business: {
      companyName: 'Estructuras del Norte',
      ownerRole: 'Propietario / Gerente',
      location: 'Bogotá',
      sectorId: 'metalmecanica',
      sectorName: 'Metalmecánica, herrería y soldadura',
      activityId: 'metal_rotativas',
      activityLabel: 'Uso de taladro de pedestal, esmeril o torno',
      customProcessDescription: '',
      riskEvaluated: 'Atrapamiento de manos/prendas o proyección de partículas metálicas.',
      eisenhowerQuadrant: 'important_not_urgent',
      severeHazardResponse: 'no',
    },
    answers: {
      m1_experience: 'm1_sometimes',
      m2_closeness: 'm2_mid',
      m3_production: 'm3_postpone',
      m4_wellbeing: 'm4_distant',
      c1_know_control: 'c1_clear',
      c2_what_to_search: 'c2_yes',
      c3_verify: 'c3_yes',
      o1_suppliers: 'o1_easy',
      o2_resources_time: 'o2_ok',
      o3_support_authority: 'o3_ready',
    },
  },
  {
    id: 'C',
    title: 'Caso C · Quiere actuar, pero tiene barreras económicas y operativas',
    description:
      'Administrador de panadería que sabe el riesgo y la solución, pero tiene presupuesto ajustado, no ubica proveedor ni cuenta con técnico o autorización directa.',
    expectedOutcome: 'Barrera principal: Oportunidad → Rutas concretas de cotización, autorización y apoyo técnico.',
    business: {
      companyName: 'Panadería La Espiga',
      ownerRole: 'Administrador',
      location: 'Cali',
      sectorId: 'alimentos',
      sectorName: 'Alimentos, panadería y cocinas comerciales',
      activityId: 'alim_amasadora',
      activityLabel: 'Operación de amasadora, molino o rebanadora',
      customProcessDescription: '',
      riskEvaluated: 'Atrapamiento o corte en rodillos, aspas y cuchillas expuestas.',
      eisenhowerQuadrant: 'important_not_urgent',
      severeHazardResponse: 'unsure',
    },
    answers: {
      m1_experience: 'm1_no',
      m2_closeness: 'm2_low',
      m3_production: 'm3_keep',
      m4_wellbeing: 'm4_essential',
      c1_know_control: 'c1_clear',
      c2_what_to_search: 'c2_yes',
      c3_verify: 'c3_yes',
      o1_suppliers: 'o1_hard',
      o2_resources_time: 'o2_blocked',
      o3_support_authority: 'o3_both_hard',
    },
  },
  {
    id: 'D',
    title: 'Caso D · Empresa familiar que confía en la experiencia del equipo',
    description:
      'Taller automotriz familiar donde trabajan hermanos y tíos de años de oficio, cuidándose «de palabra» sin usar soportes mecánicos ni bloqueos.',
    expectedOutcome: 'Barrera principal: Motivación (confianza familiar/experiencia) → Mensaje afectivo y pregunta reflexiva.',
    business: {
      companyName: 'Autoservicio Hermanos Ruiz',
      ownerRole: 'Propietario / Gerente',
      location: 'Bucaramanga',
      sectorId: 'automotriz',
      sectorName: 'Taller automotriz y mantenimiento mecánico',
      activityId: 'auto_elevacion',
      activityLabel: 'Trabajo bajo vehículos en gatos o elevadores',
      customProcessDescription: '',
      riskEvaluated: 'Aplastamiento por falla hidráulica o apoyo inestable.',
      eisenhowerQuadrant: 'delegate_later',
      severeHazardResponse: 'yes',
    },
    answers: {
      m1_experience: 'm1_often',
      m2_closeness: 'm2_high',
      m3_production: 'm3_pause',
      m4_wellbeing: 'm4_concerned',
      c1_know_control: 'c1_clear',
      c2_what_to_search: 'c2_partial',
      c3_verify: 'c3_yes',
      o1_suppliers: 'o1_easy',
      o2_resources_time: 'o2_tight',
      o3_support_authority: 'o3_ready',
    },
  },
  {
    id: 'E',
    title: 'Caso E · Sector nuevo mediante Modo Inteligente',
    description:
      'Emprendimiento de corte y pulido de vidrio plano (sector fuera del catálogo base), evaluado mediante Modo Inteligente.',
    expectedOutcome: 'Modo Inteligente adapta el riesgo, preguntas contextuales y controles sugeridos.',
    business: {
      companyName: 'Vidrios y Biseles del Sur',
      ownerRole: 'Propietario / Gerente',
      location: 'Barranquilla',
      sectorId: 'custom',
      sectorName: 'Vidriería y corte de espejos',
      activityId: 'custom_activity',
      activityLabel: 'Corte manual y canteado de láminas grandes de vidrio en mesa',
      customProcessDescription: 'Corte manual y pulido de láminas grandes de vidrio plano en taller pequeño.',
      riskEvaluated: 'Cortes severos por rotura o bordes filosos durante el traslado y canteado.',
      eisenhowerQuadrant: 'important_not_urgent',
      severeHazardResponse: 'unsure',
    },
    answers: {
      m1_experience: 'm1_sometimes',
      m2_closeness: 'm2_mid',
      m3_production: 'm3_pause',
      m4_wellbeing: 'm4_essential',
      c1_know_control: 'c1_vague',
      c2_what_to_search: 'c2_partial',
      c3_verify: 'c3_no',
      o1_suppliers: 'o1_medium',
      o2_resources_time: 'o2_tight',
      o3_support_authority: 'o3_one_hard',
    },
  },
];

interface DeploymentGuideViewProps {
  onLoadProfilePreset: (preset: ProfilePreset) => void;
}

export const DeploymentGuideView: React.FC<DeploymentGuideViewProps> = ({
  onLoadProfilePreset,
}) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1">
          Pruebas de funcionamiento y publicación en Netlify
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Validación de perfiles (Casos A–E) e instrucciones de despliegue
        </h1>
      </div>

      {/* Simulador interactivo de los 5 perfiles requeridos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-blue-950">
            Probar perfiles del modelo COM-B en un clic
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Carga cualquiera de los cinco escenarios de prueba para verificar cómo ENTRE NOS adapta la lectura, la intervención emocional y las soluciones sin reiniciar manualmente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEST_PROFILES.map((preset) => (
            <div
              key={preset.id}
              className="rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-3 bg-slate-50/70"
            >
              <div>
                <p className="text-sm font-bold text-blue-950">{preset.title}</p>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {preset.description}
                </p>
                <p className="text-xs font-medium text-blue-900 mt-2">
                  {preset.expectedOutcome}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLoadProfilePreset(preset)}
                className="min-h-[42px] px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                Simular {preset.id === 'E' ? 'Caso E (Modo Inteligente)' : `Caso ${preset.id}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones de publicación en Netlify */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Rocket className="w-5 h-5 text-blue-900" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            Instrucciones de publicación en Netlify (con Google Gemini seguro)
          </h2>
        </div>

        <ol className="space-y-3 text-sm text-slate-700">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
            <span>
              <strong>1. Estructura lista en el repositorio:</strong> el proyecto incluye{' '}
              <code className="font-mono-tabular text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                netlify.toml
              </code>{' '}
              y la función serverless{' '}
              <code className="font-mono-tabular text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                netlify/functions/gemini.ts
              </code>
              .
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
            <span>
              <strong>2. Parámetros de compilación en Netlify:</strong> Comando de build{' '}
              <code className="font-mono-tabular text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                npm run build
              </code>
              , directorio público{' '}
              <code className="font-mono-tabular text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                dist
              </code>{' '}
              y directorio de funciones{' '}
              <code className="font-mono-tabular text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                netlify/functions
              </code>
              .
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
            <span>
              <strong>3. Variable de entorno secreta:</strong> configura{' '}
              <code className="font-mono-tabular text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                GEMINI_API_KEY
              </code>{' '}
              únicamente en <em>Site configuration → Environment variables</em> dentro de Netlify (nunca en el frontend).
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
            <span>
              <strong>4. Continuidad garantizada:</strong> si la función de Gemini no responde o no tiene cuota disponible, el motor determinista COM-B y el catálogo precargado continúan operando sin interrupciones.
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
};
