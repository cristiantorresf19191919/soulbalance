'use client'

import { Navbar } from '@/components/Navbar'
import { LoginForm } from '@/components/LoginForm'
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <p className={styles.loginSubtitle}>Panel de Administración</p>
          </div>

          <LoginForm />

          <div className={styles.loginFooter}>
            <p>Acceso restringido para administradores</p>
          </div>
        </div>
      </div>
    </>
  )
}

