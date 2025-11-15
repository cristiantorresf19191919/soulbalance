import type { Metadata } from 'next'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/lib/language-context'
import { FloatingChat } from '@/components/FloatingChat'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import './globals.css'

// Get site URL from environment variable or use default
// For production, set NEXT_PUBLIC_SITE_URL in your environment variables
// Example: https://soulbalance.netlify.app or your custom domain
// Remove trailing slash if present
const getSiteUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://soulbalance.netlify.app')
  return url.replace(/\/$/, '') // Remove trailing slash
}

const siteUrl = getSiteUrl()
// Ensure absolute URL for Open Graph image - required for social media sharing
const imageUrl = `${siteUrl}/soulbalance.png`

export const metadata: Metadata = {
  applicationName: 'Aura Spa',
  title: 'Aura Spa - Reserva Servicios Terapéuticos a Domicilio',
  description: 'Reserva servicios terapéuticos profesionales a domicilio. Masajes terapéuticos y relajantes con profesionales certificados.',
  keywords: [
    'masaje spa',
    'masaje a domicilio',
    'masaje terapéutico',
    'bienestar',
    'relajación',
    'Aura Spa',
    'spa a domicilio',
    'masajes profesionales',
    'terapias alternativas',
    'bienestar corporal',
    'masaje relajante',
    'masaje descontracturante',
    'drenaje linfático',
    'masaje con piedras volcánicas',
    'bambú terapia',
  ],
  authors: [{ name: 'Aura Spa' }],
  creator: 'Aura Spa',
  publisher: 'Aura Spa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: 'Aura Spa',
    title: 'Aura Spa - Reserva Servicios Terapéuticos a Domicilio',
    description: 'Reserva servicios terapéuticos profesionales a domicilio. Masajes terapéuticos y relajantes con profesionales certificados.',
    images: [
      {
        url: imageUrl, // Absolute URL is required
        width: 1200,
        height: 630,
        alt: 'Aura Spa - Servicios Terapéuticos',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Spa - Reserva Servicios Terapéuticos a Domicilio',
    description: 'Reserva servicios terapéuticos profesionales a domicilio. Masajes terapéuticos y relajantes con profesionales certificados.',
    images: [imageUrl],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aura Spa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Agrega códigos de verificación si los tienes
    // google: 'tu-codigo-google',
    // yandex: 'tu-codigo-yandex',
    // yahoo: 'tu-codigo-yahoo',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <div id="datepicker-portal"></div>
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <FloatingChat />
            <PWAInstallPrompt />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
