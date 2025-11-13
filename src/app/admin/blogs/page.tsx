'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { BlogManagement } from '@/components/BlogManagement'
import { Navbar } from '@/components/Navbar'
import styles from './blogs.module.css'

export default function AdminBlogsPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (!auth) {
      console.warn('Firebase auth is not initialized yet')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <>
      <Navbar />
      <div className={styles.adminBlogsContainer}>
        <BlogManagement />
      </div>
    </>
  )
}

