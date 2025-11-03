'use client'

import { useState, useEffect } from 'react'
import styles from './ToastNotifications.module.css'

interface Toast {
  id: string
  title: string
  message: string
  type: 'success' | 'error'
}

let toastId = 0
const toastListeners: Array<(toast: Toast) => void> = []

export function showToast(title: string, message: string, type: 'success' | 'error' = 'success') {
  const toast: Toast = {
    id: `toast-${toastId++}`,
    title,
    message,
    type
  }
  toastListeners.forEach(listener => listener(toast))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast])
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 5000)
    }
    
    toastListeners.push(listener)
    
    return () => {
      const index = toastListeners.indexOf(listener)
      if (index > -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [])

  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.toastIcon}>
            {toast.type === 'success' ? (
              <i className="fa-solid fa-check"></i>
            ) : (
              <i className="fa-solid fa-xmark"></i>
            )}
          </div>
          <div className={styles.toastContent}>
            <div className={styles.toastTitle}>{toast.title}</div>
            <div className={styles.toastMessage}>{toast.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

