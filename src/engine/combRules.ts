import { COMB_QUESTIONS, EISENHOWER_OPTIONS } from '../data/sectorsAndQuestions';
import {
  BusinessContext,
  ComBAssessment,
  ComBComponent,
  ComBPrimaryResult,
  SubBarrierType,
} from '../types/entreNos';

const MAX_COMPONENT_FRICTION: Record<ComBComponent, number> = {
  motivation: 11.5,
  capability: 8.5,
  opportunity: 9.0,
};

export function isSevereHazardContext(business: BusinessContext): boolean {
  return (
    business.severeHazardResponse === 'yes' ||
    Boolean(business.aiSectorAnalysis?.possibleSevereHazard)
  );
}

export function evaluateComBProfile(
  business: BusinessContext,
  answers: Record<string, string>,
  contextualNotes: Record<string, string> = {}
): ComBAssessment {
  const rawFriction: Record<ComBComponent, number> = {
    motivation: 0,
    capability: 0,
    opportunity: 0,
  };

  const subBarrierWeights: Partial<Record<SubBarrierType, number>> = {};
  const statedFacts: string[] = [];

  for (const q of COMB_QUESTIONS) {
    const selectedId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedId);
    if (!opt) continue;

    if (opt.friction.motivation) rawFriction.motivation += opt.friction.motivation;
    if (opt.friction.capability) rawFriction.capability += opt.friction.capability;
    if (opt.friction.opportunity) rawFriction.opportunity += opt.friction.opportunity;

    if (opt.subBarrier) {
      const weight =
        (opt.friction.motivation ?? 0) +
        (opt.friction.capability ?? 0) +
        (opt.friction.opportunity ?? 0);
      subBarrierWeights[opt.subBarrier] = (subBarrierWeights[opt.subBarrier] ?? 0) + weight;
    }

    if (opt.factSummary) {
      statedFacts.push(opt.factSummary);
    }
  }

  // Ajuste complementario por Matriz de Eisenhower (solo refuerza señal de urgencia/postergación, nunca sustituye riesgo)
  if (
    business.eisenhowerQuadrant === 'important_not_urgent' ||
    business.eisenhowerQuadrant === 'delegate_later'
  ) {
    rawFriction.motivation += 1.0;
    if (business.eisenhowerQuadrant === 'important_not_urgent') {
      subBarrierWeights.production_pressure = (subBarrierWeights.production_pressure ?? 0) + 1.0;
    }
  }

  const ratios: Record<ComBComponent, number> = {
    motivation: Math.min(1, rawFriction.motivation / MAX_COMPONENT_FRICTION.motivation),
    capability: Math.min(1, rawFriction.capability / MAX_COMPONENT_FRICTION.capability),
    opportunity: Math.min(1, rawFriction.opportunity / MAX_COMPONENT_FRICTION.opportunity),
  };

  const toLevel = (r: number): 'high_friction' | 'moderate_friction' | 'low_friction' => {
    if (r >= 0.48) return 'high_friction';
    if (r >= 0.22) return 'moderate_friction';
    return 'low_friction';
  };

  const internalLevels: ComBAssessment['internalLevels'] = {
    motivation: toLevel(ratios.motivation),
    capability: toLevel(ratios.capability),
    opportunity: toLevel(ratios.opportunity),
  };

  const ordered = (['motivation', 'capability', 'opportunity'] as ComBComponent[]).sort(
    (a, b) => ratios[b] - ratios[a]
  );

  const top = ordered[0];
  const second = ordered[1];

  let primaryBarrier: ComBPrimaryResult = top;
  let secondaryBarrier: ComBComponent | null = null;

  // Regla transparente para combinación de varios componentes:
  // Si el componente principal y el segundo presentan fricción relevante (>= 0.42) y cercanía (<= 0.14)
  if (ratios[top] >= 0.42 && ratios[second] >= 0.42 && ratios[top] - ratios[second] <= 0.14) {
    primaryBarrier = 'combined';
    secondaryBarrier = second;
  } else if (ratios[top] < 0.22) {
    // Si las tres barreras son bajas, orientamos hacia oportunidad práctica de acción
    primaryBarrier = 'opportunity';
  }

  // Determinar sub-barrera predominante coherente con el componente principal
  const subBarriersByComponent: Record<ComBComponent, SubBarrierType[]> = {
    motivation: ['family_trust', 'overconfidence', 'production_pressure'],
    capability: ['knowledge_gap', 'verification_gap'],
    opportunity: ['resource_time', 'supplier_access', 'authority_support'],
  };

  const focusComponent: ComBComponent = primaryBarrier === 'combined' ? top : primaryBarrier;
  const candidateSubs = subBarriersByComponent[focusComponent];
  let dominantSubBarrier: SubBarrierType = candidateSubs[0];
  let bestSubScore = -1;

  for (const sub of candidateSubs) {
    const score = subBarrierWeights[sub] ?? 0;
    if (score > bestSubScore) {
      bestSubScore = score;
      dominantSubBarrier = sub;
    }
  }

  const {
    interpretationHeadline,
    interpretationBody,
    interventionTitle,
    interventionMessage,
    reflectiveQuestion,
    actionBridge,
    opportunityRoutes,
  } = buildDeterministicMessages(primaryBarrier, top, secondaryBarrier, dominantSubBarrier, ratios);

  const eisenhowerMeta = EISENHOWER_OPTIONS.find((e) => e.id === business.eisenhowerQuadrant);
  const severeActive = isSevereHazardContext(business);

  let eisenhowerInsight = '';
  if (severeActive) {
    eisenhowerInsight =
      'Aunque en la matriz marcaste cómo percibes hoy la urgencia, los indicios de peligro grave o inminente tienen prioridad absoluta: ninguna clasificación subjetiva permite postergar la protección ni autoriza seguir operando con exposición directa.';
  } else if (business.eisenhowerQuadrant === 'important_not_urgent') {
    eisenhowerInsight =
      'Marcaste esta mejora como «Importante, pero no urgente». Es el punto exacto donde muchas buenas decisiones quedan esperando: sabes que ayuda, pero algo concreto en tu entorno o rutina está frenando el primer paso.';
  } else if (business.eisenhowerQuadrant === 'delegate_later') {
    eisenhowerInsight =
      'Hoy percibes que esto «puede esperar para más adelante». Precisamente revisaremos qué hay detrás de esa calma para decidir con claridad antes de que ocurra una novedad en el trabajo.';
  } else {
    eisenhowerInsight = `Tu ubicación inicial en la matriz (${eisenhowerMeta?.title ?? 'Prioridad activa'}) muestra disposición a mirar este riesgo; ahora nos enfocamos en despejar lo que todavía dificulta ejecutarlo.`;
  }

  return {
    answers,
    contextualNotes,
    internalLevels,
    primaryBarrier,
    secondaryBarrier,
    dominantSubBarrier,
    interpretationHeadline,
    interpretationBody,
    eisenhowerInsight,
    interventionTitle,
    interventionMessage,
    reflectiveQuestion,
    actionBridge,
    opportunityRoutes,
    userReflectionNote: '',
    statedFacts,
    aiPersonalizedUsed: false,
  };
}

