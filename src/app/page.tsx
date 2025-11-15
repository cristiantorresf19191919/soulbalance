'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ServicesGrid } from '@/components/ServicesGrid'
import { PremiumExperiences } from '@/components/PremiumExperiences'
import { CorporateSection } from '@/components/CorporateSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { ToastContainer } from '@/components/ToastNotifications'
import { useScrollEffects } from '@/hooks/useScrollEffects'

export default function Home() {
  useScrollEffects()

  return (
    <>
      <main style={{ flex: 1 }}>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ServicesGrid />
        <PremiumExperiences />
        <CorporateSection />
        <ContactSection />
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}
