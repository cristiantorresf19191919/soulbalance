'use client'

import Image from 'next/image'
import { LoginForm } from '@/components/LoginForm'
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Image
            src="/superLogo.png"
            alt="Soul Balance"
            width={150}
            height={150}
            className={styles.loginLogoImage}
            priority
          />
          <h1 className={styles.loginTitle}>SOUL BALANCE</h1>
          <p className={styles.loginSubtitle}>Panel de Administración</p>
        </div>

        <LoginForm />

        <div className={styles.loginFooter}>
          <p>Acceso restringido para administradores</p>
        </div>
      </div>
    </div>
  )
}

