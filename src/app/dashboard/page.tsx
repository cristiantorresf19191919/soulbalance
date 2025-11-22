'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Chip,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, firestore } from '@/lib/firebase'
import { services } from '@/data/services'

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

const dayLabels: { key: keyof PartnerAvailability; label: string }[] = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
          // If no partner document yet, redirect to onboarding
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

  const handleSave = async () => {
    if (!partner || !firestore) return
    setSaving(true)
    setError(null)
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
    <Box sx={{ py: 6, px: { xs: 2, md: 6 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Hola, {partner.fullName}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Gestiona los servicios que ofreces y tus horarios de disponibilidad. Los clientes solo verán
        los servicios seleccionados y dentro de tus horarios activos.
      </Typography>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
              Servicios que ofreces
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Selecciona los servicios de nuestro catálogo que estás habilitado para ofrecer. Los
              precios y duraciones son definidos por SoulBalance y no pueden modificarse aquí.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {services.map((service) => {
                const selected = partner.servicesOffered.includes(service.id)
                return (
                  <Chip
                    key={service.id}
                    label={service.name}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    onClick={() => toggleService(service.id)}
                    sx={{ borderRadius: '999px' }}
                  />
                )
              })}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
              Horarios de disponibilidad
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Marca en qué días y franjas horarias estás disponible para atender servicios. Tus
              clientes solo podrán reservar en estas ventanas.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {dayLabels.map(({ key, label }) => {
                const day = partner.availability[key] || defaultAvailability[key]
                return (
                  <Box
                    key={key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 500 }}>
                      {label}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!day.morning}
                            onChange={() => toggleAvailability(key, 'morning')}
                            size="small"
                          />
                        }
                        label="Mañana"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!day.afternoon}
                            onChange={() => toggleAvailability(key, 'afternoon')}
                            size="small"
                          />
                        }
                        label="Tarde"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!day.evening}
                            onChange={() => toggleAvailability(key, 'evening')}
                            size="small"
                          />
                        }
                        label="Noche"
                      />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
          sx={{ borderRadius: 999, px: 4 }}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </Box>
    </Box>
  )
}


