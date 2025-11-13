'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ShortsManagement } from '@/components/ShortsManagement'
import { AdminSidebar } from '@/components/AdminSidebar'
import { Navbar } from '@/components/Navbar'
import styles from './page.module.css'

export default function AdminShortsPage() {
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
      <div className={styles.adminShortsContainer}>
        <div className={styles.adminLayout}>
          <AdminSidebar />
          <div className={styles.adminContent}>
            <ShortsManagement />
          </div>
        </div>
      </div>
    </>
  )
}

