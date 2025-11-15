import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aura Spa - Reserva Servicios Terapéuticos a Domicilio',
    short_name: 'Aura Spa',
    description:
      'Reserva servicios terapéuticos profesionales a domicilio con Aura Spa.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#075257',
    lang: 'es',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/soulbalance.png',
        type: 'image/png',
        sizes: '1200x630',
      },
    ],
    shortcuts: [
      {
        name: 'Reservar masaje',
        short_name: 'Reservar',
        url: '/servicios',
        description: 'Explora y reserva masajes terapéuticos y relajantes.',
      },
      {
        name: 'Soluciones corporativas',
        short_name: 'Empresas',
        url: '/empresarial',
        description: 'Descubre jornadas de bienestar corporativo y formaciones.',
      },
    ],
    categories: ['health', 'wellness', 'lifestyle'],
    id: '/',
  }
}
