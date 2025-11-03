'use client'

import { useEffect, useState } from 'react'
import styles from './LoadingOverlay.module.css'

interface LoadingOverlayProps {
  show: boolean
}

export function LoadingOverlay({ show }: LoadingOverlayProps) {
  const [currentTip, setCurrentTip] = useState(0)

  const loadingTips = [
    { icon: '<i class="fa-solid fa-leaf"></i>', text: 'Un masaje regular ayuda a reducir el estrés y mejorar la calidad del sueño' },
    { icon: '<i class="fa-solid fa-sparkles"></i>', text: 'Los aceites esenciales no solo relajan, también nutren tu piel' },
    { icon: '<i class="fa-solid fa-spa"></i>', text: 'Respirar profundamente durante el masaje aumenta sus beneficios terapéuticos' },
    { icon: '<i class="fa-solid fa-hand-sparkles"></i>', text: 'Un ambiente tranquilo y música suave maximizan la experiencia de relajación' },
    { icon: '<i class="fa-solid fa-seedling"></i>', text: 'La hidratación después del masaje ayuda a eliminar toxinas liberadas' },
    { icon: '<i class="fa-solid fa-sparkles"></i>', text: 'Nuestros profesionales certificados se adaptan a tus necesidades específicas' },
    { icon: '<i class="fa-solid fa-spa"></i>', text: 'Un masaje semanal puede mejorar significativamente tu bienestar general' },
    { icon: '<i class="fa-solid fa-hand-sparkles"></i>', text: 'La aromaterapia durante el masaje activa múltiples sentidos para mayor relajación' }
  ]

  useEffect(() => {
    if (!show) return

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [show, loadingTips.length])

  if (!show) return null

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
        </div>
        <p className={styles.loadingText}>Enviando tu mensaje...</p>
        <div className={styles.loadingTip} id="loadingTip">
          <span dangerouslySetInnerHTML={{ __html: loadingTips[currentTip].icon }} />
          <span className={styles.tipText}>{loadingTips[currentTip].text}</span>
        </div>
      </div>
    </div>
  )
}

