'use client'

import Image from 'next/image'
import Link from 'next/link'
import { VersionBadge } from './VersionBadge'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/superLogo.png"
                  alt="Aura Spa"
                  width={50}
                  height={50}
                  className={styles.logoImage}
                />
              </div>
              <span className={styles.logoText}>AURA SPA</span>
            </div>
            <p className={styles.tagline}>Reserva tus servicios terapéuticos</p>
          </div>
          <div className={styles.footerLinks}>
            <h4 className={styles.sectionTitle}>Enlaces</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/#inicio" className={styles.linkItem}>
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/servicios" className={styles.linkItem}>
                  <span>Servicios</span>
                </Link>
              </li>
              <li>
                <Link href="/#experiencias" className={styles.linkItem}>
                  <span>Experiencias</span>
                </Link>
              </li>
              <li>
                <Link href="/empresarial" className={styles.linkItem}>
                  <span>Empresarial</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.linkItem}>
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className={styles.linkItem}>
                  <span>Contacto</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.contactInfo}>
            <a
              href="mailto:balancecol2024@gmail.com"
              className={styles.contactLink}
              aria-label="Email"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              <span>balancecol2024@gmail.com</span>
            </a>
            <a
              href="tel:+573202632993"
              className={styles.contactLink}
              aria-label="Phone"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
              </svg>
              <span>320 2632993</span>
            </a>
          </div>
          <div className={styles.footerCopyright}>
            <span className={styles.copyrightText}>
              &copy; 2025 Aura Spa. Todos los derechos reservados.
            </span>
            <VersionBadge variant="footer" />
          </div>
          <div className={styles.developedBy}>
            <span className={styles.developedByText}>Desarrollado por</span>
            <a 
              href="https://agencypartner.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.optimusLink}
            >
              <span className={styles.optimusDev}>Optimus Dev</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
