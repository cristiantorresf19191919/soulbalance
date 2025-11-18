'use client'

import { useState } from 'react'
import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { BookingForm } from './BookingForm'
import { CorporateBookingForm } from './CorporateBookingForm'
import { ServiceTypeSelector } from './ServiceTypeSelector'
import { TherapistSelectionModal } from './TherapistSelectionModal'
import styles from './BookingModal.module.css'

interface Partner {
  id: string
  fullName: string
  professionalTitle?: string
  profilePictureUrl?: string
  availability: {
    [key: string]: {
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }
  primaryServiceCity?: string
  aboutMe?: string
}

interface BookingModalProps {
  open: boolean
  onClose: () => void
  serviceId: string
  serviceName: string
  serviceImage: string
  pricing: Array<{ duration: string; price: string }>
  selectedDuration?: string
}

export function BookingModal({ 
  open, 
  onClose, 
  serviceId, 
  serviceName, 
  serviceImage,
  pricing,
  selectedDuration
}: BookingModalProps) {
  const [serviceType, setServiceType] = useState<'persona' | 'empresa' | null>(null)
  const [selectedTherapist, setSelectedTherapist] = useState<{
    therapist: Partner
    date: Date
    timeSlot: 'morning' | 'afternoon' | 'evening'
  } | null>(null)

  const handleTypeSelect = (type: 'persona' | 'empresa') => {
    setServiceType(type)
  }

  const handleTherapistSelect = (
    therapist: Partner, 
    date: Date, 
    timeSlot: 'morning' | 'afternoon' | 'evening'
  ) => {
    setSelectedTherapist({ therapist, date, timeSlot })
    setServiceType('persona')
  }

  const handleClose = () => {
    setServiceType(null)
    setSelectedTherapist(null)
    onClose()
  }

  const handleSuccess = () => {
    setServiceType(null)
    setSelectedTherapist(null)
    onClose()
  }

  const handleBackToTherapistSelection = () => {
    setSelectedTherapist(null)
    setServiceType(null)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth={false}
      className={styles.dialog}
      PaperProps={{
        className: styles.dialogPaper
      }}
      BackdropProps={{
        className: styles.backdrop
      }}
    >
      <div className={styles.modalWrapper}>
        {serviceImage && (
          <div 
            className={styles.serviceImageBackground}
            style={{ backgroundImage: `url('${serviceImage}')` }}
          />
        )}
        
        <div className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>
            <div className={styles.titleContent}>
              <i className={`fa-solid fa-leaf ${styles.titleIcon}`}></i>
              <span>
                {serviceType === null && !selectedTherapist
                  ? 'Consultar disponibilidad' 
                  : serviceType === 'empresa'
                    ? 'Solicitud Corporativa'
                    : selectedTherapist
                      ? `Reservar ${serviceName}`
                      : `Consultar ${serviceName}`}
              </span>
            </div>
          </DialogTitle>
          <IconButton
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="cerrar"
          >
            <Close />
          </IconButton>
        </div>

        <div className={styles.modalContentWrapper}>
          <div className={styles.modalContent}>
            {serviceType === null && !selectedTherapist ? (
              <ServiceTypeSelector
                onSelect={handleTypeSelect}
                title="¿Para quién es este servicio?"
                subtitle="Selecciona el tipo de servicio que necesitas"
              />
            ) : serviceType === 'empresa' ? (
              <CorporateBookingForm
                serviceId={serviceId}
                serviceName={serviceName}
                onSuccess={handleSuccess}
              />
            ) : selectedTherapist ? (
              <BookingForm
                serviceId={serviceId}
                serviceName={serviceName}
                pricing={pricing}
                selectedDuration={selectedDuration}
                selectedTherapist={selectedTherapist.therapist}
                selectedDate={selectedTherapist.date}
                selectedTimeSlot={selectedTherapist.timeSlot}
                onBack={handleBackToTherapistSelection}
                onSuccess={handleSuccess}
              />
            ) : serviceType === 'persona' ? (
              <TherapistSelectionModal
                serviceId={serviceId}
                serviceName={serviceName}
                onSelect={handleTherapistSelect}
                onClose={handleClose}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

