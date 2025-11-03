'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroSection.module.css'

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      if (link) {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (href && href !== '#') {
          const element = document.querySelector(href)
          if (element) {
            const navHeight = 80
            const targetPosition = (element as HTMLElement).offsetTop - navHeight
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
          }
        }
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <section id="inicio" className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.heroBackground}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/rostro.mp4" type="video/mp4" />
      </video>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <div className={styles.logoLarge}>
          <Image
            src="/superLogo.png"
            alt="Soul Balance"
            width={280}
            height={280}
            className={styles.logoHeroImage}
            priority
          />
          <h1 className={styles.brandName}>SOUL BALANCE</h1>
        </div>
        <p className={styles.taglineMain}>EXPERIENCIAS DE BIENESTAR</p>
        <p className={styles.taglineSub}>
          Equilibrio entre cuerpo, mente y alma
        </p>
        <Link href="#contacto" className={styles.ctaButton}>
          Reserva tu experiencia
        </Link>
      </div>
      <div className={styles.scrollIndicator}>
        <span></span>
      </div>
    </section>
  )
}

