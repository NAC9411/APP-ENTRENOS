import { ComBQuestion, EisenhowerQuadrant, FollowUpStatus, SectorDefinition } from '../types/entreNos';

export const SECTORS_CATALOG: SectorDefinition[] = [
  {
    id: 'carpinteria',
    name: 'Carpintería y trabajo en madera',
    shortDesc: 'Corte, cepillado, lijado y ensamble de muebles o piezas.',
    activities: [
      {
        id: 'carp_sierra',
        label: 'Corte con sierra circular, escuadradora o ingletadora',
        typicalRisk: 'Contacto accidental con disco de corte o proyección de astillas.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_guarda_sierra', 'ctrl_empujador_retroceso', 'ctrl_parada_emergencia'],
      },
      {
        id: 'carp_polvo',
        label: 'Lijado, fresado y acabado con barnices',
        typicalRisk: 'Inhalación de polvo fino de madera y vapores en área cerrada.',
        recommendedControlIds: ['ctrl_extraccion_polvo', 'ctrl_ventilacion_local'],
      },
    ],
  },
  {
    id: 'metalmecanica',
    name: 'Metalmecánica, herrería y soldadura',
    shortDesc: 'Esmerilado, taladrado, corte de lámina y soldadura.',
    activities: [
      {
        id: 'metal_rotativas',
        label: 'Uso de taladro de pedestal, esmeril o torno',
        typicalRisk: 'Atrapamiento de manos/prendas o proyección de partículas metálicas.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_pantalla_taladro', 'ctrl_guarda_transmision', 'ctrl_parada_emergencia'],
      },
      {
        id: 'metal_soldadura',
        label: 'Soldadura eléctrica o corte con oxicorte',
        typicalRisk: 'Exposición a humos metálicos, chispas y radiación de arco.',
        recommendedControlIds: ['ctrl_mampara_soldadura', 'ctrl_extraccion_humos'],
      },
    ],
  },
  {
    id: 'construccion',
    name: 'Construcción, obra blanca y acabados',
    shortDesc: 'Trabajos en altura, enchape, corte de material y redes.',
    activities: [
      {
        id: 'const_altura',
        label: 'Trabajos sobre andamios, cubiertas o escaleras (> 1.8 m)',
        typicalRisk: 'Caída de distinto nivel por ausencia de barandas o puntos de anclaje.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_baranda_andamio', 'ctrl_linea_vida'],
      },
      {
        id: 'const_electrico',
        label: 'Conexiones provisionales o intervención de tableros',
        typicalRisk: 'Contacto eléctrico directo o cortocircuito en obra.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_bloqueo_electrico', 'ctrl_diferencial_gfci'],
      },
    ],
  },
  {
    id: 'alimentos',
    name: 'Alimentos, panadería y cocinas comerciales',
    shortDesc: 'Amasado, horneado, corte de insumos y fritura.',
    activities: [
      {
        id: 'alim_amasadora',
        label: 'Operación de amasadora, molino o rebanadora',
        typicalRisk: 'Atrapamiento o corte en rodillos, aspas y cuchillas expuestas.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_rejilla_enclavada', 'ctrl_parada_emergencia'],
      },
      {
        id: 'alim_calor',
        label: 'Manipulación de hornos, freidoras y superficies calientes',
        typicalRisk: 'Quemaduras térmicas o resbalones por grasa en piso.',
        recommendedControlIds: ['ctrl_piso_antideslizante', 'ctrl_aislamiento_termico'],
      },
    ],
  },
  {
    id: 'automotriz',
    name: 'Taller automotriz y mantenimiento mecánico',
    shortDesc: 'Elevación de vehículos, cambio de piezas, pintura y compresores.',
    activities: [
      {
        id: 'auto_elevacion',
        label: 'Trabajo bajo vehículos en gatos o elevadores',
        typicalRisk: 'Aplastamiento por falla hidráulica o apoyo inestable.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_torres_seguridad', 'ctrl_tacos_ruedas'],
      },
      {
        id: 'auto_compresor',
        label: 'Mantenimiento de tableros eléctricos o compresor de aire',
        typicalRisk: 'Arranque inesperado durante ajuste o contacto con poleas.',
        recommendedControlIds: ['ctrl_guarda_transmision', 'ctrl_bloqueo_electrico'],
      },
    ],
  },
  {
    id: 'comercio',
    name: 'Comercio, bodega y logística liviana',
    shortDesc: 'Almacenamiento en estanterías, cargue manual y despachos.',
    activities: [
      {
        id: 'com_estanteria',
        label: 'Almacenamiento en estanterías y acceso a niveles altos',
        typicalRisk: 'Caída de objetos o volcamiento de estantería sin anclaje.',
        recommendedControlIds: ['ctrl_anclaje_estanteria', 'ctrl_escalera_plataforma'],
      },
      {
        id: 'com_pisos',
        label: 'Circulación con carretillas y zonas de carga',
        typicalRisk: 'Tropiezos, golpes con carga o resbalones en rampas.',
        recommendedControlIds: ['ctrl_piso_antideslizante', 'ctrl_topes_senalizacion'],
      },
    ],
  },
  {
    id: 'confeccion',
    name: 'Confección, textiles y marroquinería',
    shortDesc: 'Costura industrial, corte de tela en capas y planchado.',
    activities: [
      {
        id: 'conf_corte',
        label: 'Corte de tela con cortadora vertical o circular',
        typicalRisk: 'Cortes severos en manos y dedos durante el guiado de tela.',
        defaultSevereHint: true,
        recommendedControlIds: ['ctrl_guarda_corte_textil', 'ctrl_guarda_transmision'],
      },
      {
        id: 'conf_maquinas',
        label: 'Costura en máquinas planas, fileteadoras o troqueladoras',
        typicalRisk: 'Punción con aguja o atrapamiento en correas inferiores.',
        recommendedControlIds: ['ctrl_protector_aguja', 'ctrl_guarda_transmision'],
      },
    ],
  },
  {
    id: 'custom',
    name: 'Otro sector o actividad (Modo Inteligente)',
    shortDesc: 'Describe tu negocio con tus palabras para adaptar las preguntas y controles.',
    activities: [],
  },
];

