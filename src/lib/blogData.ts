export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  heroImage: string
  heroImageAlt: string
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

export const blogArticles: BlogArticle[] = [
  {
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
  },
  // Placeholder for future articles - you can add more here
]

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find(article => article.slug === slug)
}

export function getAllBlogArticles(): BlogArticle[] {
  return blogArticles.sort((a, b) => {
    // Sort by date descending (newest first)
    return b.date.localeCompare(a.date)
  })
}

export function getSuggestedArticles(currentSlug: string, count: number = 3): BlogArticle[] {
  return blogArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, count)
}

