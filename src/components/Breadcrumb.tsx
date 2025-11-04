'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Breadcrumb.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  sticky?: boolean
}

export function Breadcrumb({ items, sticky = false }: BreadcrumbProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const lastItem = items[items.length - 1]
  const previousItems = items.slice(0, -1)

  return (
    <nav className={`${styles.breadcrumb} ${sticky ? styles.sticky : ''}`} aria-label="Breadcrumb">
      {/* Desktop breadcrumb */}
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className={styles.breadcrumbItem}>
              {isLast ? (
                <span className={styles.breadcrumbCurrent} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href || '#'} className={styles.breadcrumbLink}>
                    {item.label}
                  </Link>
                  <span className={styles.breadcrumbSeparator} aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile breadcrumb with collapse/expand */}
      <div className={styles.breadcrumbMobile}>
        <button
          className={`${styles.breadcrumbMobileToggle} ${mobileExpanded ? styles.expanded : ''}`}
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-expanded={mobileExpanded}
          aria-label="Toggle breadcrumb navigation"
        >
          <span>
            {previousItems.length > 0 ? (
              <>
                <Link href={previousItems[previousItems.length - 1].href || '#'} className={styles.breadcrumbLink}>
                  {previousItems[previousItems.length - 1].label}
                </Link>
                {' / '}
              </>
            ) : null}
            <span className={styles.breadcrumbCurrent}>{lastItem.label}</span>
          </span>
          <i className={`fa-solid fa-chevron-${mobileExpanded ? 'up' : 'down'}`}></i>
        </button>
        <div className={`${styles.breadcrumbMobileContent} ${mobileExpanded ? styles.expanded : ''}`}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <div key={index} className={styles.breadcrumbMobileItem}>
                {isLast ? (
                  <span className={styles.breadcrumbCurrent} aria-current="page">
                    <i className="fa-solid fa-location-dot"></i>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href || '#'} className={styles.breadcrumbLink} onClick={() => setMobileExpanded(false)}>
                    <i className="fa-solid fa-arrow-left"></i>
                    {item.label}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

