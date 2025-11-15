'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { firestore } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import styles from './page.module.css'

interface Short {
  id: string
  title: string
  description: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  createdAt?: any
}

export default function ShortsPage() {
  const [shorts, setShorts] = useState<Short[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firestore) {
      setLoading(false)
      return
    }

    const shortsCollection = collection(firestore, 'shorts')
    const q = query(shortsCollection, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const shortsData: Short[] = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            title: data.title || '',
            description: data.description || '',
            mediaUrl: data.mediaUrl || '',
            mediaType: data.mediaType || 'image',
            createdAt: data.createdAt
          }
        })
        setShorts(shortsData)
        setLoading(false)
      },
      (error) => {
        console.error('Error loading shorts:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return (
    <>
      <main style={{ flex: 1 }}>
        <Navbar />
        <div className={styles.shortsPage}>
          <div className={styles.shortsContainer}>
            <div className={styles.shortsHeader}>
              <h1 className={styles.shortsTitle}>Shorts</h1>
              <p className={styles.shortsSubtitle}>
                Descubre nuestros videos e imágenes más recientes
              </p>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}>
                  <div className={styles.spinnerCircle}></div>
                  <div className={styles.spinnerCircle}></div>
                  <div className={styles.spinnerCircle}></div>
                </div>
                <p>Cargando shorts...</p>
              </div>
            ) : shorts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <i className="fa-solid fa-video"></i>
                </div>
                <h3>No hay shorts disponibles</h3>
                <p>Pronto agregaremos contenido nuevo</p>
              </div>
            ) : (
              <div className={styles.shortsGrid}>
                {shorts.map((short) => (
                  <div key={short.id} className={styles.shortItem}>
                    <div className={styles.shortMediaContainer}>
                      {short.mediaType === 'video' ? (
                        <video
                          src={short.mediaUrl}
                          className={styles.shortMedia}
                          controls
                          playsInline
                        />
                      ) : (
                        <img
                          src={short.mediaUrl}
                          alt={short.title}
                          className={styles.shortMedia}
                        />
                      )}
                      <div className={styles.mediaTypeBadge}>
                        <i className={`fa-solid fa-${short.mediaType === 'video' ? 'video' : 'image'}`}></i>
                      </div>
                    </div>
                    <div className={styles.shortContent}>
                      <h3 className={styles.shortTitle}>{short.title}</h3>
                      {short.description && (
                        <p className={styles.shortDescription}>{short.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

