'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Wait for auth to be initialized
    if (!auth) {
      console.warn('Firebase auth is not initialized yet')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/admin')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!auth) {
      setError('Firebase no está inicializado. Por favor, recarga la página.')
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="admin@soulbalance.com"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Contraseña</label>
        <div className={styles.passwordInputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Mostrar contraseña"
          >
            <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}></i>
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.formError}>
          {error}
        </div>
      )}

      <button type="submit" className={styles.loginBtn} disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}