export const EISENHOWER_OPTIONS: {
  id: EisenhowerQuadrant;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    id: 'urgent_important',
    title: 'Urgente e importante',
    subtitle: 'Hay que resolverlo cuanto antes',
    description: 'Siento que este riesgo requiere acción inmediata para cuidar al equipo.',
  },
  {
    id: 'important_not_urgent',
    title: 'Importante, pero no urgente',
    subtitle: 'Sabemos que hace falta, pero se va aplazando',
    description: 'Sé que ayudaría a prevenir accidentes, aunque los pedidos del día siempre pasan primero.',
  },
  {
    id: 'urgent_not_important',
    title: 'Urgente de resolver rápido, pero secundario',
    subtitle: 'Quisiera salir de esto de forma sencilla',
    description: 'Me preocupa cumplir o evitar problemas, aunque no lo veo como prioridad central.',
  },
  {
    id: 'delegate_later',
    title: 'Puede esperar para más adelante',
    subtitle: 'Hoy no lo veo como una prioridad',
    description: 'Por ahora considero que el equipo trabaja bien así como está.',
  },
];

export const COMB_QUESTIONS: ComBQuestion[] = [
  {
    id: 'm1_experience',
    component: 'motivation',
    question:
      '¿Alguna vez has considerado innecesaria una protección porque las personas de tu equipo tienen mucha experiencia?',
    options: [
      {
        id: 'm1_often',
        label: 'Sí, quienes llevan años trabajando ya saben cómo cuidarse',
        friction: { motivation: 3 },
        subBarrier: 'overconfidence',
        factSummary: 'confías en la experiencia acumulada de tu equipo para evitar accidentes',
      },
      {
        id: 'm1_sometimes',
        label: 'A veces lo he pensado, aunque sé que un descuido le puede pasar a cualquiera',
        friction: { motivation: 1.5 },
        subBarrier: 'overconfidence',
        factSummary: 'valoras la experiencia del equipo pero reconoces que puede haber descuidos',
      },
      {
        id: 'm1_no',
        label: 'No, incluso la gente más experta necesita protecciones físicas',
        friction: { motivation: 0 },
        factSummary: 'tienes claro que la experiencia no reemplaza una protección física',
      },
    ],
  },
  {
    id: 'm2_closeness',
    component: 'motivation',
    question:
      'En el trato diario con tu equipo o familiares en el negocio, ¿qué tanto sienten que ya se cuidan "de palabra" sin instalar protecciones adicionales?',
    options: [
      {
        id: 'm2_high',
        label: 'Somos muy cercanos o familia y nos cuidamos avisándonos entre nosotros',
        friction: { motivation: 3 },
        subBarrier: 'family_trust',
        factSummary: 'trabajas con personas cercanas y suelen cuidarse mediante confianza mutua',
      },
      {
        id: 'm2_mid',
        label: 'Confiamos entre nosotros, aunque a veces sentimos que falta algo más firme',
        friction: { motivation: 1 },
        subBarrier: 'family_trust',
        factSummary: 'hay cercanía en el equipo y percibes espacio para fortalecer la protección',
      },
      {
        id: 'm2_low',
        label: 'Justo porque nos apreciamos queremos contar con barreras físicas reales',
        friction: { motivation: 0 },
        factSummary: 'buscas traducir el aprecio por tu equipo en protecciones concretas',
      },
    ],
  },
  {
    id: 'm3_production',
    component: 'motivation',
    question:
      'Cuando debes entregar un pedido urgente o hay días muy pesados, ¿qué ocurre con las mejoras de seguridad pendientes?',
    options: [
      {
        id: 'm3_postpone',
        label: 'Se dejan para después porque primero hay que sacar la producción o atender clientes',
        friction: { motivation: 3, opportunity: 1 },
        subBarrier: 'production_pressure',
        factSummary: 'los pedidos urgentes suelen desplazar las mejoras de seguridad para después',
      },
      {
        id: 'm3_pause',
        label: 'Intentamos resolverlo rápido, pero casi siempre se aplaza una semana más',
        friction: { motivation: 1.5 },
        subBarrier: 'production_pressure',
        factSummary: 'la carga diaria hace que las mejoras se vayan posponiendo semana tras semana',
      },
      {
        id: 'm3_keep',
        label: 'Tratamos de no postergarlo porque parar por un accidente saldría mucho más costoso',
        friction: { motivation: 0 },
        factSummary: 'consideras clave proteger la continuidad del negocio sin aplazar mejoras',
      },
    ],
  },
  {
    id: 'm4_wellbeing',
    component: 'motivation',
    question:
      '¿Qué tan importante es para ti hoy que todas las personas que trabajan contigo regresen a casa sin lesiones?',
    options: [
      {
        id: 'm4_essential',
        label: 'Es fundamental para mí, quiero protegerlos de verdad',
        friction: { motivation: 0 },
        factSummary: 'expresas un interés genuino por que tu equipo regrese sano a casa',
      },
      {
        id: 'm4_concerned',
        label: 'Es muy importante, aunque me cuesta conectarlo con lo que hacemos cada día',
        friction: { motivation: 1.5 },
        subBarrier: 'production_pressure',
        factSummary: 'te importa el bienestar del equipo, aunque cuesta priorizarlo en la rutina diaria',
      },
      {
        id: 'm4_distant',
        label: 'Hasta ahora no ha pasado nada grave y no lo sentimos como algo urgente',
        friction: { motivation: 3 },
        subBarrier: 'overconfidence',
        factSummary: 'al no haber ocurrido incidentes recientes, no lo percibías como algo urgente',
      },
    ],
  },
  {
    id: 'c1_know_control',
    component: 'capability',
    question:
      '¿Conoces alguna protección física específica que pueda reducir este riesgo sin estorbar en el trabajo?',
    options: [
      {
        id: 'c1_none',
        label: 'No la conozco o no estoy seguro de qué tipo de protección existe para esto',
        friction: { capability: 3 },
        subBarrier: 'knowledge_gap',
        factSummary: 'todavía no tienes claridad sobre qué protección física existe para este riesgo',
      },
      {
        id: 'c1_vague',
        label: 'Tengo una idea general, pero no sabría cuál aplica mejor a nuestro caso',
        friction: { capability: 2 },
        subBarrier: 'knowledge_gap',
        factSummary: 'tienes una noción general, pero necesitas claridad sobre cuál alternativa aplica',
      },
      {
        id: 'c1_clear',
        label: 'Sí, ya sé qué tipo de protección física ayuda a controlar este riesgo',
        friction: { capability: 0 },
        factSummary: 'ya conoces el tipo de control físico que puede reducir este riesgo',
      },
    ],
  },
  {
    id: 'c2_what_to_search',
    component: 'capability',
    question:
      'Si hoy decidieras buscar e implementar un control físico, ¿sabrías exactamente qué pedir o con qué nombre buscarlo?',
    options: [
      {
        id: 'c2_no',
        label: 'No sabría con qué nombre técnico buscarlo ni qué preguntar',
        friction: { capability: 3 },
        subBarrier: 'knowledge_gap',
        factSummary: 'no sabes exactamente cómo buscar o solicitar el control adecuado',
      },
      {
        id: 'c2_partial',
        label: 'Más o menos, pero me daría miedo comprar algo que no sirva',
        friction: { capability: 2 },
        subBarrier: 'verification_gap',
        factSummary: 'te preocupa pedir una protección que luego no resulte adecuada',
      },
      {
        id: 'c2_yes',
        label: 'Sí, sé exactamente qué control buscar y qué pedir',
        friction: { capability: 0 },
        factSummary: 'sabes qué solución solicitar cuando decidas dar el paso',
      },
    ],
  },
  {
    id: 'c3_verify',
    component: 'capability',
    question:
      '¿Sabes cómo comprobar si ese control es compatible y seguro para tus máquinas, herramientas o instalaciones?',
    options: [
      {
        id: 'c3_no',
        label: 'No, no sabría qué revisar ni cuándo necesito apoyo técnico especializado',
        friction: { capability: 2.5 },
        subBarrier: 'verification_gap',
        factSummary: 'no tienes claro cómo comprobar la compatibilidad técnica en tu equipo',
      },
      {
        id: 'c3_partial',
        label: 'Revisaría lo básico, pero necesitaría una guía simple de qué verificar',
        friction: { capability: 1.5 },
        subBarrier: 'verification_gap',
        factSummary: 'te ayudaría una lista sencilla de verificación antes de adquirirlo',
      },
      {
        id: 'c3_yes',
        label: 'Sí, sé qué medidas o características comprobar (o quién lo revisa técnicamente)',
        friction: { capability: 0 },
        factSummary: 'tienes claro cómo verificar la compatibilidad o pedir revisión técnica',
      },
    ],
  },
  {
    id: 'o1_suppliers',
    component: 'opportunity',
    question:
      '¿Qué tan fácil ha sido encontrar proveedores confiables o información comercial clara para conseguir esta protección?',
    options: [
      {
        id: 'o1_hard',
        label: 'No sé dónde conseguirla ni a quién pedirle una cotización real',
        friction: { opportunity: 3 },
        subBarrier: 'supplier_access',
        factSummary: 'te ha resultado difícil identificar proveedores o cotizaciones confiables',
      },
      {
        id: 'o1_medium',
        label: 'He visto algunas opciones, pero no he tenido tiempo de comparar o llamar',
        friction: { opportunity: 1.5 },
        subBarrier: 'supplier_access',
        factSummary: 'has visto referencias, pero falta tiempo para comparar opciones reales',
      },
      {
        id: 'o1_easy',
        label: 'Ya ubico dónde venden o fabrican este tipo de protecciones',
        friction: { opportunity: 0 },
        factSummary: 'tienes identificados posibles proveedores en tu zona o en línea',
      },
    ],
  },
  {
    id: 'o2_resources_time',
    component: 'opportunity',
    question:
      '¿El presupuesto disponible o el temor a detener la operación te han frenado para implementar una mejora?',
    options: [
      {
        id: 'o2_blocked',
        label: 'Sí, el costo y no poder parar el trabajo nos han frenado por completo',
        friction: { opportunity: 3 },
        subBarrier: 'resource_time',
        factSummary: 'el presupuesto y el tiempo de parada operativa están dificultando avanzar',
      },
      {
        id: 'o2_tight',
        label: 'El presupuesto es ajustado, pero podríamos evaluarlo por etapas o cotizar primero',
        friction: { opportunity: 1.5 },
        subBarrier: 'resource_time',
        factSummary: 'necesitas cuidar cada inversión y comparar alternativas viables',
      },
      {
        id: 'o2_ok',
        label: 'Si encontramos la alternativa adecuada, podemos ajustar tiempo y presupuesto',
        friction: { opportunity: 0 },
        factSummary: 'cuentas con margen para organizar el gasto y el momento de instalación',
      },
    ],
  },
  {
    id: 'o3_support_authority',
    component: 'opportunity',
    question:
      '¿Tienes quién pueda ayudarte a instalarlo correctamente y autonomía para aprobar la compra?',
    options: [
      {
        id: 'o3_both_hard',
        label: 'Necesito aprobación de otra persona y tampoco tengo técnico de confianza para instalar',
        friction: { opportunity: 3 },
        subBarrier: 'authority_support',
        factSummary: 'requieres autorización externa y apoyo técnico para la instalación',
      },
      {
        id: 'o3_one_hard',
        label: 'Puedo decidir (o gestionarlo), pero necesito orientación técnica para instalarlo bien',
        friction: { opportunity: 1.5 },
        subBarrier: 'authority_support',
        factSummary: 'necesitas respaldo técnico para asegurar una instalación correcta',
      },
      {
        id: 'o3_ready',
        label: 'Puedo aprobar la acción y tengo cómo coordinar la instalación',
        friction: { opportunity: 0 },
        factSummary: 'cuentas con autonomía para decidir y coordinar la instalación',
      },
    ],
  },
];

