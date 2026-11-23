import { PhysicalControlItem } from '../types/entreNos';

export const CONTROLS_CATALOG: PhysicalControlItem[] = [
  {
    id: 'ctrl_guarda_sierra',
    name: 'Guarda protectora transparente con cuchillo divisor para sierra',
    category: 'Resguardo de maquinaria',
    sectorIds: ['carpinteria'],
    imageUrl: '/src/assets/images/workshop_safe_guard_1795458138524.jpg',
    imageAlt: 'Sierra de banco equipada con guarda protectora amarilla transparente sobre el disco',
    hazardReduced: 'Contacto directo de manos y dedos con el disco giratorio y retroceso violento de la madera.',
    howItWorks:
      'Cubre la parte superior del disco mediante una campana transparente abatible que deja ver la línea de corte mientras impide el acceso accidental, acompañada de un cuchillo divisor detrás del disco.',
    suitableProcesses: 'Corte longitudinal y transversal en sierras circulares de banco o escuadradoras.',
    verifyBeforeBuying:
      'Diámetro exacto del disco (en pulgadas o mm), espesor del disco para el cuchillo divisor y puntos de anclaje del soporte trasero.',
    technicalChecks: [
      'Confirmar diámetro y grosor exacto de la hoja de sierra actual.',
      'Verificar que el cuchillo divisor quede alineado al plano del disco.',
      'Comprobar que la guarda suba y baje libremente según el espesor de la madera.',
    ],
    supplierSearchTerms: [
      'guarda protectora sierra circular de banco repuesto',
      'cuchillo divisor y guarda seguridad carpinteria',
    ],
  },
  {
    id: 'ctrl_empujador_retroceso',
    name: 'Bloques empujadores de seguridad y peine antirretroceso',
    category: 'Control físico de alimentación',
    sectorIds: ['carpinteria'],
    imageUrl: '/src/assets/images/workshop_safe_guard_1795458138524.jpg',
    imageAlt: 'Banco de carpintería organizado con accesorios de protección mecánica',
    hazardReduced: 'Acercamiento de dedos a menos de 15 cm de la zona de corte o fresado en piezas estrechas.',
    howItWorks:
      'Transfiere la fuerza de empuje a un mango ergonómico con base antideslizante mientras el peine presiona la madera contra la guía evitando que salte hacia atrás.',
    suitableProcesses: 'Cortes angostos en sierra de mesa, cepilladora de banco y tupí o router estacionario.',
    verifyBeforeBuying:
      'Ancho del canal guía (ranura T o riel estándar) de la mesa para fijar el peine antirretroceso.',
    technicalChecks: [
      'Medir el ancho de la ranura de la mesa de corte (comúnmente 19 mm / 3/4").',
      'Elegir base de goma de alta fricción para evitar deslizamiento sobre madera lisa.',
    ],
    supplierSearchTerms: [
      'bloque empujador seguridad sierra de mesa carpinteria',
      'peine antirretroceso featherboard para sierra',
    ],
  },
  {
    id: 'ctrl_pantalla_taladro',
    name: 'Pantalla protectora abatible para mandril de taladro',
    category: 'Resguardo de maquinaria',
    sectorIds: ['metalmecanica', 'carpinteria'],
    imageUrl: '/src/assets/images/workshop_safe_guard_1795458138524.jpg',
    imageAlt: 'Taladro de pedestal con pantalla protectora amarilla frente al mandril',
    hazardReduced: 'Atrapamiento con el portabrocas giratorio y proyección de viruta metálica o refrigerante.',
    howItWorks:
      'Rodea la zona del mandril y la broca con un visor de policarbonato resistente al impacto; en versiones con microswitch, detiene el motor al abrir la pantalla.',
    suitableProcesses: 'Perforado en taladros de pedestal o columna con piezas metálicas o madera.',
    verifyBeforeBuying:
      'Diámetro de la columna o cuello del cabezal del taladro y espacio libre vertical para cambio de brocas.',
    technicalChecks: [
      'Medir diámetro de la columna del taladro para la abrazadera de montaje.',
      'Validar si se requiere versión con microinterruptor de enclavamiento eléctrico.',
      'Confirmar altura regulable para distintos largos de broca.',
    ],
    supplierSearchTerms: [
      'guarda protectora mandril taladro de pedestal policarbonato',
      'resguardo de seguridad para taladro de columna',
    ],
  },
  {
    id: 'ctrl_guarda_transmision',
    name: 'Resguardo cerrado para poleas, bandas y engranajes',
    category: 'Resguardo de transmisión',
    sectorIds: ['metalmecanica', 'automotriz', 'confeccion', 'alimentos'],
    imageUrl: '/src/assets/images/workshop_safe_guard_1795458138524.jpg',
    imageAlt: 'Sistema mecánico protegido con cubierta física de seguridad',
    hazardReduced: 'Atrapamiento o amputación de dedos, manos o ropa en puntos de pellizco de poleas y correas.',
    howItWorks:
      'Encierra completamente los lados y parte frontal de la transmisión con chapa metálica o malla rígida fijada con tornillos (no desmontable sin herramienta).',
    suitableProcesses: 'Compresores de aire, prensas, mezcladoras, máquinas de costura industrial y tornos.',
    verifyBeforeBuying:
      'Dimensiones totales (alto, ancho, profundidad), ventilación requerida por el motor y distancia segura respecto a las aberturas de malla.',
    technicalChecks: [
      'Asegurar que los orificios de ventilación no permitan el paso de dedos hasta la polea.',
      'Verificar fijación firme con pernos para evitar vibraciones o retiro accidental.',
    ],
    supplierSearchTerms: [
      'cubierta protectora poleas y bandas compresor industrial',
      'guarda metalica de seguridad transmision industrial',
    ],
  },
  {
    id: 'ctrl_parada_emergencia',
    name: 'Botón de parada de emergencia tipo hongo con enclavamiento',
    category: 'Control eléctrico de seguridad',
    sectorIds: ['carpinteria', 'metalmecanica', 'alimentos', 'confeccion'],
    imageUrl: '/src/assets/images/electrical_lockout_control_1795458138069.jpg',
    imageAlt: 'Tablero eléctrico organizado con dispositivo de corte y protección',
    hazardReduced: 'Prolongación del daño en caso de atrapamiento, atascamiento de pieza o falla repentina.',
    howItWorks:
      'Al presionarlo con un golpe rápido de mano o rodilla corta el circuito de mando del motor y queda trabado hasta girarlo manualmente para rearmar.',
    suitableProcesses: 'Cualquier máquina estacionaria de corte, amasado, torneado o prensado.',
    verifyBeforeBuying:
      'Voltaje del circuito de mando (110V, 220V o 24V), corriente del motor y necesidad de contactor con bobina de mínima tensión (para que no rearranque sola tras un corte de luz).',
    technicalChecks: [
      'Confirmar voltaje y amperaje de la máquina con electricista calificado.',
      'Ubicar al alcance natural del operador sin tener que cruzar sobre la zona peligrosa.',
      'Probar que el equipo no vuelva a encender solo al liberar el hongo.',
    ],
    supplierSearchTerms: [
      'boton parada de emergencia tipo hongo con caja electrica',
      'interruptor parada emergencia arranque magnetico monofasico trifasico',
    ],
  },
  {
    id: 'ctrl_extraccion_polvo',
    name: 'Colector de polvo portátil con campana de captura en la fuente',
    category: 'Control de ingeniería ambiental',
    sectorIds: ['carpinteria', 'metalmecanica'],
    hazardReduced: 'Inhalación crónica de aserrín, sílice o polvo fino y acumulación inflamable en el taller.',
    howItWorks:
      'Aspira las partículas directamente en el punto donde se generan antes de que lleguen a la zona respiratoria de las personas.',
    suitableProcesses: 'Lijado, sierra de mesa, cepillado y esmerilado en talleres cerrados o semicerrados.',
    verifyBeforeBuying:
      'Caudal de aire requerido (CFM), diámetro de las bocas de salida de sus máquinas y eficiencia del filtro (micras).',
    technicalChecks: [
      'Medir diámetro de conexión de la herramienta (ej. 2.5" o 4").',
      'Evaluar filtro tipo cartucho fino (<= 1-2 micras) si hay lijado frecuente.',
    ],
    supplierSearchTerms: [
      'extractor colector de polvo para carpinteria taller',
      'aspirador industrial con filtro fino para taller',
    ],
  },
  {
    id: 'ctrl_ventilacion_local',
    name: 'Cabina o brazo de extracción localizada para vapores',
    category: 'Control de ingeniería ambiental',
    sectorIds: ['carpinteria', 'automotriz'],
    hazardReduced: 'Concentración de vapores orgánicos de lacas, pegantes o pinturas en espacios de trabajo.',
    howItWorks:
      'Crea una corriente dirigida de aire que captura vapores cerca de la pieza y los expulsa de manera segura al exterior filtrado.',
    suitableProcesses: 'Barnizado, aplicación de pegantes de contacto y retoque de pintura.',
    verifyBeforeBuying:
      'Motor a prueba de explosión o fuera del flujo directo si maneja solventes inflamables.',
    technicalChecks: [
      'Confirmar que el motor del extractor no genere chispas dentro del ducto de solventes.',
      'Validar recorrido de descarga hacia el exterior sin afectar áreas vecinas.',
    ],
    supplierSearchTerms: [
      'extractor axial antiexplosivo cabina pintura barniz',
      'brazo extractor de vapores y humos taller',
    ],
  },
  {
    id: 'ctrl_mampara_soldadura',
    name: 'Mampara o cortina ignífuga translúcida para arco de soldadura',
    category: 'Barrera física colectiva',
    sectorIds: ['metalmecanica'],
    hazardReduced: 'Lesiones oculares por destellos de arco en terceros y proyección de chispas hacia zonas vecinas.',
    howItWorks:
      'Aísla visual y físicamente el puesto de soldadura mediante láminas de PVC ignífugo filtrante UV montadas en marco móvil.',
    suitableProcesses: 'Puestos de soldadura eléctrica MIG/TIG/electrodo dentro de talleres compartidos.',
    verifyBeforeBuying:
      'Certificación ignífuga del material, altura mínima de cobertura y estabilidad de las ruedas o patas.',
    technicalChecks: [
      'Verificar norma de filtrado UV para arco eléctrico.',
      'Comprobar que no bloquee salidas de emergencia ni ventilación del puesto.',
    ],
    supplierSearchTerms: [
      'mampara cortina de soldadura ignifuga con marco',
      'biombo protector para soldadura industrial',
    ],
  },
  {
    id: 'ctrl_extraccion_humos',
    name: 'Extractor portátil de humos de soldadura con boquilla magnética',
    category: 'Control de ingeniería ambiental',
    sectorIds: ['metalmecanica'],
    hazardReduced: 'Inhalación directa de humos metálicos tóxicos generados al fundir electrodos y metales.',
    howItWorks:
      'Coloca la campana de succión a pocos centímetros del arco eléctrico filtrando partículas metálicas y gases.',
    suitableProcesses: 'Soldadura continua en mesas de armado o estructuras dentro de locales cerrados.',
    verifyBeforeBuying:
      'Tipo de filtro (HEPA + carbón activado según aleación) y longitud del brazo articulado.',
    technicalChecks: [
      'Confirmar si suelda acero inoxidable o galvanizado (requiere mayor eficiencia de filtrado).',
      'Revisar facilidad de reemplazo de filtros consumibles.',
    ],
    supplierSearchTerms: [
      'extractor portatil de humos de soldadura filtro',
      'captador de humos soldadura brazo flexible',
    ],
  },
  {
    id: 'ctrl_baranda_andamio',
    name: 'Sistema completo de barandas perimetrales y rodapiés certificados',
    category: 'Protección colectiva contra caídas',
    sectorIds: ['construccion'],
    hazardReduced: 'Caídas de altura desde plataformas de trabajo y caída de herramientas hacia niveles inferiores.',
    howItWorks:
      'Establece una barrera física rígida a 1 m y 0.5 m de altura más un rodapié en todo el borde expuesto del andamio o losa.',
    suitableProcesses: 'Armado de andamios tubulares multidireccionales, fachadas y bordes de losa.',
    verifyBeforeBuying:
      'Compatibilidad con el sistema de andamio existente (roseta/tubo) y resistencia certificada a carga lateral.',
    technicalChecks: [
      'Comprobar que el andamio cuente con niveladores, diagonales y plataformas completas antideslizantes.',
      'Validar altura reglamentaria superior (~1.0 m), intermedia (~0.5 m) y rodapié (~0.15 m).',
    ],
    supplierSearchTerms: [
      'baranda de seguridad andamio certificado multidireccional',
      'alquiler andamio certificado con barandas y rodapies',
    ],
  },
  {
    id: 'ctrl_linea_vida',
    name: 'Puntos de anclaje certificados y línea de vida horizontal o vertical',
    category: 'Sistema de detención de caídas',
    sectorIds: ['construccion'],
    hazardReduced: 'Caída libre de trabajadores en cubiertas, escaleras fijas o bordes sin baranda.',
    howItWorks:
      'Ofrece un riel o cable certificado capaz de soportar la carga de impacto de una caída junto con el arnés y absorbedor de energía.',
    suitableProcesses: 'Mantenimiento de techos, limpieza en altura o montaje donde no es viable instalar barandas.',
    verifyBeforeBuying:
      'Capacidad estructural del punto de fijación (mínimo 5,000 lb / 22.2 kN por persona) e instalación por personal certificado.',
    technicalChecks: [
      'Nunca anclarse a tuberías, tejas ni estructuras livianas sin cálculo estructural.',
      'Verificar espacio libre de caída (requerimiento de claridad) antes del uso.',
    ],
    supplierSearchTerms: [
      'linea de vida portatil certificada trabajo en alturas',
      'punto de anclaje certificado para proteccion contra caidas',
    ],
  },
  {
    id: 'ctrl_bloqueo_electrico',
    name: 'Kit de bloqueo y etiquetado eléctrico (LOTO) para interruptores',
    category: 'Control de energías peligrosas',
    sectorIds: ['construccion', 'metalmecanica', 'automotriz', 'alimentos'],
    imageUrl: '/src/assets/images/electrical_lockout_control_1795458138069.jpg',
    imageAlt: 'Tablero eléctrico con candado amarillo de bloqueo y etiqueta de no operar',
    hazardReduced: 'Electrocución o arranque accidental de maquinaria mientras alguien realiza mantenimiento o limpieza.',
    howItWorks:
      'Bloquea mecánicamente la palanca del breaker o seccionador con un candado personal único e identifica con etiqueta quién está interviniendo.',
    suitableProcesses: 'Limpieza de mezcladoras, cambio de cuchillas, reparación eléctrica y mantenimiento preventivo.',
    verifyBeforeBuying:
      'Tipo de interruptores del tablero (unipolares, caja moldeada, clavijas industriales) para que las pinzas calcen exactamente.',
    technicalChecks: [
      'Inspeccionar el tablero para identificar si los breakers son estándar DIN o industriales.',
      'Capacitar al personal en verificación de energía cero antes de tocar partes internas.',
    ],
    supplierSearchTerms: [
      'kit bloqueo y etiquetado electrico LOTO candado breakers',
      'dispositivo bloqueo breaker industrial seguridad electrica',
    ],
  },
  {
    id: 'ctrl_diferencial_gfci',
    name: 'Interruptor diferencial (GFCI) de alta sensibilidad 30 mA o 6 mA',
    category: 'Protección eléctrica automática',
    sectorIds: ['construccion', 'alimentos', 'automotriz'],
    imageUrl: '/src/assets/images/electrical_lockout_control_1795458138069.jpg',
    imageAlt: 'Tablero eléctrico con protecciones modulares transparentes',
    hazardReduced: 'Choque eléctrico grave o fatal por fallas de aislamiento o humedad en herramientas portátiles.',
    howItWorks:
      'Detecta en milisegundos cualquier fuga de corriente hacia tierra o hacia una persona y desconecta el circuito de forma automática.',
    suitableProcesses: 'Uso de herramientas eléctricas portátiles en obra, zonas húmedas de lavado o cocinas.',
    verifyBeforeBuying:
      'Corriente nominal del circuito, sensibilidad de disparo (30 mA tablero / 5-6 mA toma GFCI) e instalación por electricista.',
    technicalChecks: [
      'Confirmar si el tablero actual tiene espacio para módulo DIN o si conviene extensión portátil GFCI.',
      'Incluir prueba mensual del botón TEST dentro de la rutina.',
    ],
    supplierSearchTerms: [
      'interruptor diferencial 30mA tablero electrico',
      'toma corriente o extension portatil con proteccion GFCI',
    ],
  },
  {
    id: 'ctrl_rejilla_enclavada',
    name: 'Rejilla o tapa protectora con microswitch de seguridad para tolva',
    category: 'Resguardo con enclavamiento',
    sectorIds: ['alimentos'],
    hazardReduced: 'Atrapamiento o mutilación de manos dentro de amasadoras, batidoras o molinos en marcha.',
    howItWorks:
      'Impide meter la mano mientras el equipo gira y corta el circuito automáticamente en el instante en que se levanta la rejilla.',
    suitableProcesses: 'Amasadoras de espiral, batidoras industriales y molinos de alimentos.',
    verifyBeforeBuying:
      'Medidas exactas del tazón o tolva, grado sanitario (acero inoxidable) y diagrama eléctrico para conectar el enclavamiento.',
    technicalChecks: [
      'Confirmar apertura máxima de varillas para que no alcancen las aspas.',
      'Asegurar que bajar la tapa NO arranque la máquina automáticamente (requiere pulsar inicio).',
    ],
    supplierSearchTerms: [
      'rejilla seguridad acero inoxidable con microswitch amasadora',
      'sensor de seguridad puerta guarda para maquinaria alimentos',
    ],
  },
  {
    id: 'ctrl_piso_antideslizante',
    name: 'Tapetes modulares o recubrimiento antideslizante drenante',
    category: 'Control físico de superficies',
    sectorIds: ['alimentos', 'comercio', 'automotriz'],
    hazardReduced: 'Caídas al mismo nivel por pisos mojados, aceites, grasas o harinas en zonas de tránsito.',
    howItWorks:
      'Crea una superficie de alta tracción con canales de drenaje y bordes biselados que evitan tropiezos.',
    suitableProcesses: 'Zonas de lavado, frente a freidoras, áreas de lubricación y rampas de bodega.',
    verifyBeforeBuying:
      'Resistencia química a grasas/aceites (nitrilo/caucho adecuado), facilidad de lavado y bordes biselados antirriego.',
    technicalChecks: [
      'Medir exactamente el área de trabajo para cubrir sin dejar uniones sueltas.',
      'Solicitar material resistente a grasa si es cocina o taller automotriz.',
    ],
    supplierSearchTerms: [
      'tapete modular antideslizante resistente a grasa cocina taller',
      'piso caucho antideslizante industrial con drenaje',
    ],
  },
  {
    id: 'ctrl_aislamiento_termico',
    name: 'Cortinas térmicas o guardas de aislamiento para superficies calientes',
    category: 'Barrera térmica física',
    sectorIds: ['alimentos', 'confeccion'],
    hazardReduced: 'Quemaduras por contacto accidental con tuberías de vapor, ductos o puertas calientes.',
    howItWorks:
      'Recubre o interpone un material aislante de baja conductividad térmica reduciendo la temperatura superficial accesible.',
    suitableProcesses: 'Hornos de panadería, calderas de planchado textil y tuberías de vapor.',
    verifyBeforeBuying:
      'Temperatura máxima de operación del equipo y compatibilidad con limpieza alimentaria si aplica.',
    technicalChecks: [
      'Medir diámetro de tuberías o área de panel expuesta.',
      'Verificar que no obstruya ventilación o sensores del horno.',
    ],
    supplierSearchTerms: [
      'chaqueta aislamiento termico removible tuberia vapor',
      'protector termico puerta horno industrial',
    ],
  },
  {
    id: 'ctrl_torres_seguridad',
    name: 'Torres o soportes mecánicos certificados (burriquetas) de alta capacidad',
    category: 'Soporte mecánico de carga',
    sectorIds: ['automotriz'],
    hazardReduced: 'Aplastamiento por descenso súbito de un gato hidráulico al trabajar bajo un vehículo.',
    howItWorks:
      'Soporta mecánicamente el peso del chasis mediante trinquete o pasador de acero sólido sin depender de presión hidráulica.',
    suitableProcesses: 'Cambio de frenos, suspensión, escapes y revisiones bajo vehículos.',
    verifyBeforeBuying:
      'Tonelaje real de los vehículos atendidos (autos vs. camionetas/camiones) y mecanismo de doble seguro con pasador.',
    technicalChecks: [
      'Usar siempre en pares sobre piso firme y nivelado.',
      'Confirmar certificación de capacidad de carga y rango de altura compatible.',
    ],
    supplierSearchTerms: [
      'torres soporte mecanico automotriz con pasador de seguridad',
      'burriquetas certificadas taller automotriz toneladas',
    ],
  },
  {
    id: 'ctrl_tacos_ruedas',
    name: 'Cuñas o tacos inmovilizadores de ruedas de servicio pesado',
    category: 'Inmovilización física',
    sectorIds: ['automotriz', 'comercio'],
    hazardReduced: 'Desplazamiento involuntario de vehículos en rampas, zonas de cargue o mantenimiento.',
    howItWorks:
      'Bloquea mecánicamente el giro de las llantas mediante geometría de cuña y caucho de alto agarre.',
    suitableProcesses: 'Bahías de mantenimiento automotriz, muelles de carga y parqueo inclinado.',
    verifyBeforeBuying:
      'Diámetro de las llantas que atiende y peso máximo del vehículo.',
    technicalChecks: [
      'Elegir caucho vulcanizado o poliuretano de alta visibilidad con asa o cuerda.',
    ],
    supplierSearchTerms: [
      'cunas tacos inmovilizadores caucho pesado vehiculos',
      'topes seguridad llantas muelle de carga',
    ],
  },
  {
    id: 'ctrl_anclaje_estanteria',
    name: 'Kit de anclaje estructural a piso/muro y topes anticaída en estanterías',
    category: 'Estabilidad estructural',
    sectorIds: ['comercio'],
    hazardReduced: 'Volcamiento de estanterías cargadas y caída de cajas sobre pasillos de trabajo.',
    howItWorks:
      'Fija las placas base de los parales al concreto mediante pernos expansivos y añade barras o mallas traseras de retención.',
    suitableProcesses: 'Bodegas de almacenamiento con estanterías metálicas de más de 1.8 m de alto.',
    verifyBeforeBuying:
      'Espesor de la placa del piso de concreto, peso máximo por nivel y compatibilidad con los perfiles de la estantería.',
    technicalChecks: [
      'Rotular claramente la carga máxima admisible por entrepaño.',
      'Verificar verticalidad de los parales antes de anclar.',
    ],
    supplierSearchTerms: [
      'pernos anclaje expansivo estanteria metalica bodega',
      'malla anticaida y protectores de columna rack almacenamiento',
    ],
  },
  {
    id: 'ctrl_escalera_plataforma',
    name: 'Escalera tipo plataforma rodante con freno automático y pasamanos',
    category: 'Acceso seguro en altura baja',
    sectorIds: ['comercio', 'alimentos'],
    hazardReduced: 'Caídas por subirse a cajas, sillas o escaleras de tijera inestables al recoger mercancía.',
    howItWorks:
      'Ofrece peldaños anchos antideslizantes, plataforma superior cercada por barandilla y ruedas que se bloquean al pisar.',
    suitableProcesses: 'Alistamiento de pedidos en estanterías altas y organización de archivo o bodega.',
    verifyBeforeBuying:
      'Altura de alcance real requerida, ancho de pasillos disponibles y capacidad de carga mínima de 150 kg.',
    technicalChecks: [
      'Medir el pasillo más estrecho de la bodega para garantizar giro cómodo.',
      'Comprobar sistema de bloqueo de ruedas al cargar peso.',
    ],
    supplierSearchTerms: [
      'escalera plataforma rodante con barandilla y freno bodega',
      'escalera tipo avion industrial almacen',
    ],
  },
  {
    id: 'ctrl_topes_senalizacion',
    name: 'Esquineros acolchados, espejos convexos y demarcación de senderos',
    category: 'Segregación física y visibilidad',
    sectorIds: ['comercio', 'automotriz'],
    hazardReduced: 'Colisiones en cruces ciegos de carretillas y golpes contra aristas metálicas.',
    howItWorks:
      'Mejora la visibilidad en esquinas sin vista y protege estructuras y personas mediante barreras visuales y acolchadas.',
    suitableProcesses: 'Pasillos de bodega, salidas de cuartos fríos y zonas de cruce peatonal.',
    verifyBeforeBuying:
      'Distancia de visión del espejo (diámetro en cm) y adherencia de cinta al tipo de piso.',
    technicalChecks: [
      'Ubicar espejos a la altura visual sin reflejar lámparas directas.',
    ],
    supplierSearchTerms: [
      'espejo convexo seguridad bodega cruce ciego',
      'cinta demarcacion piso industrial alto trafico',
    ],
  },
  {
    id: 'ctrl_guarda_corte_textil',
    name: 'Guante de malla de acero inoxidable + guarda frontal regulable de cuchilla',
    category: 'Barrera física para corte manual',
    sectorIds: ['confeccion'],
    hazardReduced: 'Cortes profundos en la mano que guía la tela frente a la cortadora vertical o circular.',
    howItWorks:
      'La guarda metálica frontal bloquea el filo excepto en la altura exacta del tendido de tela, y la malla de acero protege la mano auxiliar.',
    suitableProcesses: 'Mesas de trazo y corte de tela en capas múltiples.',
    verifyBeforeBuying:
      'Talla exacta del guante (ajuste sin holgura para no engancharse) y compatibilidad del pie prensatela/guarda con el modelo de cortadora.',
    technicalChecks: [
      'Confirmar modelo y altura de cuchilla de la máquina cortadora.',
      'Asegurar que el personal ajuste la guarda al grosor de cada tendido.',
    ],
    supplierSearchTerms: [
      'guante malla acero inoxidable corte textil carniceria',
      'guarda protectora cuchilla cortadora tela vertical',
    ],
  },
  {
    id: 'ctrl_protector_aguja',
    name: 'Protector transparente de aguja para máquina de costura industrial',
    category: 'Resguardo puntual de máquina',
    sectorIds: ['confeccion'],
    hazardReduced: 'Punción accidental de dedos bajo la aguja durante costuras rápidas o curvas cerradas.',
    howItWorks:
      'Interpone un escudo acrílico o de alambre fino justo frente al prensatelas sin impedir ver la puntada.',
    suitableProcesses: 'Máquinas planas, dos agujas, presilladoras y fileteadoras.',
    verifyBeforeBuying:
      'Tipo de barra de prensatelas y espacio disponible para el soporte lateral.',
    technicalChecks: [
      'Verificar compatibilidad con el modelo de máquina (plana vs. collarín/fileteadora).',
    ],
    supplierSearchTerms: [
      'protector de dedo aguja maquina de coser industrial',
      'guarda seguridad aguja costura plana',
    ],
  },
];
