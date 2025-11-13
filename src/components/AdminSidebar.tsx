'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './AdminSidebar.module.css'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  description: string
}

const navItems: NavItem[] = [
  {
    id: 'leads',
    label: 'Leads',
    icon: 'fa-solid fa-chart-line',
    path: '/admin',
    description: 'Gestiona y revisa todos los leads'
  },
  {
    id: 'blogs',
    label: 'Gestión de Blogs',
    icon: 'fa-solid fa-blog',
    path: '/admin/blogs',
    description: 'Crea, edita y gestiona los artículos del blog'
  },
  {
    id: 'shorts',
    label: 'Shorts',
    icon: 'fa-solid fa-video',
    path: '/admin/shorts',
    description: 'Gestiona videos e imágenes de shorts'
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <i className="fa-solid fa-shield-halved"></i>
          <span className={styles.sidebarTitle}>Admin Panel</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <li key={item.id} className={styles.navItem}>
                <Link
                  href={item.path}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                >
                  <div className={styles.navLinkContent}>
                    <div className={styles.navIconWrapper}>
                      <i className={`${item.icon} ${styles.navIcon}`}></i>
                      {active && <div className={styles.navIconGlow}></div>}
                    </div>
                    <div className={styles.navText}>
                      <span className={styles.navLabel}>{item.label}</span>
                      <span className={styles.navDescription}>{item.description}</span>
                    </div>
                    {active && (
                      <div className={styles.navIndicator}>
                        <div className={styles.navIndicatorInner}></div>
                      </div>
                    )}
                  </div>
                  {active && <div className={styles.navActiveBg}></div>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarFooterContent}>
          <div className={styles.sidebarFooterIcon}>
            <i className="fa-solid fa-sparkles"></i>
          </div>
          <p className={styles.sidebarFooterText}>
            Panel de Administración
          </p>
        </div>
      </div>
    </aside>
  )
}

