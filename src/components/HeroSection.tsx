'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroSection.module.css'
import { MassageStepper } from './MassageStepper'

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stepperOpen, setStepperOpen] = useState(false)

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Don't handle clicks inside accordions (they should expand/collapse, not scroll)
      const accordion = target.closest('[role="region"], .MuiAccordion-root, [class*="categoryAccordion"], [class*="categorySummary"]')
      if (accordion) {
        return
      }
      
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
            alt="Aura Spa"
            width={280}
            height={280}
            className={styles.logoHeroImage}
            priority
          />
          <h1 className={styles.brandName}>AURA SPA</h1>
        </div>
        <p className={styles.taglineMain}>RESERVA TUS SERVICIOS TERAPÉUTICOS</p>
        <p className={styles.taglineSub}>
          Servicios profesionales a domicilio
        </p>
        <div className={styles.ctaButtons}>
          <Link href="#contacto" className={styles.ctaButton}>
            Reserva tu servicio
          </Link>
          <button 
            className={styles.ctaButtonSecondary}
            onClick={() => setStepperOpen(true)}
          >
            No sé qué masaje escoger
          </button>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <span></span>
      </div>
      <MassageStepper
        open={stepperOpen}
        onClose={() => setStepperOpen(false)}
      />
    </section>
  )
}

