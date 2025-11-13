'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { BlogArticle } from '@/components/BlogArticle'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SuggestedArticles } from '@/components/SuggestedArticles'
import { getBlogArticle, getSuggestedArticles, BlogArticle as BlogArticleType } from '@/lib/blogData'

export default function BlogArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<BlogArticleType | null>(null)
  const [suggestedArticles, setSuggestedArticles] = useState<BlogArticleType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticle() {
      try {
        const loadedArticle = await getBlogArticle(slug)
        if (loadedArticle) {
          setArticle(loadedArticle)
          const suggested = await getSuggestedArticles(slug, 3)
          setSuggestedArticles(suggested)
        }
      } catch (error) {
        console.error('Error loading article:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
  }, [slug])

  if (loading) {
    return (
      <>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '50vh' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#075257', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite' }}></div>
              <div style={{ width: '16px', height: '16px', background: '#075257', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '-0.16s' }}></div>
              <div style={{ width: '16px', height: '16px', background: '#075257', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '-0.32s' }}></div>
            </div>
            <p>Cargando artículo...</p>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </>
    )
  }

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

