'use client'

import { useState } from 'react'
import { APP_VERSION } from '@/lib/version'
import styles from './VersionBadge.module.css'

interface VersionBadgeProps {
  variant?: 'header' | 'footer'
}

export function VersionBadge({ variant = 'header' }: VersionBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className={`${styles.versionBadge} ${styles[variant]}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={styles.versionNumber}>v{APP_VERSION}</span>
      <div className={`${styles.tooltip} ${showTooltip ? styles.tooltipVisible : ''}`}>
        <div className={styles.tooltipArrow}></div>
        <p className={styles.tooltipText}>
          Versión {APP_VERSION} de la aplicación. Este número se incrementa con cada despliegue a producción para facilitar el seguimiento de cambios y actualizaciones.
        </p>
      </div>
    </div>
  )
}

