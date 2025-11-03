'use client'

import { LoginForm } from '@/components/LoginForm'
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <img
            src="/superLogo.png"
            alt="Soul Balance"
            className={styles.loginLogoImage}
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

