'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ServicesHero } from '@/components/ServicesHero'
import { ServicesDetailSection } from '@/components/ServicesDetailSection'

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <ServicesHero />
      <ServicesDetailSection />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

