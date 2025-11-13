'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogArticle } from '@/lib/blogData'
import { stripHtml } from '@/lib/utils'
import styles from './BlogListing.module.css'

interface BlogListingProps {
  articles: BlogArticle[]
  loading?: boolean
}

export function BlogListing({ articles, loading = false }: BlogListingProps) {
  return (
    <section className={styles.blogListingSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Blog de Bienestar</h1>
          <p className={styles.intro}>
            Reflexiones, historias y guías para potenciar tu experiencia de
            bienestar
          </p>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinnerCircle}></div>
              <div className={styles.spinnerCircle}></div>
              <div className={styles.spinnerCircle}></div>
            </div>
            <p>Cargando artículos...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay artículos disponibles en este momento.</p>
          </div>
        ) : (
          <div className={styles.articlesGrid}>
            {articles.map((article) => (
              <article key={article.slug} className={styles.articleCard}>
                <Link href={`/blog/${article.slug}`} className={styles.cardLink}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={article.heroImage}
                      alt={article.heroImageAlt}
                      width={800}
                      height={600}
                      className={styles.cardImage}
                      priority={articles.indexOf(article) < 3}
                    />
                    <div className={styles.imageOverlay}></div>
                    <span className={styles.categoryBadge}>{article.category}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.meta}>
                      <span className={styles.date}>{article.date}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{article.title}</h2>
                    <p className={styles.cardExcerpt}>{stripHtml(article.excerpt)}</p>
                    <div className={styles.readMore}>
                      <span>Leer más</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.arrowIcon}
                      >
                        <path
                          d="M7.5 15L12.5 10L7.5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

