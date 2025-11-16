'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { ShortForm } from './ShortForm'
import styles from './ShortsManagement.module.css'

interface Short {
  id: string
  title: string
  description: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  createdAt?: any
  updatedAt?: any
}

export function ShortsManagement() {
  const [showForm, setShowForm] = useState(false)
  const [shorts, setShorts] = useState<Short[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!firestore) return

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
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
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

  const handleDelete = async (shortId: string, shortTitle: string) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar el short &quot;${shortTitle}&quot;?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      return
    }

    try {
      if (!firestore) throw new Error('Firestore no está disponible')
      setDeletingId(shortId)
      const shortDocRef = doc(collection(firestore, 'shorts'), shortId)
      await deleteDoc(shortDocRef)
    } catch (error: any) {
      console.error('Error deleting short:', error)
      alert(error.message || 'Error al eliminar el short. Por favor, intenta nuevamente.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
  }

  return (
    <div className={styles.shortsManagement}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Gestión de Shorts</h1>
          <p className={styles.subtitle}>
            Crea, edita y gestiona los videos e imágenes de shorts
          </p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fa-solid fa-plus"></i>
          {showForm ? 'Cancelar' : 'Crear Short'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <ShortForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className={styles.shortsList}>
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
            <h3>No hay shorts aún</h3>
            <p>
              Crea tu primer short haciendo clic en el botón &quot;Crear Short&quot;
            </p>
          </div>
        ) : (
          <div className={styles.shortsGrid}>
            {shorts.map((short) => (
              <div key={short.id} className={styles.shortCard}>
                <div className={styles.shortCardHeader}>
                  <div className={styles.shortCardMedia}>
                    {short.mediaType === 'video' ? (
                      <video
                        src={short.mediaUrl}
                        className={styles.shortMedia}
                        controls
                        muted
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
                      {short.mediaType === 'video' ? 'Video' : 'Imagen'}
                    </div>
                  </div>
                </div>
                <div className={styles.shortCardBody}>
                  <h3 className={styles.shortCardTitle}>{short.title}</h3>
                  {short.description && (
                    <p className={styles.shortCardDescription}>{short.description}</p>
                  )}
                </div>
                <div className={styles.shortCardActions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(short.id, short.title)}
                    disabled={deletingId === short.id}
                  >
                    {deletingId === short.id ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-trash"></i>
                    )}
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