function buildDeterministicMessages(
  primaryBarrier: ComBPrimaryResult,
  topComponent: ComBComponent,
  secondaryBarrier: ComBComponent | null,
  subBarrier: SubBarrierType,
  ratios: Record<ComBComponent, number>
) {
  const effectiveFocus = primaryBarrier === 'combined' ? topComponent : primaryBarrier;

  if (effectiveFocus === 'motivation') {
    if (subBarrier === 'family_trust') {
      return {
        interpretationHeadline: 'La cercanía y la confianza hoy están reemplazando la barrera física',
        interpretationBody:
          'Trabajas con personas de mucha confianza o familia y sienten que cuidarse de palabra basta. Esa cercanía es un gran valor, pero por sí sola no detiene un accidente.',
        interventionTitle: 'Ser cercanos también es protegernos mejor',
        interventionMessage:
          'Nos contaste que trabajas con personas cercanas y confías en su experiencia. Esa confianza es valiosa, pero no hace desaparecer los riesgos. Precisamente porque se conocen y se cuidan, vale la pena acompañarla de protecciones físicas. Ser cercanos debería motivarnos a cuidarnos más, no a protegernos menos.',
        reflectiveQuestion:
          '¿Qué podrías cambiar hoy para que esa confianza también se convierta en protección?',
        actionBridge:
          'No hace falta cambiar la forma en que se tratan; basta con sumar una barrera física que cuide a quienes más aprecias.',
        opportunityRoutes: [],
      };
    }

    if (subBarrier === 'overconfidence') {
      return {
        interpretationHeadline: 'La experiencia del equipo genera confianza, pero también puede ocultar el riesgo',
        interpretationBody:
          'Como las personas con las que trabajas dominan su oficio y no ha ocurrido algo grave recientemente, es natural sentir que una protección adicional sobra.',
        interventionTitle: 'Cuidar la experiencia con respaldo físico',
        interventionMessage:
          'La experiencia de tu equipo es valiosa. Una protección física puede ayudar a cuidarla. Incluso quienes llevan años en el mismo proceso pueden tener un segundo de cansancio, distracción o una falla inesperada del material.',
        reflectiveQuestion:
          '¿Qué podrías cambiar hoy para que la experiencia de tu equipo cuente también con un respaldo físico?',
        actionBridge:
          'Veamos protecciones prácticas que acompañan el oficio diario sin volver lento el trabajo.',
        opportunityRoutes: [],
      };
    }

    // production_pressure
    return {
      interpretationHeadline: 'El ritmo diario del negocio está empujando la seguridad para después',
      interpretationBody:
        'Parece que sabes que existe el riesgo, pero las necesidades diarias de tu negocio están haciendo que lo dejes para después.',
      interventionTitle: 'Proteger a tu equipo es cuidar la continuidad de tu negocio',
      interventionMessage:
        'Sacar adelante los pedidos y responderles a los clientes exige toda tu atención. Sin embargo, proteger a tu equipo también es cuidar la continuidad de tu negocio: un solo incidente puede frenar la operación mucho más que dedicar unos minutos hoy a elegir una solución viable.',
      reflectiveQuestion:
        '¿Qué pequeño paso podrías dar esta semana para proteger al equipo sin descuidar tus entregas?',
      actionBridge:
        'Te mostraremos alternativas concretas y rápidas de evaluar para que no tengas que frenar todo tu negocio.',
      opportunityRoutes: [],
    };
  }

  if (effectiveFocus === 'capability') {
    const isVerification = subBarrier === 'verification_gap';
    return {
      interpretationHeadline: isVerification
        ? 'Tienes la intención de actuar, pero te falta saber cómo comprobar la solución adecuada'
        : 'Quieres proteger a tu equipo, pero todavía no tienes claro qué solución utilizar',
      interpretationBody: isVerification
        ? 'Sabes que hace falta una protección, pero no tienes una guía clara para verificar si un control es compatible con tu equipo.'
        : 'No te falta compromiso con tu gente; lo que hoy frena el avance es no saber exactamente qué protección existe o qué pedir.',
      interventionTitle: 'Claridad práctica antes de comprar',
      interventionMessage:
        'No tienes que conocer todas las soluciones. Lo importante es empezar por encontrar la adecuada. Podemos ayudarte a explorar qué protecciones físicas existen para tu proceso y qué debes verificar antes de implementarlas.',
      reflectiveQuestion:
        'De lo que verás a continuación, ¿qué detalle técnico te daría más tranquilidad confirmar antes de cotizar?',
      actionBridge:
        'Revisa las fichas ilustradas con lenguaje sencillo y la lista corta de verificación técnica para tu equipo.',
      opportunityRoutes: [],
    };
  }

  // Opportunity (o combinación liderada por oportunidad / all-low)
  if (ratios.motivation < 0.22 && ratios.capability < 0.22 && ratios.opportunity < 0.22) {
    return {
      interpretationHeadline: 'Ya tienes disposición y claridad para dar el paso',
      interpretationBody:
        'Cuentas con buena claridad sobre el riesgo y la protección. El foco ahora es elegir el mejor camino práctico para concretarlo.',
      interventionTitle: 'De la intención a una acción concreta',
      interventionMessage:
        'Sabemos que el tiempo y los recursos importan. Ya tienes lo más importante: la voluntad de cuidar a tu equipo. Demos forma al siguiente paso concreto para hacerlo realidad.',
      reflectiveQuestion:
        '¿Cuál es la acción más sencilla que puedes activar esta semana para acercarte a la instalación?',
      actionBridge:
        'Selecciona el control que mejor se adapte a tu taller o negocio y define quién dará el primer paso.',
      opportunityRoutes: [
        'Buscar proveedores reales',
        'Consultar precios de referencia',
        'Verificar compatibilidad en el equipo',
      ],
    };
  }

  const secondaryNote =
    primaryBarrier === 'combined' && secondaryBarrier === 'capability'
      ? ' Además, revisaremos primero qué debes comprobar técnicamente para no perder tiempo ni dinero.'
      : primaryBarrier === 'combined' && secondaryBarrier === 'motivation'
        ? ' Al elegir un primer paso pequeño, también será más fácil evitar que la rutina diaria lo vuelva a aplazar.'
        : '';

  return {
    interpretationHeadline: 'Ya sabes qué necesitas, pero condiciones prácticas dificultan avanzar',
    interpretationBody:
      'Ya sabes qué necesitas, pero encontrar quién lo suministre, el presupuesto, el tiempo o coordinar la instalación está dificultando que avances.' +
      secondaryNote,
    interventionTitle: 'Destrabemos los obstáculos paso a paso',
    interventionMessage:
      subBarrier === 'resource_time'
        ? 'Sabemos que cada inversión cuenta. Compare opciones y requisitos para encontrar una alternativa viable. Veamos qué alternativas tienes disponibles y cuál podría ser tu primer paso sin comprometer el flujo diario.'
        : 'Sabemos que el tiempo y los recursos importan. Veamos qué alternativas tienes disponibles y cuál podría ser tu primer paso para resolver la búsqueda o el apoyo técnico.',
    reflectiveQuestion:
      '¿Qué obstáculo concreto (cotización, autorización o instalación) necesitas destrabar primero?',
    actionBridge:
      'Usa estas rutas prácticas para avanzar según lo que hoy está en tus manos.',
    opportunityRoutes: [
      'Buscar proveedores locales o en línea',
      'Consultar precios mediante cotización formal',
      'Solicitar asesoría técnica competente',
      'Verificar compatibilidad antes de comprar',
      'Identificar quién puede autorizar la adquisición',
    ],
  };
}
