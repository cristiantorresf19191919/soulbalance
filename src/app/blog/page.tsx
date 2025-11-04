'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { BlogListing } from '@/components/BlogListing'
import { getAllBlogArticles } from '@/lib/blogData'

export default function BlogPage() {
  const articles = getAllBlogArticles()

  return (
    <>
      <main style={{ flex: 1 }}>
        <Navbar />
        <BlogListing articles={articles} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
