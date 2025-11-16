'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { MemoryGame } from '@/components/MemoryGame'
import { useJuegaSettings } from '@/hooks/useJuegaSettings'
import styles from './juega.module.css'

export default function JuegaPage() {
  const router = useRouter()
  const { enabled, loading } = useJuegaSettings()

  useEffect(() => {
    if (!loading && !enabled) {
      router.push('/')
    }
  }, [enabled, loading, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.mainWrapper}>
          <div className={styles.container}>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!enabled) {
    return null // Se redirigirá automáticamente
  }

  return (
    <>
      <Navbar />
      <main className={styles.mainWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <span className={styles.titleIcon}>
                <i className="fa-solid fa-gamepad"></i>
              </span>
              <h1 className={styles.titleText}>Juega y Gana</h1>
            </div>
            <p className={styles.subtitle}>
              Encuentra todas las parejas de masajes y obtén un código de descuento especial
            </p>
          </div>
          <MemoryGame />
        </div>
      </main>
    </>
  )
}

