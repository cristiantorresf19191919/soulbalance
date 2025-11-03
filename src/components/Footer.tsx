'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <Image
                src="/superLogo.png"
                alt="Soul Balance"
                width={40}
                height={40}
                className={styles.logoImage}
              />
              <span className={styles.logoText}>SOUL BALANCE</span>
            </div>
            <p>Equilibrio entre cuerpo, mente y alma</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Enlaces</h4>
            <ul>
              <li><Link href="/#inicio">Inicio</Link></li>
              <li><Link href="/servicios">Servicios</Link></li>
              <li><Link href="/#experiencias">Experiencias</Link></li>
              <li><Link href="/empresarial">Empresarial</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/#contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className={styles.footerSocial}>
            <h4>Síguenos</h4>
            <div className={styles.socialLinks}>
              <a
                href="https://www.instagram.com/soulbalancespa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @soulbalancespa"
                className={styles.socialInstagram}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className={styles.socialHandle}>@soulbalancespa</span>
              </a>
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            &copy; 2024 Soul Balance. Todos los derechos reservados. |
            Experiencias de Bienestar
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            <a
              href="mailto:balancecol2024@gmail.com"
              style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
            >
              balancecol2024@gmail.com
            </a>
            {' | '}
            <a
              href="tel:+573202632993"
              style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
            >
              320 2632993
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
