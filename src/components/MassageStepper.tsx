'use client'

import { useState, useEffect } from 'react'
import styles from './MassageStepper.module.css'
import { MassageRecommendation } from './MassageRecommendation'
import { BookingModal } from './BookingModal'

interface MassageStepperProps {
  open: boolean
  onClose: () => void
}

interface QuestionOption {
  text: string
  value: string
}

interface Question {
  id: number
  question: string
  type: 'single' | 'multiple' | 'scale' | 'textarea'
  options?: QuestionOption[]
  placeholder?: string
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '¿Cuál es el motivo principal por el que buscas un masaje hoy?',
    type: 'multiple',
    options: [
      { text: 'Relajación general y bajar el estrés', value: 'relajacion-estres' },
      { text: 'Dolor muscular específico', value: 'dolor-muscular' },
      { text: 'Dolor de espalda o cuello', value: 'dolor-espalda-cuello' },
      { text: 'Cansancio extremo / sensación de pesadez', value: 'cansancio-pesadez' },
      { text: 'Recuperación después de ejercicio o deporte', value: 'recuperacion-deporte' },
      { text: 'Mejorar la circulación / retención de líquidos', value: 'circulacion-liquidos' },
      { text: 'Preparación para un evento especial (boda, viaje, baile, etc.)', value: 'evento-especial' },
      { text: 'Recomendación médica', value: 'recomendacion-medica' },
      { text: 'Solo curiosidad / regalo para mí mismo(a)', value: 'curiosidad-regalo' },
    ],
  },
  {
    id: 2,
    question: '¿En qué partes del cuerpo sientes más dolor o tensión?',
    type: 'multiple',
    options: [
      { text: 'Cuello y hombros', value: 'cuello-hombros' },
      { text: 'Espalda alta', value: 'espalda-alta' },
      { text: 'Espalda baja / zona lumbar', value: 'espalda-baja' },
      { text: 'Piernas (muslos, pantorrillas)', value: 'piernas' },
      { text: 'Pies', value: 'pies' },
      { text: 'Brazos y manos', value: 'brazos-manos' },
      { text: 'Cabeza / mandíbula / rostro', value: 'cabeza-mandibula' },
      { text: 'Zona glútea / caderas', value: 'gluteos-caderas' },
      { text: 'Todo el cuerpo en general', value: 'todo-cuerpo' },
    ],
  },
  {
    id: 3,
    question: '¿Desde cuándo tienes esas molestias y en qué momentos del día se sienten peor?',
    type: 'single',
    options: [
      { text: 'Desde hace pocos días, empeora al final del día', value: 'pocos-dias-final-dia' },
      { text: 'Desde hace semanas, constante casi todo el día', value: 'semanas-constante' },
      { text: 'Desde hace meses, empeora cuando trabajo muchas horas', value: 'meses-trabajo' },
      { text: 'Desde hace años, empeora al estar mucho tiempo sentado(a)', value: 'anos-sentado' },
      { text: 'Desde hace años, empeora al estar mucho tiempo de pie o caminando', value: 'anos-pie' },
      { text: 'Solo aparece después de hacer ejercicio o esfuerzo físico', value: 'despues-ejercicio' },
      { text: 'Solo aparece en momentos de mucho estrés', value: 'momentos-estres' },
    ],
  },
  {
    id: 4,
    question: 'En una escala de 1 a 10, ¿qué tan intenso es tu dolor o tensión ahora mismo?',
    type: 'scale',
    options: [
      { text: '1–3: dolor leve, molesto pero manejable', value: '1-3' },
      { text: '4–6: dolor moderado, me incomoda en el día a día', value: '4-6' },
      { text: '7–8: dolor fuerte, afecta mis actividades', value: '7-8' },
      { text: '9–10: dolor muy intenso, difícil de tolerar', value: '9-10' },
    ],
  },
  {
    id: 5,
    question: '¿Tienes algún diagnóstico médico importante?',
    type: 'multiple',
    options: [
      { text: 'Problemas de columna (hernia, escoliosis, lumbalgia, etc.)', value: 'columna' },
      { text: 'Varices importantes o problemas de circulación', value: 'varices-circulacion' },
      { text: 'Hipertensión (presión alta)', value: 'hipertension' },
      { text: 'Problemas cardíacos', value: 'cardiacos' },
      { text: 'Cirugías recientes (últimos 6 meses)', value: 'cirugias-recientes' },
      { text: 'Embarazo', value: 'embarazo' },
      { text: 'Problemas de coagulación o uso de anticoagulantes', value: 'coagulacion' },
      { text: 'Ninguno de los anteriores', value: 'ninguno' },
    ],
  },
  {
    id: 6,
    question: '¿Tomas medicamentos de forma regular?',
    type: 'multiple',
    options: [
      { text: 'Anticoagulantes o medicamentos para la coagulación', value: 'anticoagulantes' },
      { text: 'Medicamentos para la presión arterial', value: 'presion-arterial' },
      { text: 'Medicamentos para el dolor crónico o inflamación', value: 'dolor-inflamacion' },
      { text: 'Medicamentos para ansiedad, depresión u otros temas emocionales', value: 'ansiedad-depresion' },
      { text: 'Vitaminas o suplementos solamente', value: 'vitaminas-suplementos' },
      { text: 'No tomo medicamentos de forma regular', value: 'ninguno' },
    ],
  },
  {
    id: 7,
    question: '¿Tienes alergias o sensibilidad en la piel?',
    type: 'multiple',
    options: [
      { text: 'Alergia a aceites o cremas', value: 'alergia-aceites' },
      { text: 'Sensibilidad a aromas fuertes (esencias, aceites, velas aromáticas)', value: 'sensibilidad-aromas' },
      { text: 'Sensibilidad al calor (piedras volcánicas, compresas calientes, velas)', value: 'sensibilidad-calor' },
      { text: 'Piel muy delicada / atópica', value: 'piel-delicada' },
      { text: 'No tengo alergias ni sensibilidades conocidas', value: 'ninguna' },
    ],
  },
  {
    id: 8,
    question: '¿Cómo es tu día a día físicamente?',
    type: 'single',
    options: [
      { text: 'Paso muchas horas sentado(a) frente al computador', value: 'sentado-computador' },
      { text: 'Paso muchas horas de pie o caminando', value: 'pie-caminando' },
      { text: 'Levanto peso o hago esfuerzo físico en el trabajo', value: 'esfuerzo-fisico' },
      { text: 'Trabajo más bien tranquilo, con poco movimiento', value: 'tranquilo' },
      { text: 'Hago ejercicio suave (caminar, yoga, estiramientos) varias veces a la semana', value: 'ejercicio-suave' },
      { text: 'Hago ejercicio intenso (gym, running, deporte) varias veces a la semana', value: 'ejercicio-intenso' },
      { text: 'Casi no hago actividad física', value: 'poca-actividad' },
    ],
  },
  {
    id: 9,
    question: 'En una escala de 1 a 10, ¿cómo calificarías tu nivel de estrés en este momento?',
    type: 'scale',
    options: [
      { text: '1–3: poco estrés, me siento bastante tranquilo(a)', value: '1-3' },
      { text: '4–6: estrés moderado, pero lo manejo', value: '4-6' },
      { text: '7–8: mucho estrés, afecta mi descanso o mi ánimo', value: '7-8' },
      { text: '9–10: estrés muy alto, me siento saturado(a)', value: '9-10' },
    ],
  },
  {
    id: 10,
    question: '¿Prefieres un masaje suave, medio o profundo, y hay alguna zona donde no quieras contacto?',
    type: 'multiple',
    options: [
      { text: 'Presión: Suave y muy relajante', value: 'presion-suave' },
      { text: 'Presión: Media, que alivie tensión pero sin dolor', value: 'presion-media' },
      { text: 'Presión: Profunda/intensa, estoy acostumbrado(a) a presión fuerte', value: 'presion-profunda' },
      { text: 'No deseo masaje en abdomen', value: 'no-abdomen' },
      { text: 'No deseo masaje en glúteos', value: 'no-gluteos' },
      { text: 'No deseo masaje en pecho/torso', value: 'no-pecho' },
      { text: 'No deseo masaje en pies', value: 'no-pies' },
      { text: 'No tengo problema, me siento cómodo(a) con el protocolo profesional', value: 'sin-restricciones' },
    ],
  },
]

