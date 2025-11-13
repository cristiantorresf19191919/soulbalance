'use client'

import { useState, FormEvent } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import styles from './BlogForm.module.css'

export interface BlogSection {
  id: string
  title: string
  description: string
  image?: string
  imageAlt?: string
}

interface BlogFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlogForm({ onSuccess, onCancel }: BlogFormProps) {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('')
  const [sections, setSections] = useState<BlogSection[]>([
    { id: Date.now().toString(), title: '', description: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now().toString(), title: '', description: '' }
    ])
  }

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id))
    }
  }

  const updateSection = (id: string, field: keyof BlogSection, value: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ))
  }

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
      if (!excerpt.trim()) {
        throw new Error('La descripción es requerida')
      }
      if (!category.trim()) {
        throw new Error('La categoría es requerida')
      }
      if (!heroImage.trim()) {
        throw new Error('La imagen principal es requerida')
      }

      const slug = generateSlug(title)
      const date = new Date().getFullYear().toString()

      // Prepare blog data
      const blogData = {
        slug,
        title: title.trim(),
        excerpt: excerpt.trim(),
        category: category.trim(),
        date,
        heroImage: heroImage.trim(),
        heroImageAlt: heroImageAlt.trim() || title.trim(),
        sections: sections
          .filter(section => section.title.trim() || section.description.trim())
          .map(section => ({
            title: section.title.trim(),
            description: section.description.trim(),
            image: section.image?.trim() || null,
            imageAlt: section.imageAlt?.trim() || section.title.trim() || ''
          })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Save to Firestore
      const blogsCollection = collection(firestore, 'blogs')
      await addDoc(blogsCollection, blogData)

      // Reset form
      setTitle('')
      setExcerpt('')
      setCategory('')
      setHeroImage('')
      setHeroImageAlt('')
      setSections([{ id: Date.now().toString(), title: '', description: '' }])

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Error creating blog:', err)
      setError(err.message || 'Error al crear el blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.blogForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Crear Nuevo Blog</h2>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            <i className="fa-solid fa-times"></i>
          </button>
        )}
      </div>

      <div className={styles.formBody}>
        {/* Basic Information */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Información Básica</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Por qué el masaje funciona mejor..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="excerpt">Descripción / Resumen *</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descripción del artículo que aparecerá en la lista de blogs..."
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Categoría / Etiqueta *</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Ciencia del tacto"
              required
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Imagen Principal</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="heroImage">URL de la Imagen *</label>
            <input
              type="url"
              id="heroImage"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="heroImageAlt">Texto Alternativo de la Imagen</label>
            <input
              type="text"
              id="heroImageAlt"
              value={heroImageAlt}
              onChange={(e) => setHeroImageAlt(e.target.value)}
              placeholder="Descripción de la imagen para accesibilidad"
            />
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Secciones del Blog</h3>
            <button
              type="button"
              className={styles.addSectionBtn}
              onClick={addSection}
            >
              <i className="fa-solid fa-plus"></i> Agregar Sección
            </button>
          </div>

          <div className={styles.sectionsContainer}>
            {sections.map((section, index) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.sectionCardHeader}>
                  <h4 className={styles.sectionCardTitle}>
                    Sección {index + 1}
                  </h4>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeSectionBtn}
                      onClick={() => removeSection(section.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Título de la Sección</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    placeholder="Ej: La mente como interruptor del alivio"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción / Contenido</label>
                  <textarea
                    value={section.description}
                    onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                    placeholder="Contenido de la sección..."
                    rows={6}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>URL de la Imagen (Opcional)</label>
                  <input
                    type="url"
                    value={section.image || ''}
                    onChange={(e) => updateSection(section.id, 'image', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                {section.image && (
                  <div className={styles.formGroup}>
                    <label>Texto Alternativo de la Imagen</label>
                    <input
                      type="text"
                      value={section.imageAlt || ''}
                      onChange={(e) => updateSection(section.id, 'imageAlt', e.target.value)}
                      placeholder="Descripción de la imagen"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className={styles.formError}>
            {error}
          </div>
        )}

        <div className={styles.formActions}>
          {onCancel && (
            <button type="button" className={styles.cancelActionBtn} onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Creando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i> Crear Blog
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

