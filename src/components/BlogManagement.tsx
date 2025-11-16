'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { BlogForm } from './BlogForm'
import { stripHtml } from '@/lib/utils'
import styles from './BlogManagement.module.css'

interface BlogSection {
  title: string
  description: string
  image?: string | null
  imageAlt?: string
}

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  heroImage: string
  heroImageAlt: string
  sections?: BlogSection[]
  createdAt?: any
  updatedAt?: any
}

export function BlogManagement() {
  const [showForm, setShowForm] = useState(false)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!firestore) return

    const blogsCollection = collection(firestore, 'blogs')
    const q = query(blogsCollection, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const blogsData: Blog[] = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            slug: data.slug || '',
            title: data.title || '',
            excerpt: data.excerpt || '',
            category: data.category || '',
            date: data.date || '',
            heroImage: data.heroImage || '',
            heroImageAlt: data.heroImageAlt || '',
            sections: data.sections || [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          }
        })
        setBlogs(blogsData)
        setLoading(false)
      },
      (error) => {
        console.error('Error loading blogs:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleDelete = async (blogId: string, blogTitle: string) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar el blog &quot;${blogTitle}&quot;?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      return
    }

    try {
      if (!firestore) throw new Error('Firestore no está disponible')
      setDeletingId(blogId)
      const blogDocRef = doc(collection(firestore, 'blogs'), blogId)
      await deleteDoc(blogDocRef)
    } catch (error: any) {
      console.error('Error deleting blog:', error)
      alert(error.message || 'Error al eliminar el blog. Por favor, intenta nuevamente.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
  }

  return (
    <div className={styles.blogManagement}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Gestión de Blogs</h1>
          <p className={styles.subtitle}>
            Crea, edita y gestiona los artículos del blog
          </p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fa-solid fa-plus"></i>
          {showForm ? 'Cancelar' : 'Crear Blog'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <BlogForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className={styles.blogsList}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}>
              <div className={styles.spinnerCircle}></div>
              <div className={styles.spinnerCircle}></div>
              <div className={styles.spinnerCircle}></div>
            </div>
            <p>Cargando blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fa-regular fa-file-lines"></i>
            </div>
            <h3>No hay blogs aún</h3>
            <p>Crea tu primer blog haciendo clic en el botón "Crear Blog"</p>
          </div>
        ) : (
          <div className={styles.blogsGrid}>
            {blogs.map((blog) => (
              <div key={blog.id} className={styles.blogCard}>
                <div className={styles.blogCardHeader}>
                  <div className={styles.blogCardImage}>
                    {blog.heroImage && (
                      <img
                        src={blog.heroImage}
                        alt={blog.heroImageAlt}
                        className={styles.blogImage}
                      />
                    )}
                    {!blog.heroImage && (
                      <div className={styles.noImage}>
                        <i className="fa-solid fa-image"></i>
                      </div>
                    )}
                  </div>
                  <div className={styles.blogCardBadge}>
                    {blog.category}
                  </div>
                </div>
                <div className={styles.blogCardBody}>
                  <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                  <p className={styles.blogCardExcerpt}>{stripHtml(blog.excerpt)}</p>
                  <div className={styles.blogCardMeta}>
                    <span className={styles.blogDate}>
                      <i className="fa-solid fa-calendar"></i>
                      {blog.date}
                    </span>
                    <span className={styles.blogSections}>
                      <i className="fa-solid fa-list"></i>
                      {blog.sections?.length || 0} secciones
                    </span>
                  </div>
                </div>
                <div className={styles.blogCardActions}>
                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewBtn}
                  >
                    <i className="fa-solid fa-eye"></i> Ver
                  </a>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(blog.id, blog.title)}
                    disabled={deletingId === blog.id}
                  >
                    {deletingId === blog.id ? (
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

