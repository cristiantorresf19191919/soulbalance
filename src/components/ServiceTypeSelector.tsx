'use client'

import { useState } from 'react'
import styles from './ServiceTypeSelector.module.css'

interface ServiceTypeSelectorProps {
  onSelect: (type: 'persona' | 'empresa') => void
  title?: string
  subtitle?: string
}

export function ServiceTypeSelector({ 
  onSelect, 
  title = '¿Para quién es este servicio?',
  subtitle = 'Selecciona el tipo de servicio que necesitas'
}: ServiceTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'persona' | 'empresa' | null>(null)

  const handleSelect = (type: 'persona' | 'empresa') => {
    setSelectedType(type)
    setTimeout(() => {
      onSelect(type)
    }, 300) // Small delay for smooth transition
  }

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorHeader}>
        <div className={styles.selectorIcon}>
          <i className="fa-solid fa-hand-sparkles"></i>
        </div>
        <h2 className={styles.selectorTitle}>{title}</h2>
        <p className={styles.selectorSubtitle}>{subtitle}</p>
      </div>

      <div className={styles.optionsContainer}>
        <button
          className={`${styles.optionCard} ${selectedType === 'persona' ? styles.optionCardSelected : ''}`}
          onClick={() => handleSelect('persona')}
          type="button"
        >
          <div className={styles.optionIcon}>
            <i className="fa-solid fa-user"></i>
          </div>
          <h3 className={styles.optionTitle}>Para Mí</h3>
          <p className={styles.optionDescription}>
            Servicio personalizado para tu bienestar individual
          </p>
          <div className={styles.optionFeatures}>
            <span className={styles.featureTag}>
              <i className="fa-solid fa-check"></i>
              Reserva personal
            </span>
            <span className={styles.featureTag}>
              <i className="fa-solid fa-check"></i>
              A domicilio
            </span>
          </div>
        </button>

        <button
          className={`${styles.optionCard} ${selectedType === 'empresa' ? styles.optionCardSelected : ''}`}
          onClick={() => handleSelect('empresa')}
          type="button"
        >
          <div className={styles.optionIcon}>
            <i className="fa-solid fa-building"></i>
          </div>
          <h3 className={styles.optionTitle}>Para Mi Empresa</h3>
          <p className={styles.optionDescription}>
            Programas de bienestar corporativo para tu equipo
          </p>
          <div className={styles.optionFeatures}>
            <span className={styles.featureTag}>
              <i className="fa-solid fa-check"></i>
              Programas corporativos
            </span>
            <span className={styles.featureTag}>
              <i className="fa-solid fa-check"></i>
              Propuesta personalizada
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}


