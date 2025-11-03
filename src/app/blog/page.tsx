'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { BlogArticle } from '@/components/BlogArticle'

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogArticle />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

