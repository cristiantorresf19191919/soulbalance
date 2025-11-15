export interface ServiceOption {
  value: string
  label: string
}

export interface ServiceCategory {
  id: string
  name: string
  icon?: string
  services: ServiceOption[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'relajantes',
    name: 'Masajes Relajantes',
    icon: 'fa-spa',
    services: [
      { value: 'relajante', label: 'Masaje Relajante' },
      { value: 'piedras', label: 'Masaje con Piedras Volcánicas' },
      { value: 'vela', label: 'Masaje con Vela' },
      { value: 'pindas', label: 'Masaje con Pindas' },
      { value: 'soulbalance', label: 'Masaje Aura Spa - Cuatro Elementos' },
    ]
  },
  {
    id: 'terapeuticos',
    name: 'Masajes Terapéuticos',
    icon: 'fa-heart-pulse',
    services: [
      { value: 'descontracturante', label: 'Masaje Descontracturante' },
      { value: 'tejido', label: 'Masaje de Tejido Profundo' },
      { value: 'espalda', label: 'Masaje Terapéutico de Espalda' },
      { value: 'deportivo', label: 'Masaje Deportivo' },
    ]
  },
  {
    id: 'especializados',
    name: 'Masajes Especializados',
    icon: 'fa-user-doctor',
    services: [
      { value: 'prenatal', label: 'Masaje Prenatal' },
      { value: 'craneo', label: 'Masaje Cráneo Facial' },
      { value: 'piernas', label: 'Masaje Piernas Cansadas' },
      { value: 'drenaje', label: 'Drenaje Linfático Manual' },
    ]
  },
  {
    id: 'premium',
    name: 'Experiencias Premium',
    icon: 'fa-star',
    services: [
      { value: '4manos', label: 'Masaje a 4 Manos' },
      { value: 'pareja', label: 'Masaje en Pareja' },
      { value: 'bambu', label: 'Bambuterapia' },
    ]
  },
  {
    id: 'spa',
    name: 'SPA y Cuidado Personal',
    icon: 'fa-hands-bubbles',
    services: [
      { value: 'manos', label: 'SPA de Manos' },
      { value: 'pies', label: 'SPA de Pies' },
    ]
  },
  {
    id: 'empresariales',
    name: 'Servicios Corporativos',
    icon: 'fa-building',
    services: [
      { value: 'empresarial', label: 'Servicios Empresariales' },
    ]
  },
  {
    id: 'otros',
    name: 'Otros',
    icon: 'fa-ellipsis',
    services: [
      { value: 'otro', label: 'Otro servicio' },
    ]
  }
]

// Flat list for backwards compatibility and easy lookup
export const allServiceOptions: ServiceOption[] = serviceCategories.flatMap(
  category => category.services
)

// Helper function to get service label by value
export function getServiceLabel(value: string): string {
  const service = allServiceOptions.find(opt => opt.value === value)
  return service?.label || value
}

// Helper function to get category by service value
export function getServiceCategory(serviceValue: string): ServiceCategory | undefined {
  return serviceCategories.find(category => 
    category.services.some(service => service.value === serviceValue)
  )
}