const STORAGE_KEY = 'massage_recommendation_previous'

export function MassageStepper({ open, onClose }: MassageStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(10).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTip, setCurrentTip] = useState(0)
  const [showPreviousResult, setShowPreviousResult] = useState(false)
  const [previousRecommendation, setPreviousRecommendation] = useState<string | null>(null)
  const [hasStartedNew, setHasStartedNew] = useState(false)

  const loadingTips = [
    { icon: 'fa-solid fa-leaf', text: 'Un masaje regular ayuda a reducir el estrés y mejorar la calidad del sueño' },
    { icon: 'fa-solid fa-sparkles', text: 'Los aceites esenciales no solo relajan, también nutren tu piel' },
    { icon: 'fa-solid fa-spa', text: 'Respirar profundamente durante el masaje aumenta sus beneficios terapéuticos' },
    { icon: 'fa-solid fa-hand-sparkles', text: 'Un ambiente tranquilo y música suave maximizan la experiencia de relajación' },
    { icon: 'fa-solid fa-seedling', text: 'La hidratación después del masaje ayuda a eliminar toxinas liberadas' },
    { icon: 'fa-solid fa-sparkles', text: 'Nuestros profesionales certificados se adaptan a tus necesidades específicas' },
    { icon: 'fa-solid fa-spa', text: 'Un masaje semanal puede mejorar significativamente tu bienestar general' },
    { icon: 'fa-solid fa-hand-sparkles', text: 'La aromaterapia durante el masaje activa múltiples sentidos para mayor relajación' }
  ]

  // Check for previous recommendation when modal opens
  useEffect(() => {
    if (open) {
      const savedRecommendation = localStorage.getItem(STORAGE_KEY)
      if (savedRecommendation) {
        setPreviousRecommendation(savedRecommendation)
      } else {
        setPreviousRecommendation(null)
      }
      setShowPreviousResult(false)
      setHasStartedNew(false)
    }
  }, [open])

  // Rotate tips when loading
  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading, loadingTips.length])
  const [bookingModal, setBookingModal] = useState<{
    open: boolean
    serviceId: string
    serviceName: string
    serviceImage: string
    pricing: Array<{ duration: string; price: string }>
    selectedDuration?: string
  }>({
    open: false,
    serviceId: '',
    serviceName: '',
    serviceImage: '',
    pricing: [],
    selectedDuration: undefined
  })

  if (!open) return null

  const currentQuestion = QUESTIONS[currentStep]
  const canGoNext = answers[currentStep].trim().length > 0

  // Get step state
  const getStepState = (index: number) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'inactive'
  }

  // Validate all questions are answered
  const validateAllAnswers = () => {
    const unansweredQuestions: number[] = []
    answers.forEach((answer, index) => {
      if (!answer || answer.trim().length === 0) {
        unansweredQuestions.push(index + 1)
      }
    })
    return unansweredQuestions
  }

  const handleOptionSelect = (value: string) => {
    const newAnswers = [...answers]
    const currentAnswer = newAnswers[currentStep]
    
    if (currentQuestion.type === 'multiple') {
      // Multiple selection - toggle option
      const selectedValues = currentAnswer ? currentAnswer.split(',').filter(v => v.trim()) : []
      const index = selectedValues.indexOf(value)
      
      if (index > -1) {
        // Remove if already selected
        selectedValues.splice(index, 1)
      } else {
        // Add if not selected
        selectedValues.push(value)
      }
      
      newAnswers[currentStep] = selectedValues.join(', ')
    } else {
      // Single selection
      newAnswers[currentStep] = value
    }
    
    setAnswers(newAnswers)
    setError(null)
  }

  const isOptionSelected = (value: string): boolean => {
    const currentAnswer = answers[currentStep]
    if (!currentAnswer) return false
    
    if (currentQuestion.type === 'multiple') {
      return currentAnswer.split(',').map(v => v.trim()).includes(value)
    }
    return currentAnswer === value
  }

  const handleScaleSelect = (value: string) => {
    handleOptionSelect(value)
  }

  const handleStepClick = (stepIndex: number) => {
    // Allow clicking on completed steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
      setError(null)
      const modal = document.querySelector(`.${styles.modal}`)
      if (modal) {
        modal.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleNext = () => {
    if (!canGoNext) {
      setError('Por favor, selecciona al menos una opción antes de continuar')
      return
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
      setError(null)
      const modal = document.querySelector(`.${styles.modal}`)
      if (modal) {
        modal.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // Last step - validate all before submitting
      const unanswered = validateAllAnswers()
      if (unanswered.length > 0) {
        setError(`Por favor, completa todas las preguntas. Faltan: ${unanswered.join(', ')}`)
        setCurrentStep(unanswered[0] - 1)
        return
      }
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setError(null)
      const modal = document.querySelector(`.${styles.modal}`)
      if (modal) {
        modal.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleSubmit = async () => {
    // Final validation before submitting
    const unanswered = validateAllAnswers()
    if (unanswered.length > 0) {
      setError(`Por favor, completa todas las preguntas antes de continuar. Faltan: ${unanswered.join(', ')}`)
      setCurrentStep(unanswered[0] - 1)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Format answers for API
      const formattedAnswers = answers.map((answer, index) => {
        const question = QUESTIONS[index]
        if (question.type === 'multiple' && answer) {
          // Convert multiple values back to readable text
          const values = answer.split(',').map(v => v.trim())
          return values.map(val => {
            const option = question.options?.find(opt => opt.value === val)
            return option ? option.text : val
          }).join(', ')
        } else if (answer) {
          const option = question.options?.find(opt => opt.value === answer)
          return option ? option.text : answer
        }
        return answer
      })

      const response = await fetch('/api/recommend-massage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al obtener la recomendación')
      }

      const data = await response.json()
      setRecommendation(data.recommendation)
      // Save recommendation to localStorage
      localStorage.setItem(STORAGE_KEY, data.recommendation)
    } catch (err: any) {
      setError(err.message || 'Error al procesar tu solicitud. Por favor, inténtalo de nuevo.')
      console.error('Error submitting answers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers(new Array(10).fill(''))
    setRecommendation(null)
    setError(null)
    setShowPreviousResult(false)
    setHasStartedNew(false)
  }

  const handleViewPrevious = () => {
    if (previousRecommendation) {
      setRecommendation(previousRecommendation)
      setShowPreviousResult(true)
    }
  }

  const handleStartNew = () => {
    setShowPreviousResult(false)
    setRecommendation(null)
    setCurrentStep(0)
    setAnswers(new Array(10).fill(''))
    setError(null)
    setHasStartedNew(true)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleServiceSelect = (service: {
    serviceId: string
    serviceName: string
    serviceImage: string
    pricing: Array<{ duration: string; price: string }>
    selectedDuration?: string
  }) => {
    setBookingModal({
      open: true,
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceImage: service.serviceImage,
      pricing: service.pricing,
      selectedDuration: service.selectedDuration
    })
  }

  const handleCloseBookingModal = () => {
    setBookingModal({
      open: false,
      serviceId: '',
      serviceName: '',
      serviceImage: '',
      pricing: [],
      selectedDuration: undefined
    })
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.closeButton} 
          onClick={handleClose} 
          aria-label="Cerrar"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          <i className="fa-solid fa-times"></i>
        </button>
        
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingSpinner}>
                <div className={styles.spinnerCircle}></div>
                <div className={styles.spinnerCircle}></div>
                <div className={styles.spinnerCircle}></div>
              </div>
              <p className={styles.loadingText}>Generando tu recomendación personalizada...</p>
              <div className={styles.loadingTip}>
                <i className={`${loadingTips[currentTip].icon} ${styles.tipIcon}`}></i>
                <span className={styles.tipText}>{loadingTips[currentTip].text}</span>
              </div>
            </div>
          </div>
        )}

        {recommendation ? (
          <MassageRecommendation
            recommendation={recommendation}
            onReset={handleReset}
            onClose={handleClose}
            onServiceSelect={handleServiceSelect}
          />
        ) : previousRecommendation && !showPreviousResult && !hasStartedNew ? (
          <div className={styles.previousResultChoice}>
            <div className={styles.choiceHeader}>
              <div className={styles.choiceIcon}>
                <i className="fa-solid fa-history"></i>
              </div>
              <h2 className={styles.choiceTitle}>¿Qué deseas hacer?</h2>
              <p className={styles.choiceSubtitle}>
                Tienes una recomendación previa guardada
              </p>
            </div>
            <div className={styles.choiceActions}>
              <button 
                className={styles.viewPreviousButton}
                onClick={handleViewPrevious}
              >
                <i className="fa-solid fa-eye"></i>
                <span>Mirar resultado previo</span>
              </button>
              <button 
                className={styles.startNewButton}
                onClick={handleStartNew}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Empezar cuestionario nuevo</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>
                <i className={`fa-solid fa-leaf ${styles.titleIcon}`}></i>
                <span>Encuentra tu Masaje Ideal</span>
              </h2>
              <p className={styles.subtitle}>
                Responde estas preguntas para recibir una recomendación personalizada
              </p>
            </div>
            {/* Progress Bar */}
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBarFill}
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            {/* Beautiful Step Indicator */}
            <div className={styles.stepsContainer}>
              <div className={styles.stepsScrollWrapper}>
                <div className={styles.stepsWrapper}>
                  {QUESTIONS.map((question, index) => {
                    const state = getStepState(index)
                    const isClickable = index <= currentStep
                    
                    return (
                      <div key={index} className={styles.stepWrapper}>
                        <div 
                          className={styles.stepItem}
                          onClick={() => isClickable && handleStepClick(index)}
                          style={{ cursor: isClickable ? 'pointer' : 'default' }}
                        >
                          <div className={`${styles.stepCircle} ${styles[`stepCircle${state.charAt(0).toUpperCase() + state.slice(1)}`]}`}>
                            {state === 'completed' ? (
                              <i className="fa-solid fa-check"></i>
                            ) : state === 'active' ? (
                              <span>{index + 1}</span>
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                        </div>
                        {index < QUESTIONS.length - 1 && (
                          <div 
                            className={`${styles.stepLine} ${styles[`stepLine${index < currentStep ? 'Completed' : index === currentStep ? 'Active' : 'Inactive'}`]}`}
                          ></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>            
            </div>

            {/* Current Question Content */}
            <div className={styles.questionContainer} style={{ display: isLoading ? 'none' : 'block' }}>
              <div className={styles.questionInput}>
                {currentQuestion.type === 'scale' ? (
                  <div className={styles.scaleOptionsContainer}>
                    {currentQuestion.options?.map((option) => (
                      <button
                        key={option.value}
                        className={`${styles.scaleOptionButton} ${
                          isOptionSelected(option.value) ? styles.scaleOptionButtonActive : ''
                        }`}
                        onClick={() => handleScaleSelect(option.value)}
                      >
                        <div className={styles.scaleOptionContent}>
                          <div className={styles.scaleOptionRange}>{option.value}</div>
                          <div className={styles.scaleOptionText}>{option.text}</div>
                        </div>
                        {isOptionSelected(option.value) && (
                          <i className={`fa-solid fa-check ${styles.scaleOptionCheck}`}></i>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.optionsContainer}>
                    {currentQuestion.options?.map((option) => (
                      <button
                        key={option.value}
                        className={`${styles.optionButton} ${
                          isOptionSelected(option.value) ? styles.optionButtonActive : ''
                        }`}
                        onClick={() => handleOptionSelect(option.value)}
                      >
                        <div className={styles.optionCheckbox}>
                          {currentQuestion.type === 'multiple' ? (
                            <div className={`${styles.checkbox} ${isOptionSelected(option.value) ? styles.checkboxChecked : ''}`}>
                              {isOptionSelected(option.value) && (
                                <i className="fa-solid fa-check"></i>
                              )}
                            </div>
                          ) : (
                            <div className={`${styles.radio} ${isOptionSelected(option.value) ? styles.radioChecked : ''}`}>
                              {isOptionSelected(option.value) && (
                                <div className={styles.radioDot}></div>
                              )}
                            </div>
                          )}
                        </div>
                        <span className={styles.optionText}>{option.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              {currentStep > 0 && (
                <button
                  className={styles.backButton}
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  Anterior
                </button>
              )}
              <button
                className={styles.nextButton}
                onClick={handleNext}
                disabled={!canGoNext || isLoading}
              >
                {currentStep === QUESTIONS.length - 1 ? (
                  <>
                    <i className="fa-solid fa-check"></i>
                    Obtener Recomendación
                  </>
                ) : (
                  <>
                    Siguiente
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModal.open}
        onClose={handleCloseBookingModal}
        serviceId={bookingModal.serviceId}
        serviceName={bookingModal.serviceName}
        serviceImage={bookingModal.serviceImage}
        pricing={bookingModal.pricing}
        selectedDuration={bookingModal.selectedDuration}
      />
    </div>
  )
}
