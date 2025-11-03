'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { CorporateHero } from '@/components/CorporateHero'
import { CorporateDetailSection } from '@/components/CorporateDetailSection'

export default function EmpresarialPage() {
  return (
    <>
      <Navbar />
      <CorporateHero />
      <CorporateDetailSection />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

