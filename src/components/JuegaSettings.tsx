'use client'

import { useState } from 'react'
import { useJuegaSettings } from '@/hooks/useJuegaSettings'
import styles from './JuegaSettings.module.css'

export function JuegaSettings() {
  const { enabled, loading, error, updateSettings } = useJuegaSettings()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleToggle = async (newEnabled: boolean) => {
    setSaving(true)
    setMessage(null)
    
    const result = await updateSettings(newEnabled)
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className={styles.settingsCard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.settingsCard}>
      <div className={styles.settingsHeader}>
        <div className={styles.settingsIcon}>
          <i className="fa-solid fa-gamepad"></i>
        </div>
        <div className={styles.settingsInfo}>
          <h2 className={styles.settingsTitle}>Página Juega</h2>
          <p className={styles.settingsDescription}>
            Habilita o deshabilita la página de juegos. Cuando está deshabilitada, 
            el enlace no aparecerá en el menú y los usuarios serán redirigidos si intentan acceder.
          </p>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[`message${message.type}`]}`}>
          <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className={`${styles.message} ${styles.messageError}`}>
          <i className="fa-solid fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.settingsControl}>
        <div className={styles.toggleWrapper}>
          <label className={styles.toggleLabel}>
            <span className={styles.toggleText}>
              {enabled ? 'Habilitada' : 'Deshabilitada'}
            </span>
            <div className={styles.toggleContainer}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                disabled={saving}
                className={styles.toggleInput}
              />
              <span className={`${styles.toggleSlider} ${enabled ? styles.toggleSliderActive : ''}`}></span>
            </div>
          </label>
        </div>
        <div className={styles.statusInfo}>
          <div className={`${styles.statusBadge} ${enabled ? styles.statusBadgeEnabled : styles.statusBadgeDisabled}`}>
            <i className={`fa-solid ${enabled ? 'fa-check' : 'fa-times'}`}></i>
            <span>{enabled ? 'Página activa' : 'Página inactiva'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

