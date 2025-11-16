'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { BlogListing } from '@/components/BlogListing'
import { getAllBlogArticles, BlogArticle } from '@/lib/blogData'

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticles() {
      try {
        const loadedArticles = await getAllBlogArticles()
        setArticles(loadedArticles)
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  return (
    <>
      <Navbar />
      <BlogListing articles={articles} loading={loading} />
    </>
  )
}
