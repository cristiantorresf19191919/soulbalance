'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ServicesDetailSection } from '@/components/ServicesDetailSection'

export default function ServiciosPage() {
  return (
    <>
      <main style={{ flex: 1 }}>
        <Navbar />
        <ServicesDetailSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