export const FIRST_STEP_OPTIONS: string[] = [
  'Consultar precios y proveedores',
  'Solicitar una cotización',
  'Verificar qué control necesita mi equipo',
  'Solicitar apoyo técnico',
  'Gestionar la autorización de compra',
  'Coordinar la instalación',
];

export const RESPONSIBLE_OPTIONS: string[] = [
  'Yo mismo',
  'Propietario',
  'Administrador',
  'Responsable de SST',
  'Encargado de mantenimiento',
  'Otra persona',
];

export const FOLLOW_UP_STATES: {
  id: FollowUpStatus;
  label: string;
  description: string;
  stepOrder: number;
}[] = [
  {
    id: 'not_started',
    label: 'Todavía no he comenzado',
    description: 'El compromiso está definido, pero aún no se ha ejecutado el primer paso.',
    stepOrder: 1,
  },
  {
    id: 'consulted_alternatives',
    label: 'Ya consulté alternativas',
    description: 'Revisé opciones comerciales o especificaciones técnicas compatibles.',
    stepOrder: 2,
  },
  {
    id: 'requested_quote',
    label: 'Ya solicité una cotización',
    description: 'Contacté a proveedores o técnico para obtener costo y plazo real.',
    stepOrder: 3,
  },
  {
    id: 'acquired_control',
    label: 'Ya adquirí el control',
    description: 'El dispositivo o protección física ya fue comprado o fabricado.',
    stepOrder: 4,
  },
  {
    id: 'installed_control',
    label: 'Ya fue instalado',
    description: 'El control físico quedó colocado en la máquina o área de trabajo.',
    stepOrder: 5,
  },
  {
    id: 'technically_verified',
    label: 'La instalación fue verificada técnicamente',
    description: 'Una persona competente validó su funcionamiento seguro y compatibilidad.',
    stepOrder: 6,
  },
];
