'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Drawer, IconButton, TextField, Box, Typography, Avatar, CircularProgress, Chip } from '@mui/material'
import { Send, Close, Minimize, SmartToy } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { services, Service } from '@/data/services'
import { BookingModal } from './BookingModal'
import styles from './FloatingChat.module.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  detectedServices?: Service[]
}

const WELCOME_MESSAGES = [
  '¡Hola! 👋 Bienvenido, soy tu asistente de Aura Spa. ¿En qué servicio terapéutico puedo ayudarte hoy? 😌',
  '¡Hola! 🌸 Bienvenido, soy tu asistente de Aura Spa. ¿Listo para reservar tu servicio? ✨',
  '¡Bienvenido! 💆‍♀️ Soy tu asistente de Aura Spa. ¿Qué servicio terapéutico necesitas? 🧘',
  '¡Hola! 🌿 Bienvenido, soy tu asistente de Aura Spa. ¿Cómo puedo ayudarte a reservar tu cita? 💚'
]

export function FloatingChat() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'pulse' | 'wave' | 'blink'>('idle')
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastActivityRef = useRef<Date>(new Date())
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    if (drawerOpen && messages.length === 0) {
      const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
      setMessages([
        {
          id: 'welcome',
          text: welcomeMessage,
          sender: 'ai',
          timestamp: new Date()
        }
      ])
    }
  }, [drawerOpen, messages.length])

  // Animation system
  useEffect(() => {
    if (!drawerOpen) {
      const scheduleNextAnimation = () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current)
        }

        const now = new Date()
        const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime()
        const isInactive = timeSinceActivity > 180000 // 3 minutes

        let nextAnimationDelay: number
        if (isInactive) {
          // More frequent animations when user is inactive
          nextAnimationDelay = 30000 + Math.random() * 30000 // 30-60 seconds
        } else {
          // Subtle animations when user is active
          nextAnimationDelay = 60000 + Math.random() * 60000 // 60-120 seconds
        }

        animationTimeoutRef.current = setTimeout(() => {
          const animations: Array<'pulse' | 'wave' | 'blink'> = ['pulse', 'wave', 'blink']
          const randomAnimation = animations[Math.floor(Math.random() * animations.length)]
          setAnimationState(randomAnimation)

          setTimeout(() => {
            setAnimationState('idle')
            scheduleNextAnimation()
          }, 2000)
        }, nextAnimationDelay)
      }

      scheduleNextAnimation()

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current)
        }
      }
    } else {
      setAnimationState('idle')
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [drawerOpen])

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = new Date()
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [])

  // Function to detect services in text
  const detectServices = (text: string): Service[] => {
    const detected: Service[] = []
    const normalizedText = text.toLowerCase()

    services.forEach(service => {
      const serviceName = service.name.toLowerCase()
      const serviceKeywords = serviceName
        .replace(/masaje\s+/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2)

      // Check for exact service name match
      if (normalizedText.includes(serviceName)) {
        if (!detected.find(s => s.id === service.id)) {
          detected.push(service)
        }
        return
      }

      // Check for keyword matches
      const keywordMatches = serviceKeywords.filter(keyword => {
        const keywordClean = keyword.replace(/[^a-z]/g, '')
        return normalizedText.includes(keywordClean) || 
               normalizedText.includes(keyword)
      })

      // If at least 50% of keywords match, consider it detected
      if (keywordMatches.length > 0 && keywordMatches.length >= Math.ceil(serviceKeywords.length / 2)) {
        if (!detected.find(s => s.id === service.id)) {
          detected.push(service)
        }
      }

      // Special cases
      const specialCases: { [key: string]: string[] } = {
        'relajante': ['relajante', 'relajación', 'relajar'],
        'descontracturante': ['descontracturante', 'contractura', 'nudos'],
        'piedras': ['piedras volcánicas', 'piedras', 'volcánicas'],
        'prenatal': ['prenatal', 'embarazo', 'embarazada'],
        '4manos': ['4 manos', 'cuatro manos'],
        'piernas': ['piernas cansadas', 'piernas'],
        'vela': ['vela', 'velas'],
        'drenaje': ['drenaje', 'linfático'],
        'bambu': ['bambú', 'bambu', 'bambuterapia'],
        'pindas': ['pindas', 'pinda'],
        'tejido': ['tejido profundo', 'profundo'],
        'craneo': ['cráneo facial', 'craneo facial', 'craneal'],
        'espalda': ['espalda', 'columna'],
        'deportivo': ['deportivo', 'atleta'],
        'pies': ['pies', 'reflexología'],
        'manos': ['manos', 'manicure']
      }

      if (specialCases[service.id]) {
        const matches = specialCases[service.id].some(keyword => 
          normalizedText.includes(keyword)
        )
        if (matches && !detected.find(s => s.id === service.id)) {
          detected.push(service)
        }
      }
    })

    return detected
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    lastActivityRef.current = new Date()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            parts: [{ text: m.text }]
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      const data = await response.json()

      const responseText = data.response || 'Lo siento, no pude procesar tu mensaje.'
      const detectedServices = detectServices(responseText)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        detectedServices: detectedServices.length > 0 ? detectedServices : undefined
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className={`${styles.floatingButton} ${styles[animationState]}`}
        onClick={() => setDrawerOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir chat de asistente"
      >
        <SmartToy className={styles.chatIcon} />
        {animationState !== 'idle' && (
          <motion.div
            className={styles.ripple}
            animate={{
              scale: [1, 2, 2.5],
              opacity: [0.5, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        )}
      </motion.button>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          className: `${styles.drawer} ${isMaximized ? styles.maximized : ''}`,
            sx: {
            width: isMaximized ? '100%' : { xs: '100%', sm: 400 },
            maxWidth: '100vw',
            backgroundColor: '#ffffff',
            borderLeft: 'none',
            boxShadow: isMaximized ? 'none' : '-4px 0 20px rgba(0,0,0,0.1)',
            height: '100vh',
            zIndex: isMaximized ? 9999 : 1000,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Header */}
        <Box className={styles.header}>
          <Box className={styles.headerContent}>
            <Avatar className={styles.headerAvatar}>
              <SmartToy />
            </Avatar>
            <Box>
              <Typography className={styles.headerTitle}>
                Asistente de Bienestar
              </Typography>
              <Typography className={styles.headerSubtitle}>
                Estoy aquí para ayudarte
              </Typography>
            </Box>
          </Box>
          <Box className={styles.headerActions}>
            <IconButton
              onClick={() => setIsMaximized(!isMaximized)}
              className={styles.headerButton}
              size="small"
            >
              {isMaximized ? (
                <i className="fas fa-window-minimize" />
              ) : (
                <i className="fas fa-window-maximize" />
              )}
            </IconButton>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              className={styles.headerButton}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Messages Container */}
        <Box className={styles.messagesContainer}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${styles.messageWrapper} ${styles[message.sender]}`}
              >
                <Box className={styles.messageContainer}>
                  <Avatar
                    className={`${styles.messageAvatar} ${styles[message.sender]}`}
                  >
                    {message.sender === 'user' ? 'Tú' : <SmartToy />}
                  </Avatar>
                  <Box
                    className={`${styles.messageBubble} ${styles[message.sender]}`}
                  >
                    <Typography className={styles.messageText}>
                      {message.text}
                    </Typography>
                    {message.detectedServices && message.detectedServices.length > 0 && (
                      <Box className={styles.serviceChips}>
                        {message.detectedServices.map((service) => (
                          <Chip
                            key={service.id}
                            label={`Reservar ${service.name}`}
                            onClick={() => {
                              setBookingModal({
                                open: true,
                                serviceId: service.id,
                                serviceName: service.name,
                                serviceImage: service.image,
                                pricing: service.pricing,
                                selectedDuration: undefined
                              })
                            }}
                            className={styles.serviceChip}
                            sx={{
                              backgroundColor: '#075257',
                              color: 'white',
                              cursor: 'pointer',
                              marginTop: '8px',
                              marginRight: '4px',
                              '&:hover': {
                                backgroundColor: '#06444A',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    <Typography className={styles.messageTimestamp}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <Box className={styles.loadingIndicator}>
              <Box className={styles.loadingContainer}>
                <CircularProgress size={16} className={styles.loadingSpinner} />
                <Typography className={styles.loadingText}>
                  Pensando...
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box className={styles.inputContainer}>
          <Box className={styles.inputWrapper}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className={styles.chatInput}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#075257',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#075257',
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={styles.sendButton}
              sx={{
                backgroundColor: '#075257',
                color: 'white',
                minWidth: '48px',
                height: '48px',
                '&:hover': {
                  backgroundColor: '#06444A',
                },
                '&:disabled': {
                  backgroundColor: '#9CA3AF',
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModal.open}
        onClose={() => setBookingModal({
          open: false,
          serviceId: '',
          serviceName: '',
          serviceImage: '',
          pricing: [],
          selectedDuration: undefined
        })}
        serviceId={bookingModal.serviceId}
        serviceName={bookingModal.serviceName}
        serviceImage={bookingModal.serviceImage}
        pricing={bookingModal.pricing}
        selectedDuration={bookingModal.selectedDuration}
      />
    </>
  )
}

