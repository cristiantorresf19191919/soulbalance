'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="navbar">
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Image src="/superLogo.png" alt="Soul Balance" width={70} height={70} className={styles.logoImage} />
            <span className={styles.logoText}>SOUL BALANCE</span>
          </Link>
        </div>
        <Link href="/login" className={styles.loginNavBtn}>Login</Link>
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
          <li>
            <Link href="/#inicio" onClick={(e) => handleLinkClick(e, '#inicio')}>Inicio</Link>
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
            <Link href="/#contacto" onClick={(e) => handleLinkClick(e, '#contacto')}>Contacto</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
