'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Separator } from './Separator'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onAltChange?: (alt: string) => void
  altValue?: string
  label: string
  altLabel?: string
  folder?: string
  required?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onAltChange,
  altValue = '',
  label,
  altLabel = 'Texto Alternativo de la Imagen',
  folder = 'blog-images',
  required = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Por favor, selecciona una imagen menor a 10MB')
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    try {
      if (!storage) {
        setError('Firebase Storage no está configurado. Por favor, usa la opción de URL o configura Storage en Firebase.')
        setUploading(false)
        return
      }

      // Create a unique filename
      const timestamp = Date.now()
      const filename = `${folder}/${timestamp}-${file.name}`
      const storageRef = ref(storage, filename)

      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Monitor upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(progress)
        },
        (error) => {
          console.error('Upload error:', error)
          setError('Error al subir la imagen. Por favor, intenta de nuevo.')
          setUploading(false)
        },
        async () => {
          // Upload completed
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            onChange(downloadURL)
            setPreview(downloadURL)
            setUploading(false)
            setProgress(0)
          } catch (error) {
            console.error('Error getting download URL:', error)
            setError('Error al obtener la URL de la imagen.')
            setUploading(false)
          }
        }
      )
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err.message || 'Error al subir la imagen')
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlInput = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    if (url) {
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  return (
    <div className={styles.imageUpload}>
      <label className={styles.label}>{label}{required && ' *'}</label>
      
      {/* Preview */}
      {preview && (
        <div className={styles.previewContainer}>
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemove}
              disabled={uploading}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className={styles.uploadSection}>
        {/* File Upload */}
        <div className={styles.fileUploadArea}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
            id={`file-input-${label}`}
            disabled={uploading}
          />
          <label
            htmlFor={`file-input-${label}`}
            className={`${styles.fileUploadLabel} ${uploading ? styles.uploading : ''}`}
          >
            {uploading ? (
              <>
                <div className={styles.uploadProgress}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                  ></div>
                  <span className={styles.progressText}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>Subir Imagen</span>
              </>
            )}
          </label>
        </div>

        {/* Or Divider */}
        <Separator label="o" variant="light" compact mutedLabel />

        {/* URL Input */}
        <div className={styles.urlInput}>
          <input
            type="url"
            value={value}
            onChange={handleUrlInput}
            placeholder="https://images.unsplash.com/photo-..."
            className={styles.urlInputField}
            disabled={uploading}
          />
          <span className={styles.urlHint}>Pegar URL de imagen</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {/* Alt Text Input */}
      {onAltChange && (
        <div className={styles.altInput}>
          <label className={styles.altLabel}>{altLabel}</label>
          <input
            type="text"
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Descripción de la imagen para accesibilidad"
            className={styles.altInputField}
          />
        </div>
      )}
    </div>
  )
}

