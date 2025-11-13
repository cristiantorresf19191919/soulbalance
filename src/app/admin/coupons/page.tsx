'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { CouponsDashboard } from '@/components/CouponsDashboard'

export default function CouponsPage() {
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
    <CouponsDashboard />
  )
}

