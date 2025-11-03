'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, firestore } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { AdminDashboard } from '@/components/AdminDashboard'
import { Navbar } from '@/components/Navbar'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Wait for auth to be initialized
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
      <AdminDashboard />
    </>
  )
}

