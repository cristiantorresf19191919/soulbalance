'use client'

import { useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { BlogArticle } from '@/components/BlogArticle'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SuggestedArticles } from '@/components/SuggestedArticles'
import { getBlogArticle, getSuggestedArticles } from '@/lib/blogData'

export default function BlogArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const article = getBlogArticle(slug)

  if (!article) {
    return (
      <>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '50vh' }}>
            <h1>Artículo no encontrado</h1>
            <p>El artículo que buscas no existe.</p>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </>
    )
  }

  const suggestedArticles = getSuggestedArticles(slug, 3)

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: article.title },
  ]

  return (
    <>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Breadcrumb sticky={true} items={breadcrumbItems} />
        <BlogArticle article={article} />
        {suggestedArticles.length > 0 && (
          <SuggestedArticles articles={suggestedArticles} currentSlug={slug} />
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

