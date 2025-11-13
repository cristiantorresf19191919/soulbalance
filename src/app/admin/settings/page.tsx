'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { AdminSidebar } from '@/components/AdminSidebar'
import { JuegaSettings } from '@/components/JuegaSettings'
import styles from './page.module.css'
import adminStyles from '@/components/AdminDashboard.module.css'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (!auth) {
      console.warn('Firebase auth is not initialized yet')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      if (!auth) {
        router.push('/login')
        return
      }
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.')
    }
  }

  return (
    <>
      <header className={adminStyles.adminHeader}>
        <div className={adminStyles.adminHeaderContent}>
          <div className={adminStyles.adminLogo}>
            <Image
              src="/superLogo.png"
              alt="Soul Balance"
              width={40}
              height={40}
              className={adminStyles.adminLogoImage}
            />
            <Link href="/" className={adminStyles.adminLogoText}>
              SOUL BALANCE
            </Link>
            <span 
              className={adminStyles.adminBadge}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              Admin
            </span>
          </div>
          <div className={adminStyles.adminUserInfo}>
            <span>{user?.email}</span>
            <button className={adminStyles.logoutBtn} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className={styles.adminLayout}>
        <AdminSidebar />
        <main className={styles.adminContent}>
          <div className={styles.adminContainer}>
            <div className={styles.adminHeaderSection}>
              <div>
                <h1 className={styles.adminTitle}>Configuración</h1>
                <p className={styles.adminSubtitle}>
                  Gestiona las configuraciones generales del sitio
                </p>
              </div>
            </div>
            <JuegaSettings />
          </div>
        </main>
      </div>
    </>
  )
}

