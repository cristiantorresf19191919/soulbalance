'use client'

import { useState, FormEvent } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ImageUpload } from './ImageUpload'
import { RichTextEditor } from './RichTextEditor'
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

  // Helper function to strip HTML tags for validation
  const stripHtml = (html: string): string => {
    if (typeof window === 'undefined') {
      // Fallback for SSR: simple regex to remove HTML tags
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    }
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
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
      if (!excerpt.trim() || !stripHtml(excerpt).trim()) {
        throw new Error('La descripción es requerida')
      }
      if (!category.trim()) {
        throw new Error('La categoría es requerida')
      }
      if (!heroImage.trim()) {
        throw new Error('La imagen principal es requerida. Por favor, sube una imagen o proporciona una URL.')
      }

      const slug = generateSlug(title)
      const date = new Date().getFullYear().toString()

      // Prepare blog data
      // Store HTML content as-is for rich text formatting
      const blogData = {
        slug,
        title: title.trim(),
        excerpt: excerpt.trim(), // HTML content
        category: category.trim(),
        date,
        heroImage: heroImage.trim(),
        heroImageAlt: heroImageAlt.trim() || title.trim(),
        sections: sections
          .filter(section => section.title.trim() || stripHtml(section.description).trim())
          .map(section => ({
            title: section.title.trim(),
            description: section.description.trim(), // HTML content
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

          <RichTextEditor
            value={excerpt}
            onChange={setExcerpt}
            label="Descripción / Resumen *"
            placeholder="Breve descripción del artículo que aparecerá en la lista de blogs..."
            required
          />

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
          
          <ImageUpload
            value={heroImage}
            onChange={setHeroImage}
            onAltChange={setHeroImageAlt}
            altValue={heroImageAlt}
            label="Imagen Principal"
            altLabel="Texto Alternativo de la Imagen"
            folder="blog-hero-images"
            required
          />
        </div>

        {/* Dynamic Sections */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Secciones del Blog</h3>

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

                <RichTextEditor
                  value={section.description}
                  onChange={(value) => updateSection(section.id, 'description', value)}
                  label="Descripción / Contenido"
                  placeholder="Contenido de la sección..."
                />

                <ImageUpload
                  value={section.image || ''}
                  onChange={(url) => updateSection(section.id, 'image', url)}
                  onAltChange={(alt) => updateSection(section.id, 'imageAlt', alt)}
                  altValue={section.imageAlt || ''}
                  label="Imagen de la Sección (Opcional)"
                  altLabel="Texto Alternativo de la Imagen"
                  folder="blog-section-images"
                />
              </div>
            ))}
            
            {/* Add Section Button */}
            <button
              type="button"
              className={styles.addSectionBtn}
              onClick={addSection}
              title="Agregar Sección"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Agregar Nueva Sección</span>
            </button>
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

