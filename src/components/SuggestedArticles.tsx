'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogArticle } from '@/lib/blogData'
import styles from './SuggestedArticles.module.css'

interface SuggestedArticlesProps {
  articles: BlogArticle[]
  currentSlug: string
}

export function SuggestedArticles({ articles, currentSlug }: SuggestedArticlesProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section className={styles.suggestedSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Artículos relacionados</h2>
        <p className={styles.sectionSubtitle}>
          Sigue explorando nuestro blog de bienestar
        </p>
        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <article key={article.slug} className={styles.articleCard}>
              <Link href={`/blog/${article.slug}`} className={styles.cardLink}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={article.heroImage}
                    alt={article.heroImageAlt}
                    width={600}
                    height={400}
                    className={styles.cardImage}
                  />
                  <div className={styles.cardOverlay}></div>
                  <span className={styles.cardCategory}>{article.category}</span>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{article.date}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

