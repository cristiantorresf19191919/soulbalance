'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, firestore } from '@/lib/firebase'
import { services } from '@/data/services'
import styles from './dashboard.module.css'

interface PartnerAvailability {
  [key: string]: {
    morning: boolean
    afternoon: boolean
    evening: boolean
  }
}

interface Partner {
  id: string
  fullName: string
  servicesOffered: string[]
  availability: PartnerAvailability
}

const defaultAvailability: PartnerAvailability = {
  monday: { morning: false, afternoon: false, evening: false },
  tuesday: { morning: false, afternoon: false, evening: false },
  wednesday: { morning: false, afternoon: false, evening: false },
  thursday: { morning: false, afternoon: false, evening: false },
  friday: { morning: false, afternoon: false, evening: false },
  saturday: { morning: false, afternoon: false, evening: false },
  sunday: { morning: false, afternoon: false, evening: false },
}

const dayLabels: { key: keyof PartnerAvailability; label: string; short: string }[] = [
  { key: 'monday', label: 'Lunes', short: 'L' },
  { key: 'tuesday', label: 'Martes', short: 'M' },
  { key: 'wednesday', label: 'Miércoles', short: 'X' },
  { key: 'thursday', label: 'Jueves', short: 'J' },
  { key: 'friday', label: 'Viernes', short: 'V' },
  { key: 'saturday', label: 'Sábado', short: 'S' },
  { key: 'sunday', label: 'Domingo', short: 'D' },
]

