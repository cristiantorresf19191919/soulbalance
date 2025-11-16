'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, type Variants } from 'framer-motion'
import { VersionBadge } from './VersionBadge'
import styles from './Footer.module.css'

const footerContainerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
}

const footerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const footerLinksListVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
    },
  },
}

const footerLinkItemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function Footer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-80px 0px -40px 0px',
  })

  return (
    <footer className={styles.footer}>
      <motion.div
        ref={containerRef}
        className={styles.container}
        variants={footerContainerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className={styles.footerContent}>
          <motion.div className={styles.footerBrand} variants={footerItemVariants}>
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
          </motion.div>
          <motion.div className={styles.footerLinks} variants={footerItemVariants}>
            <motion.ul
              className={styles.linksList}
              variants={footerLinksListVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/#inicio" className={styles.linkItem}>
                  <span>Inicio</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/servicios" className={styles.linkItem}>
                  <span>Servicios</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/#experiencias" className={styles.linkItem}>
                  <span>Experiencias</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/empresarial" className={styles.linkItem}>
                  <span>Empresarial</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/blog" className={styles.linkItem}>
                  <span>Blog</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/shorts" className={styles.linkItem}>
                  <span>Shorts</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/juega" className={styles.linkItem}>
                  <span>Juega</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/admin" className={styles.linkItem}>
                  <span>Admin</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/login" className={styles.linkItem}>
                  <span>Login</span>
                </Link>
              </motion.li>
              <motion.li variants={footerLinkItemVariants}>
                <Link href="/#contacto" className={styles.linkItem}>
                  <span>Contacto</span>
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>
        <motion.div className={styles.footerBottom} variants={footerItemVariants}>
          <div className={styles.footerCopyright}>
            <span className={styles.copyrightText}>
              &copy; 2025 Aura Spa. Todos los derechos reservados.
            </span>
            <VersionBadge variant="footer" />
          </div>
          <div className={styles.developedBy}>
            <span className={styles.developedByText}>Desarrollado por</span>
            <span className={styles.optimusDev}>CristianSript Optimus Agency</span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
