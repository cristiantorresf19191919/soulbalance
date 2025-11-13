'use client'

import { useState, FormEvent } from 'react'
import { firestore, storage } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { MediaUpload } from './MediaUpload'
import styles from './ShortForm.module.css'

interface ShortFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ShortForm({ onSuccess, onCancel }: ShortFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!firestore) {
      setError('Firestore no está disponible')
      setLoading(false)
      return
    }

    try {
      // Validate
      if (!title.trim()) {
        throw new Error('El título es requerido')
      }
      if (!mediaUrl.trim()) {
        throw new Error('La imagen o video es requerido')
      }

      // Prepare short data
      const shortData = {
        title: title.trim(),
        description: description.trim(),
        mediaUrl: mediaUrl.trim(),
        mediaType: mediaType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Save to Firestore
      const shortsCollection = collection(firestore, 'shorts')
      await addDoc(shortsCollection, shortData)

      // Reset form
      setTitle('')
      setDescription('')
      setMediaUrl('')
      setMediaType('image')

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Error saving short:', err)
      setError(err.message || 'Error al guardar el short. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.shortForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Crear Short</h2>
        <p className={styles.formSubtitle}>
          Agrega un nuevo video o imagen a la sección de shorts
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      <div className={styles.formFields}>
        <div className={styles.formField}>
          <label htmlFor="title" className={styles.label}>
            Título *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            placeholder="Título del short"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="description" className={styles.label}>
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            placeholder="Descripción opcional del short"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className={styles.formField}>
          <MediaUpload
            value={mediaUrl}
            onChange={setMediaUrl}
            onTypeChange={setMediaType}
            type={mediaType}
            label="Imagen o Video *"
            folder="shorts"
            required
          />
        </div>
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Guardando...
            </>
          ) : (
            <>
              <i className="fa-solid fa-check"></i>
              Guardar Short
            </>
          )}
        </button>
      </div>
    </form>
  )
}

