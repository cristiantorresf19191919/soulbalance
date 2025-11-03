export interface Service {
  id: string
  name: string
  description: string
  image: string
  pricing: Array<{ duration: string; price: string }>
}

export const services: Service[] = [
  {
    id: 'relajante',
    name: 'Masaje Relajante',
    description: 'Un masaje suave diseñado para liberar el estrés, calmar la mente y restaurar la armonía entre cuerpo y emociones. Renueva tu energía, mejora tu bienestar y te ofrece la paz interior que mereces.',
    image: '/services/masajeRelajante.jpg',
    pricing: [
      { duration: '60 min', price: '$130.000' },
      { duration: '90 min', price: '$170.000' },
      { duration: '120 min', price: '$210.000' }
    ]
  },
  {
    id: 'descontracturante',
    name: 'Masaje Descontracturante',
    description: 'Masaje profundo que disuelve nudos musculares y alivia el dolor, liberando la tensión acumulada. Utiliza técnicas focalizadas para devolver ligereza y movilidad, promoviendo el bienestar y el equilibrio físico total.',
    image: '/services/masajeDescontracturante.jpg',
    pricing: [
      { duration: '60 min', price: '$140.000' },
      { duration: '90 min', price: '$180.000' },
      { duration: '120 min', price: '$220.000' }
    ]
  },
  {
    id: 'piedras',
    name: 'Masaje con Piedras Volcánicas',
    description: 'Experimenta la renovación a través del calor de las piedras volcánicas. Su penetración profunda disuelve la tensión muscular, equilibra la energía y genera una profunda sensación de calma. Ideal para reconectar con tu fuerza interior.',
    image: '/services/masajesPiedrasVolcanicas.jpg',
    pricing: [
      { duration: '60 min', price: '$150.000' },
      { duration: '90 min', price: '$190.000' },
      { duration: '120 min', price: '$230.000' }
    ]
  },
  {
    id: 'prenatal',
    name: 'Masaje Prenatal',
    description: 'Diseñado especialmente para futuras mamás. Este masaje alivia eficazmente la espalda, piernas y pies, reduce la hinchazón y crea un espacio de calma y profunda conexión con tu bebé.',
    image: '/services/masajePreNatal.jpg',
    pricing: [
      { duration: '60 min', price: '$145.000' },
      { duration: '90 min', price: '$185.000' },
      { duration: '120 min', price: '$225.000' }
    ]
  },
  {
    id: '4manos',
    name: 'Masaje a 4 Manos',
    description: 'Dos terapeutas en perfecta sincronía envuelven tu cuerpo con un ritmo único de movimientos. Esta experiencia envolvente multiplica la relajación y equilibra tu energía de manera profunda.',
    image: '/services/masajes4Manos.jpg',
    pricing: [
      { duration: '30 min', price: '$130.000' },
      { duration: '60 min', price: '$170.000' },
      { duration: '90 min', price: '$210.000' }
    ]
  },
  {
    id: 'piernas',
    name: 'Masaje Piernas Cansadas',
    description: 'Masaje revitalizante que estimula la circulación, reduce la fatiga y devuelve frescura y descanso a tus piernas.',
    image: '/services/masajePiernasCansadas.jpg',
    pricing: [
      { duration: '30 min', price: '$100.000' },
      { duration: '60 min', price: '$140.000' }
    ]
  },
  {
    id: 'vela',
    name: 'Masaje con Vela',
    description: 'Terapia con velas aromáticas que combinan el calor suave con aceites esenciales. Genera una experiencia sensorial única que nutre la piel, relaja profundamente y restaura la energía vital.',
    image: '/services/masajeVela.jpg',
    pricing: [
      { duration: '60 min', price: '$155.000' },
      { duration: '90 min', price: '$195.000' }
    ]
  },
  {
    id: 'drenaje',
    name: 'Drenaje Linfático Manual',
    description: 'Técnica manual suave que activa la circulación linfática, elimina toxinas y reduce la retención de líquidos. Mejora el sistema inmunológico y aporta una sensación de ligereza y bienestar integral.',
    image: '/services/drenajeLinfaticoManual.jpg',
    pricing: [
      { duration: '60 min', price: '$145.000' },
      { duration: '90 min', price: '$185.000' }
    ]
  },
  {
    id: 'bambu',
    name: 'Bambuterapia',
    description: 'Masaje revitalizante utilizando varillas de bambú calientes. Mejora la circulación, tonifica los tejidos y libera la tensión muscular, creando una experiencia exótica y profundamente relajante.',
    image: '/services/bambuTerapia.jpg',
    pricing: [
      { duration: '60 min', price: '$160.000' },
      { duration: '90 min', price: '$200.000' }
    ]
  },
  {
    id: 'pindas',
    name: 'Masaje con Pindas',
    description: 'Bolsitas herbales tibias llenas de hierbas medicinales que liberan sus propiedades curativas sobre tu cuerpo. Equilibra los doshas, alivia el dolor y fomenta un estado de profunda calma y armonía.',
    image: '/services/masajeConPindas.jpg',
    pricing: [
      { duration: '60 min', price: '$150.000' },
      { duration: '90 min', price: '$190.000' }
    ]
  },
  {
    id: 'tejido',
    name: 'Masaje de Tejido Profundo',
    description: 'Técnica intensa que trabaja las capas profundas de los músculos y tejidos conectivos. Ideal para lesiones crónicas y contracturas persistentes, liberando tensiones profundas y mejorando la movilidad.',
    image: '/services/masajeTejidoProfundo.jpg',
    pricing: [
      { duration: '60 min', price: '$145.000' },
      { duration: '90 min', price: '$185.000' }
    ]
  },
  {
    id: 'craneo',
    name: 'Masaje Cráneo Facial',
    description: 'Liberación craneosacral y facial que suaviza las líneas de expresión, alivia dolores de cabeza, reduce el estrés y promueve una sensación de relajación profunda en rostro y cuero cabelludo.',
    image: '/services/masajeCraneoFacial.jpg',
    pricing: [
      { duration: '45 min', price: '$125.000' },
      { duration: '60 min', price: '$155.000' }
    ]
  },
  {
    id: 'espalda',
    name: 'Masaje Terapéutico de Espalda',
    description: 'Enfoque especializado en la columna vertebral y músculos de la espalda. Reduce tensiones, mejora la postura y alivia dolores crónicos, devolviendo flexibilidad y equilibrio a tu zona central.',
    image: '/services/masajeTerapeuticoEspalda.jpg',
    pricing: [
      { duration: '45 min', price: '$120.000' },
      { duration: '60 min', price: '$150.000' }
    ]
  },
  {
    id: 'deportivo',
    name: 'Masaje Deportivo',
    description: 'Optimizado para atletas y personas activas. Previene lesiones, acelera la recuperación muscular, mejora el rendimiento y mantiene tu cuerpo en óptimas condiciones para el entrenamiento.',
    image: '/services/masajeDeportivo.jpg',
    pricing: [
      { duration: '60 min', price: '$150.000' },
      { duration: '90 min', price: '$190.000' }
    ]
  },
  {
    id: 'pies',
    name: 'SPA de Pies',
    description: 'Exfoliación, hidratación profunda y masaje reflexológico. Trata tus pies con el cuidado que se merecen, aliviando la tensión y devolviendo suavidad y bienestar a cada paso.',
    image: '/services/spaPies.jpg',
    pricing: [
      { duration: '45 min', price: '$100.000' },
      { duration: '60 min', price: '$130.000' }
    ]
  },
  {
    id: 'manos',
    name: 'SPA de Manos',
    description: 'Tratamiento completo de exfoliación, hidratación y masaje para tus manos. Nutre la piel, fortalece las uñas y relaja la tensión acumulada por el trabajo diario.',
    image: '/services/spaManos.jpg',
    pricing: [
      { duration: '45 min', price: '$100.000' },
      { duration: '60 min', price: '$130.000' }
    ]
  }
]

