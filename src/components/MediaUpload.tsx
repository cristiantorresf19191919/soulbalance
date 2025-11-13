'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import styles from './MediaUpload.module.css'

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  onTypeChange?: (type: 'image' | 'video') => void
  type?: 'image' | 'video'
  label: string
  folder?: string
  required?: boolean
}

export function MediaUpload({
  value,
  onChange,
  onTypeChange,
  type = 'image',
  label,
  folder = 'shorts',
  required = false
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(value || null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>(type)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Determine file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      setError('Por favor, selecciona un archivo de imagen o video válido')
      return
    }

    const detectedType = isImage ? 'image' : 'video'
    setMediaType(detectedType)
    if (onTypeChange) {
      onTypeChange(detectedType)
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = detectedType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Por favor, selecciona un archivo menor a ${detectedType === 'video' ? '50MB' : '10MB'}`)
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
          setError('Error al subir el archivo. Por favor, intenta de nuevo.')
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
            setError('Error al obtener la URL del archivo.')
            setUploading(false)
          }
        }
      )
    } catch (err: any) {
      console.error('Error uploading file:', err)
      setError(err.message || 'Error al subir el archivo')
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
      // Try to detect type from URL
      if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
        setMediaType('video')
        if (onTypeChange) onTypeChange('video')
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        setMediaType('image')
        if (onTypeChange) onTypeChange('image')
      }
    } else {
      setPreview(null)
    }
  }

  return (
    <div className={styles.mediaUpload}>
      <label className={styles.label}>{label}{required && ' *'}</label>
      
      {/* Preview */}
      {preview && (
        <div className={styles.previewContainer}>
          <div className={styles.previewWrapper}>
            {mediaType === 'video' ? (
              <video src={preview} controls className={styles.previewVideo} />
            ) : (
              <img src={preview} alt="Preview" className={styles.previewImage} />
            )}
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
            accept="image/*,video/*"
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
                <span>Subir {mediaType === 'video' ? 'Video' : 'Imagen'}</span>
              </>
            )}
          </label>
        </div>

        {/* Or Divider */}
        <div className={styles.divider}>
          <span>o</span>
        </div>

        {/* URL Input */}
        <div className={styles.urlInput}>
          <input
            type="url"
            value={value}
            onChange={handleUrlInput}
            placeholder="https://example.com/video.mp4 o https://example.com/image.jpg"
            className={styles.urlInputField}
            disabled={uploading}
          />
          <span className={styles.urlHint}>Pegar URL de imagen o video</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}
    </div>
  )
}

