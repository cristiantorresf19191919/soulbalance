'use client'

import { useEffect, useState, useCallback } from 'react'
import { Box, Button, IconButton, Paper, Typography, Slide } from '@mui/material'
import { Close, Download } from '@mui/icons-material'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const STORAGE_KEY = 'soul-balance-pwa-dismissed'

const isStandalone = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

const isIos = () => {
  if (typeof window === 'undefined') return false
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [hasDismissed, setHasDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedDismissed = window.localStorage.getItem(STORAGE_KEY) === 'true'
    setHasDismissed(storedDismissed)

    if (isStandalone()) {
      setVisible(false)
      return
    }

    if (isIos()) {
      setVisible(!storedDismissed)
      return
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setVisible(!storedDismissed)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (isIos()) {
      setVisible(false)
      setHasDismissed(true)
      window.localStorage.setItem(STORAGE_KEY, 'true')
      return
    }

    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    setDeferredPrompt(null)

    if (choice.outcome === 'accepted') {
      setVisible(false)
      window.localStorage.setItem(STORAGE_KEY, 'true')
    } else {
      setHasDismissed(true)
      window.localStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [deferredPrompt])

  const handleClose = useCallback(() => {
    setVisible(false)
    setHasDismissed(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [])

  if (!visible || hasDismissed) {
    return null
  }

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
          right: { xs: 'auto', md: 'auto' },
          maxWidth: 360,
          padding: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #075257 0%, #0A6B72 100%)',
          color: '#ffffff',
          zIndex: 1400,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Instala Soul Balance
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Agrega la experiencia a tu pantalla de inicio y disfruta del asistente de bienestar en modo app.
            </Typography>
            {isIos() && (
              <Typography variant="caption" sx={{ display: 'block', marginTop: 1, opacity: 0.85 }}>
                Usa el botón compartir y selecciona “Añadir a pantalla de inicio”.
              </Typography>
            )}
          </Box>
          <IconButton
            aria-label="Cerrar"
            size="small"
            onClick={handleClose}
            sx={{ color: '#ffffff' }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          onClick={handleInstall}
          startIcon={<Download />}
          sx={{
            marginTop: 2,
            backgroundColor: '#ffffff',
            color: '#075257',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          Añadir a inicio
        </Button>
      </Paper>
    </Slide>
  )
}
