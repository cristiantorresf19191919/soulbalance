'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button,
  Avatar,
  Chip
} from '@mui/material'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { DatePickerModal } from './DatePickerModal'
import styles from './TherapistSelectionModal.module.css'

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
  professionalTitle?: string
  profilePictureUrl?: string
  availability: PartnerAvailability
  primaryServiceCity?: string
  aboutMe?: string
}

interface TherapistSelectionModalProps {
  serviceId: string
  serviceName: string
  onSelect: (therapist: Partner, selectedDate: Date, timeSlot: 'morning' | 'afternoon' | 'evening') => void
  onClose: () => void
}

export function TherapistSelectionModal({
  serviceId,
  serviceName,
  onSelect,
  onClose
}: TherapistSelectionModalProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTherapist, setSelectedTherapist] = useState<Partner | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | null>(null)
  const [availableTherapists, setAvailableTherapists] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)

  // Helper: map JS Date weekday to partner availability key
  const getDayKey = (date: Date) => {
    const day = date.getDay()
    const mapping: { [key: number]: string } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    }
    return mapping[day]
  }

  const getAvailableTimeSlots = (availability: PartnerAvailability, date: Date) => {
    if (!date) return []
    const key = getDayKey(date)
    const day = availability[key]
    if (!day) return []
    
    const slots: Array<'morning' | 'afternoon' | 'evening'> = []
    if (day.morning) slots.push('morning')
    if (day.afternoon) slots.push('afternoon')
    if (day.evening) slots.push('evening')
    return slots
  }

  const isAvailableOnDate = (availability: PartnerAvailability | undefined, date: Date | null) => {
    if (!availability || !date) return false
    const key = getDayKey(date)
    const day = availability[key]
    if (!day) return false
    return day.morning || day.afternoon || day.evening
  }

  // Load therapists that offer this service
  useEffect(() => {
    const fetchTherapists = async () => {
      if (!firestore || !serviceId) {
        setAvailableTherapists([])
        return
      }

      setLoading(true)
      try {
        const partnersRef = collection(firestore, 'partners')
        const q = query(partnersRef, where('servicesOffered', 'array-contains', serviceId))
        const snapshot = await getDocs(q)

        const therapists: Partner[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any
          return {
            id: doc.id,
            fullName: data.fullName || data.name || data.displayName || data.email || 'Terapeuta',
            professionalTitle: data.professionalTitle || '',
            profilePictureUrl: data.profilePictureUrl || '',
            availability: (data.availability || {}) as PartnerAvailability,
            primaryServiceCity: data.primaryServiceCity || '',
            aboutMe: data.aboutMe || ''
          }
        })

        setAvailableTherapists(therapists)
      } catch (error) {
        console.error('Error loading therapists:', error)
        setAvailableTherapists([])
      } finally {
        setLoading(false)
      }
    }

    fetchTherapists()
  }, [serviceId])

  // Filter therapists by selected date
  const therapistsForDate = selectedDate
    ? availableTherapists.filter((t) => isAvailableOnDate(t.availability, selectedDate))
    : []

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date)
    setSelectedTherapist(null)
    setSelectedTimeSlot(null)
    setIsDatePickerOpen(false)
  }

  const handleTherapistSelect = (therapist: Partner) => {
    setSelectedTherapist(therapist)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (slot: 'morning' | 'afternoon' | 'evening') => {
    setSelectedTimeSlot(slot)
  }

  const handleContinue = () => {
    if (selectedTherapist && selectedDate && selectedTimeSlot) {
      onSelect(selectedTherapist, selectedDate, selectedTimeSlot)
    }
  }

  const isWeekday = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)

  const timeSlotLabels = {
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Noche'
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.title}>
          Selecciona tu terapeuta y horario
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Elige una fecha para ver los terapeutas disponibles para {serviceName}
        </Typography>
      </Box>

      <Box className={styles.content}>
        {/* Date Selection */}
        <Box className={styles.section}>
          <label className={styles.label}>
            <i className="fa-solid fa-calendar-days"></i>
            Selecciona la fecha
          </label>
          <div className={styles.datePickerWrapper}>
            <input
              type="text"
              readOnly
              value={selectedDate ? selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : ''}
              placeholder="Selecciona una fecha"
              className={styles.datePicker}
              onClick={() => setIsDatePickerOpen(true)}
            />
            <DatePickerModal
              open={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              selectedDate={selectedDate}
              onChange={handleDateSelect}
              minDate={minDate}
              filterDate={isWeekday}
            />
          </div>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box className={styles.loadingContainer}>
            <CircularProgress size={40} />
            <Typography variant="body2" className={styles.loadingText}>
              Cargando terapeutas...
            </Typography>
          </Box>
        )}

        {/* No Date Selected */}
        {!loading && !selectedDate && (
          <Box className={styles.emptyState}>
            <i className="fa-solid fa-calendar-check"></i>
            <Typography variant="body1" className={styles.emptyText}>
              Selecciona una fecha para ver los terapeutas disponibles
            </Typography>
          </Box>
        )}

        {/* No Therapists Available */}
        {!loading && selectedDate && therapistsForDate.length === 0 && (
          <Box className={styles.emptyState}>
            <i className="fa-solid fa-user-slash"></i>
            <Typography variant="body1" className={styles.emptyText}>
              No hay terapeutas disponibles para este servicio en la fecha seleccionada
            </Typography>
            <Typography variant="body2" className={styles.emptySubtext}>
              Prueba con otra fecha
            </Typography>
          </Box>
        )}

        {/* Therapists List */}
        {!loading && selectedDate && therapistsForDate.length > 0 && (
          <Box className={styles.therapistsSection}>
            <Typography variant="subtitle2" className={styles.sectionTitle}>
              Terapeutas disponibles ({therapistsForDate.length})
            </Typography>
            <Box className={styles.therapistsList}>
              {therapistsForDate.map((therapist) => {
                const availableSlots = getAvailableTimeSlots(therapist.availability, selectedDate)
                const isSelected = selectedTherapist?.id === therapist.id
                
                return (
                  <Box
                    key={therapist.id}
                    className={`${styles.therapistCard} ${isSelected ? styles.therapistCardSelected : ''}`}
                    onClick={() => handleTherapistSelect(therapist)}
                  >
                    <Box className={styles.therapistHeader}>
                      <Avatar
                        src={therapist.profilePictureUrl}
                        className={styles.avatar}
                      >
                        {therapist.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box className={styles.therapistInfo}>
                        <Typography variant="subtitle1" className={styles.therapistName}>
                          {therapist.fullName}
                        </Typography>
                        {therapist.professionalTitle && (
                          <Typography variant="caption" className={styles.therapistTitle}>
                            {therapist.professionalTitle}
                          </Typography>
                        )}
                        {therapist.primaryServiceCity && (
                          <Typography variant="caption" className={styles.therapistCity}>
                            <i className="fa-solid fa-location-dot"></i>
                            {therapist.primaryServiceCity}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {isSelected && (
                      <Box className={styles.timeSlotsSection}>
                        <Typography variant="caption" className={styles.timeSlotsLabel}>
                          Selecciona un horario:
                        </Typography>
                        <Box className={styles.timeSlots}>
                          {availableSlots.map((slot) => (
                            <Chip
                              key={slot}
                              label={timeSlotLabels[slot]}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTimeSlotSelect(slot)
                              }}
                              className={`${styles.timeSlotChip} ${
                                selectedTimeSlot === slot ? styles.timeSlotChipSelected : ''
                              }`}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box className={styles.actions}>
        <Button
          variant="outlined"
          onClick={onClose}
          className={styles.cancelButton}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!selectedTherapist || !selectedDate || !selectedTimeSlot}
          className={styles.continueButton}
        >
          Continuar
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </Box>
    </Box>
  )
}

