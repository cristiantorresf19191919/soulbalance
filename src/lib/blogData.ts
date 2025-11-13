import { firestore } from './firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

export interface BlogSection {
  title: string
  description: string
  image?: string | null
  imageAlt?: string
}

export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  heroImage: string
  heroImageAlt: string
  sections?: BlogSection[]
  contentImages?: Array<{
    src: string
    alt: string
    width: number
    height: number
    fullWidth?: boolean
  }>
  seoTitle?: string
  seoDescription?: string
}

// Legacy blog article for backwards compatibility
const legacyBlog: BlogArticle = {
  slug: 'por-que-el-masaje-funciona-mejor-cuando-te-entregas',
  title: 'Por qué el masaje funciona mejor cuando te entregas',
  excerpt: 'Te has preguntado por qué algunas sesiones te dejan transformado y otras solo "alivian un poco". La diferencia no está solo en las manos del terapeuta, sino también en cómo te entregas al proceso.',
  category: 'Ciencia del tacto',
  date: '2024',
  heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  heroImageAlt: 'Experiencia de masaje relajante y transformadora',
  seoTitle: 'Por qué el masaje funciona mejor cuando te entregas | Soul Balance Spa',
  seoDescription: 'Descubre cómo la entrega y la confianza durante un masaje pueden transformar tu experiencia terapéutica. Aprende técnicas para maximizar los beneficios.',
  contentImages: [
    {
      src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Técnicas de respiración y relajación',
      width: 2070,
      height: 1380,
    },
    {
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Sesión de masaje terapéutico profesional',
      width: 2070,
      height: 1380,
    },
    {
      src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Ambiente relajante y bienestar',
      width: 2070,
      height: 1380,
      fullWidth: true,
    },
  ],
}

async function fetchBlogsFromFirebase(): Promise<BlogArticle[]> {
  if (typeof window === 'undefined' || !firestore) {
    return []
  }

  try {
    const blogsCollection = collection(firestore, 'blogs')
    const q = query(blogsCollection, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const blogs: BlogArticle[] = querySnapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data()
      return {
        slug: data.slug || '',
        title: data.title || '',
        excerpt: data.excerpt || '',
        category: data.category || '',
        date: data.date || '',
        heroImage: data.heroImage || '',
        heroImageAlt: data.heroImageAlt || data.title || '',
        sections: data.sections || [],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      }
    })

    return blogs
  } catch (error) {
    console.error('Error fetching blogs from Firebase:', error)
    return []
  }
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | undefined> {
  // First try Firebase
  if (typeof window !== 'undefined' && firestore) {
    try {
      const blogs = await fetchBlogsFromFirebase()
      const article = blogs.find(article => article.slug === slug)
      if (article) return article
    } catch (error) {
      console.error('Error fetching blog article from Firebase:', error)
    }
  }

  // Fallback to legacy blog
  if (slug === legacyBlog.slug) {
    return legacyBlog
  }

  return undefined
}

export async function getAllBlogArticles(): Promise<BlogArticle[]> {
  // Fetch from Firebase
  if (typeof window !== 'undefined' && firestore) {
    try {
      const blogs = await fetchBlogsFromFirebase()
      if (blogs.length > 0) {
        // Include legacy blog if no Firebase blogs exist yet
        return blogs
      }
    } catch (error) {
      console.error('Error fetching blogs from Firebase:', error)
    }
  }

  // Fallback to legacy blog
  return [legacyBlog]
}

export async function getSuggestedArticles(currentSlug: string, count: number = 3): Promise<BlogArticle[]> {
  const allArticles = await getAllBlogArticles()
  return allArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, count)
}

