'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { VersionBadge } from './VersionBadge'
import styles from './Navbar.module.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })

    return () => unsubscribe()
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle anchor links for same page navigation
    if (href.startsWith('#')) {
      e.preventDefault()
      setMenuOpen(false)
      const element = document.querySelector(href)
      if (element) {
        const navHeight = 80
        const targetPosition = (element as HTMLElement).offsetTop - navHeight
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    } else {
      setMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (!auth) {
        router.push('/login')
        return
      }
      await signOut(auth)
      router.push('/')
      setMenuOpen(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.')
    }
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="navbar">
      <VersionBadge variant="header" />
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Image src="/superLogo.png" alt="Soul Balance" width={70} height={70} className={styles.logoImage} />
            <span className={styles.logoText}>SOUL BALANCE</span>
          </Link>
        </div>
        {isAuthenticated ? (
          <div className={styles.authButtons}>
            <Link href="/admin" className={styles.adminNavBtn}>
              Admin
            </Link>
            <button onClick={handleLogout} className={styles.logoutNavBtn}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.loginNavBtn}>Login</Link>
        )}
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
          <li>
            <Link href="/" onClick={(e) => handleLinkClick(e, '/')}>Inicio</Link>
          </li>
          <li>
            <Link href="/servicios" onClick={(e) => handleLinkClick(e, '/servicios')}>Servicios</Link>
          </li>
          <li>
            <Link href="/#experiencias" onClick={(e) => handleLinkClick(e, '#experiencias')}>Experiencias</Link>
          </li>
          <li>
            <Link href="/empresarial" onClick={(e) => handleLinkClick(e, '/empresarial')}>Empresarial</Link>
          </li>
          <li>
            <Link href="/blog" onClick={(e) => handleLinkClick(e, '/blog')}>Blog</Link>
          </li>
          <li>
            <Link href="/contacto" onClick={(e) => handleLinkClick(e, '/contacto')}>Contacto</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
