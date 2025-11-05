'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { services } from '@/data/services'
import styles from './MassageRecommendation.module.css'

interface MassageRecommendationProps {
  recommendation: string
  onReset: () => void
  onClose: () => void
  onServiceSelect?: (service: {
    serviceId: string
    serviceName: string
    serviceImage: string
    pricing: Array<{ duration: string; price: string }>
    selectedDuration?: string
  }) => void
}

interface ParsedRecommendation {
  recommendedService?: string
  category?: string
  duration?: string
  premium?: string
  reason?: string
  alternatives?: string[]
  alerts?: string
}

const FROM_RECOMMENDATIONS_FLAG = 'from_recommendations'

export function MassageRecommendation({
  recommendation,
  onReset,
  onClose,
  onServiceSelect,
}: MassageRecommendationProps) {
  const router = useRouter()

  // Parse recommendation text to extract structured data
  const parsedRecommendation = useMemo<ParsedRecommendation>(() => {
    const lines = recommendation.split('\n').filter(line => line.trim())
    const parsed: ParsedRecommendation = {}

    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('Servicio recomendado:') || trimmed.toLowerCase().includes('servicio recomendado:')) {
        parsed.recommendedService = trimmed.split(':').slice(1).join(':').trim()
      } else if (trimmed.startsWith('Categoría:') || trimmed.toLowerCase().includes('categoría:')) {
        parsed.category = trimmed.split(':').slice(1).join(':').trim()
      } else if (trimmed.startsWith('Duración sugerida:') || trimmed.toLowerCase().includes('duración sugerida:')) {
        const durationText = trimmed.split(':').slice(1).join(':').trim()
        const match = durationText.match(/(\d+)/)
        parsed.duration = match ? match[1] : durationText
      } else if (trimmed.startsWith('Premium:') || trimmed.toLowerCase().includes('premium:')) {
        parsed.premium = trimmed.split(':').slice(1).join(':').trim()
      } else if (trimmed.toLowerCase().includes('motivo de la recomendación')) {
        parsed.reason = trimmed.split(':').slice(1).join(':').trim()
      } else if (trimmed.toLowerCase().includes('alertas') || trimmed.toLowerCase().includes('precauciones')) {
        parsed.alerts = trimmed.split(':').slice(1).join(':').trim()
      }
    })

    // Extract reason if it spans multiple lines
    const reasonIndex = lines.findIndex(line => 
      line.toLowerCase().includes('motivo') && line.toLowerCase().includes('recomendación')
    )
    if (reasonIndex !== -1) {
      const reasonLines: string[] = []
      for (let i = reasonIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.toLowerCase().includes('opciones alternativas') || 
            line.toLowerCase().includes('alertas') ||
            line.toLowerCase().includes('precauciones')) {
          break
        }
        if (i === reasonIndex) {
          const afterColon = line.split(':').slice(1).join(':').trim()
          if (afterColon) reasonLines.push(afterColon)
        } else if (line && !line.toLowerCase().startsWith('categoría') && 
                   !line.toLowerCase().startsWith('duración') &&
                   !line.toLowerCase().startsWith('premium')) {
          reasonLines.push(line)
        }
      }
      if (reasonLines.length > 0 && !parsed.reason) {
        parsed.reason = reasonLines.join(' ').trim()
      }
    }

    // Extract alternatives (lines starting with dash or asterisk after "Opciones alternativas")
    const alternativesIndex = lines.findIndex(line => 
      line.toLowerCase().includes('opciones alternativas')
    )
    if (alternativesIndex !== -1) {
      parsed.alternatives = []
      for (let i = alternativesIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line && (line.startsWith('-') || line.startsWith('*'))) {
          // Extract service name from line (usually before colon or parenthesis)
          let serviceName = line.replace(/^[-*]\s*/, '').trim()
          
          // Clean up service name - remove everything after colon or in parentheses
          serviceName = serviceName.split(':')[0].split('(')[0].trim()
          
          parsed.alternatives.push(serviceName)
        } else if (line && !line.toLowerCase().includes('motivo') && 
                   !line.toLowerCase().includes('categoría') &&
                   !line.toLowerCase().includes('alertas') &&
                   !line.toLowerCase().includes('precauciones')) {
          continue
        } else {
          break
        }
      }
    }

    return parsed
  }, [recommendation])

  // Find service by name match with improved matching
  const findServiceByName = (serviceName: string) => {
    if (!serviceName) return undefined
    
    const normalized = serviceName.toLowerCase().trim()
      .replace(/masaje\s+/g, '')
      .replace(/\s*\(.*?\)/g, '')
      .replace(/:\s*.*/g, '')
      .replace(/\s+/g, ' ')
    
    return services.find(service => {
      const serviceNormalized = service.name.toLowerCase()
        .replace(/masaje\s+/g, '')
        .replace(/\s+/g, ' ')
      
      // Exact match
      if (serviceNormalized === normalized) return true
      
      // Contains match
      if (serviceNormalized.includes(normalized) || normalized.includes(serviceNormalized)) {
        return true
      }
      
      // Keyword matching for services like "Masaje con Piedras Volcánicas"
      const serviceKeywords = serviceNormalized.split(/\s+/)
        .filter(w => w.length > 3)
        .map(w => w.replace(/[^a-z]/g, ''))
      
      const normalizedKeywords = normalized.split(/\s+/)
        .filter(w => w.length > 3)
        .map(w => w.replace(/[^a-z]/g, ''))
      
      const matchingKeywords = serviceKeywords.filter(keyword => 
        normalizedKeywords.some(nk => nk.includes(keyword) || keyword.includes(nk))
      )
      
      // If at least 50% of keywords match
      if (matchingKeywords.length > 0 && matchingKeywords.length >= Math.ceil(serviceKeywords.length / 2)) {
        return true
      }
      
      // Special case matching
      if (normalized.includes('piedras') && serviceNormalized.includes('piedras')) return true
      if (normalized.includes('relajante') && serviceNormalized.includes('relajante')) return true
      if (normalized.includes('deportivo') && serviceNormalized.includes('deportivo')) return true
      if (normalized.includes('prenatal') && serviceNormalized.includes('prenatal')) return true
      if (normalized.includes('4 manos') || normalized.includes('cuatro manos')) {
        return serviceNormalized.includes('4 manos') || serviceNormalized.includes('cuatro')
      }
      if (normalized.includes('descontracturante') && serviceNormalized.includes('descontracturante')) return true
      if (normalized.includes('tejido') && serviceNormalized.includes('tejido')) return true
      if (normalized.includes('espalda') && serviceNormalized.includes('espalda')) return true
      if (normalized.includes('piernas') && serviceNormalized.includes('piernas')) return true
      if (normalized.includes('drenaje') && serviceNormalized.includes('drenaje')) return true
      if (normalized.includes('craneo') || normalized.includes('cráneo')) {
        return serviceNormalized.includes('craneo') || serviceNormalized.includes('cráneo')
      }
      if (normalized.includes('vela') && serviceNormalized.includes('vela')) return true
      if (normalized.includes('pindas') && serviceNormalized.includes('pindas')) return true
      if (normalized.includes('bambu') && serviceNormalized.includes('bambu')) return true
      
      return false
    })
  }

  // Extract duration from service name if it includes duration info
  const extractDuration = (serviceText: string): string | undefined => {
    const match = serviceText.match(/(\d+)\s*minutos?/i)
    return match ? `${match[1]} min` : undefined
  }

  const handleServiceClick = (serviceName: string, durationText?: string) => {
    const service = findServiceByName(serviceName)
    if (service) {
      const duration = durationText || extractDuration(serviceName) || parsedRecommendation.duration
      
      // Store flag that user came from recommendations
      localStorage.setItem(FROM_RECOMMENDATIONS_FLAG, 'true')
      
      // Navigate to service detail page
      onClose()
      router.push(`/servicios/${service.id}`)
    }
  }

  const recommendedService = parsedRecommendation.recommendedService
  const serviceFound = recommendedService ? findServiceByName(recommendedService) : null
  const isPremium = parsedRecommendation.premium?.toLowerCase().includes('sí') || 
                    parsedRecommendation.premium?.toLowerCase().includes('si') ||
                    parsedRecommendation.premium?.toLowerCase().includes('yes')

  return (
    <>
      <div className={styles.recommendationContainer}>
        <div className={styles.recommendationHeader}>
          <div className={styles.recommendationIcon}>
            <i className="fa-solid fa-spa"></i>
          </div>
          <h2 className={styles.recommendationTitle}>Tu Recomendación Personalizada</h2>
          <p className={styles.recommendationSubtitle}>
            Hemos analizado tus necesidades y hemos encontrado el masaje perfecto para ti
          </p>
        </div>

        <div className={styles.recommendationContent}>
          {/* Main Recommendation Card */}
          <div className={styles.mainRecommendationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <i className="fa-solid fa-star"></i>
              </div>
              <div className={styles.cardHeaderText}>
                <span className={styles.cardLabel}>Recomendación Principal</span>
                {isPremium && (
                  <span className={styles.premiumBadge}>
                    <i className="fa-solid fa-crown"></i>
                    Premium
                  </span>
                )}
              </div>
            </div>

            {recommendedService && serviceFound && (
              <div 
                className={styles.serviceChip}
                onClick={() => handleServiceClick(recommendedService, parsedRecommendation.duration)}
              >
                <div className={styles.chipIcon}>
                  <i className="fa-solid fa-hand-sparkles"></i>
                </div>
                <div className={styles.chipContent}>
                  <span className={styles.chipName}>{serviceFound.name}</span>
                  <span className={styles.chipMeta}>
                    {parsedRecommendation.category && (
                      <span className={styles.chipCategory}>{parsedRecommendation.category}</span>
                    )}
                    {parsedRecommendation.duration && (
                      <span className={styles.chipDuration}>
                        <i className="fa-solid fa-clock"></i>
                        {parsedRecommendation.duration} min
                      </span>
                    )}
                  </span>
                </div>
                <div className={styles.chipAction}>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            )}

            {recommendedService && !serviceFound && (
              <div className={styles.serviceChip}>
                <div className={styles.chipIcon}>
                  <i className="fa-solid fa-hand-sparkles"></i>
                </div>
                <div className={styles.chipContent}>
                  <span className={styles.chipName}>{recommendedService}</span>
                  {parsedRecommendation.duration && (
                    <span className={styles.chipDuration}>
                      <i className="fa-solid fa-clock"></i>
                      {parsedRecommendation.duration} min
                    </span>
                  )}
                </div>
              </div>
            )}

            {parsedRecommendation.reason && (
              <div className={styles.reasonSection}>
                <div className={styles.reasonHeader}>
                  <i className="fa-solid fa-lightbulb"></i>
                  <span>Por qué esta recomendación</span>
                </div>
                <p className={styles.reasonText}>{parsedRecommendation.reason}</p>
              </div>
            )}
          </div>

          {/* Alternatives Section */}
          {parsedRecommendation.alternatives && parsedRecommendation.alternatives.length > 0 && (
            <div className={styles.alternativesSection}>
              <div className={styles.sectionHeader}>
                <i className="fa-solid fa-shuffle"></i>
                <h3 className={styles.sectionTitle}>Opciones Alternativas</h3>
              </div>
              <div className={styles.chipsGrid}>
                {parsedRecommendation.alternatives.map((alt, index) => {
                  const altService = findServiceByName(alt)
                  const altDuration = extractDuration(alt)
                  if (altService) {
                    return (
                      <div
                        key={index}
                        className={`${styles.serviceChip} ${styles.alternativeChip}`}
                        onClick={() => handleServiceClick(alt, altDuration)}
                      >
                        <div className={styles.chipIcon}>
                          <i className="fa-solid fa-spa"></i>
                        </div>
                        <div className={styles.chipContent}>
                          <span className={styles.chipName}>{altService.name}</span>
                          {altDuration && (
                            <span className={styles.chipDuration}>
                              <i className="fa-solid fa-clock"></i>
                              {altDuration}
                            </span>
                          )}
                        </div>
                        <div className={styles.chipAction}>
                          <i className="fa-solid fa-arrow-right"></i>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {parsedRecommendation.alerts && (
            <div className={styles.alertSection}>
              <div className={styles.alertHeader}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Importante</span>
              </div>
              <p className={styles.alertText}>{parsedRecommendation.alerts}</p>
            </div>
          )}
        </div>

        <div className={styles.recommendationActions}>
          <button className={styles.resetButton} onClick={onReset}>
            <i className="fa-solid fa-redo"></i>
            Volver a empezar
          </button>
          <button className={styles.closeRecButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </>
  )
}