const timeSlotLabels = {
  morning: { label: 'Mañana', icon: 'fa-sun', hours: '8:00 - 12:00' },
  afternoon: { label: 'Tarde', icon: 'fa-sun', hours: '12:00 - 17:00' },
  evening: { label: 'Noche', icon: 'fa-moon', hours: '17:00 - 21:00' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [partner, setPartner] = useState<Partner | null>(null)

  useEffect(() => {
    const loadPartner = async () => {
      if (typeof window === 'undefined') return
      if (!auth || !firestore) {
        setError('Los servicios de autenticación o base de datos no están disponibles.')
        setLoading(false)
        return
      }

      const currentUser = auth.currentUser
      if (!currentUser) {
        router.push('/onboarding')
        return
      }

      try {
        const partnerRef = doc(collection(firestore, 'partners'), currentUser.uid)
        const snapshot = await getDoc(partnerRef)
        if (!snapshot.exists()) {
          router.push('/onboarding')
          return
        }
        const data = snapshot.data() as any
        setPartner({
          id: snapshot.id,
          fullName: data.fullName || data.name || currentUser.displayName || currentUser.email || 'Terapeuta',
          servicesOffered: data.servicesOffered || [],
          availability: data.availability || { ...defaultAvailability },
        })
      } catch (err) {
        console.error('Error loading partner profile:', err)
        setError('No se pudo cargar tu perfil de terapeuta.')
      } finally {
        setLoading(false)
      }
    }

    loadPartner()
  }, [router])

  const toggleService = (serviceId: string) => {
    if (!partner) return
    const exists = partner.servicesOffered.includes(serviceId)
    const next = exists
      ? partner.servicesOffered.filter((id) => id !== serviceId)
      : [...partner.servicesOffered, serviceId]
    setPartner({ ...partner, servicesOffered: next })
  }

  const toggleAvailability = (dayKey: keyof PartnerAvailability, slot: 'morning' | 'afternoon' | 'evening') => {
    if (!partner) return
    const nextAvailability: PartnerAvailability = {
      ...defaultAvailability,
      ...partner.availability,
    }
    nextAvailability[dayKey] = {
      ...nextAvailability[dayKey],
      [slot]: !nextAvailability[dayKey][slot],
    }
    setPartner({ ...partner, availability: nextAvailability })
  }

  const toggleDayAll = (dayKey: keyof PartnerAvailability) => {
    if (!partner) return
    const day = partner.availability[dayKey]
    const allSelected = day.morning && day.afternoon && day.evening
    const nextAvailability: PartnerAvailability = {
      ...defaultAvailability,
      ...partner.availability,
    }
    nextAvailability[dayKey] = {
      morning: !allSelected,
      afternoon: !allSelected,
      evening: !allSelected,
    }
    setPartner({ ...partner, availability: nextAvailability })
  }

  const handleSave = async () => {
    if (!partner || !firestore) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const partnerRef = doc(collection(firestore, 'partners'), partner.id)
      await setDoc(
        partnerRef,
        {
          servicesOffered: partner.servicesOffered,
          availability: partner.availability,
          updatedAt: new Date(),
        },
        { merge: true }
      )
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving dashboard changes:', err)
      setError('No se pudieron guardar los cambios. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !partner) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className={styles.dashboard}>
      <Box className={styles.header}>
        <Box>
          <Typography variant="h4" className={styles.title}>
            Hola, {partner.fullName}
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Gestiona los servicios que ofreces y tus horarios de disponibilidad
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className={styles.alert}>
          ¡Cambios guardados exitosamente!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Services Section */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} className={styles.card}>
            <Box className={styles.cardHeader}>
              <Box>
                <Typography variant="h6" className={styles.cardTitle}>
                  <i className="fa-solid fa-spa"></i>
                  Servicios que ofreces
                </Typography>
                <Typography variant="body2" className={styles.cardSubtitle}>
                  Selecciona los servicios que estás habilitado para ofrecer
                </Typography>
              </Box>
              <Box className={styles.serviceCount}>
                {partner.servicesOffered.length} / {services.length}
              </Box>
            </Box>
            <Box className={styles.servicesGrid}>
              {services.map((service) => {
                const selected = partner.servicesOffered.includes(service.id)
                return (
                  <Box
                    key={service.id}
                    className={`${styles.serviceCard} ${selected ? styles.serviceCardSelected : ''}`}
                    onClick={() => toggleService(service.id)}
                  >
                    <Box className={styles.serviceCardContent}>
                      <Box className={styles.serviceCheckbox}>
                        <i className={`fa-solid ${selected ? 'fa-check-circle' : 'fa-circle'}`}></i>
                      </Box>
                      <Box className={styles.serviceInfo}>
                        <Typography variant="body1" className={styles.serviceName}>
                          {service.name}
                        </Typography>
                        <Typography variant="caption" className={styles.servicePricing}>
                          {service.pricing[0]?.price} - {service.pricing[service.pricing.length - 1]?.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Availability Section */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} className={styles.card}>
            <Box className={styles.cardHeader}>
              <Box>
                <Typography variant="h6" className={styles.cardTitle}>
                  <i className="fa-solid fa-calendar-days"></i>
                  Horarios de disponibilidad
                </Typography>
                <Typography variant="body2" className={styles.cardSubtitle}>
                  Marca tus días y horarios disponibles
                </Typography>
              </Box>
            </Box>
            <Box className={styles.availabilityCalendar}>
              {dayLabels.map(({ key, label, short }) => {
                const day = partner.availability[key] || defaultAvailability[key]
                const hasAny = day.morning || day.afternoon || day.evening
                const allSelected = day.morning && day.afternoon && day.evening
                
                return (
                  <Box key={key} className={styles.dayRow}>
                    <Box className={styles.dayHeader}>
                      <Typography variant="body2" className={styles.dayLabel}>
                        {label}
                      </Typography>
                      <Tooltip title={allSelected ? 'Desmarcar todo' : 'Marcar todo'}>
                        <IconButton
                          size="small"
                          onClick={() => toggleDayAll(key)}
                          className={styles.dayToggle}
                        >
                          <i className={`fa-solid ${allSelected ? 'fa-check-square' : 'fa-square'}`}></i>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box className={styles.timeSlots}>
                      {(Object.keys(timeSlotLabels) as Array<'morning' | 'afternoon' | 'evening'>).map((slot) => {
                        const slotInfo = timeSlotLabels[slot]
                        const isSelected = day[slot]
                        return (
                          <Tooltip key={slot} title={slotInfo.hours}>
                            <Box
                              className={`${styles.timeSlot} ${isSelected ? styles.timeSlotSelected : ''}`}
                              onClick={() => toggleAvailability(key, slot)}
                            >
                              <i className={`fa-solid ${slotInfo.icon}`}></i>
                              <span>{slotInfo.label}</span>
                            </Box>
                          </Tooltip>
                        )
                      })}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box className={styles.actions}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          className={styles.saveButton}
          startIcon={saving ? <CircularProgress size={20} /> : <i className="fa-solid fa-floppy-disk"></i>}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </Box>
    </Box>
  )
}
