'use client'

import { useState } from 'react'
import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { BookingForm } from './BookingForm'
import { CorporateBookingForm } from './CorporateBookingForm'
import { ServiceTypeSelector } from './ServiceTypeSelector'
import styles from './BookingModal.module.css'

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

  const handleTypeSelect = (type: 'persona' | 'empresa') => {
    setServiceType(type)
  }

  const handleClose = () => {
    setServiceType(null)
    onClose()
  }

  const handleSuccess = () => {
    setServiceType(null)
    onClose()
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
                {serviceType === null 
                  ? 'Consultar disponibilidad' 
                  : serviceType === 'empresa'
                    ? 'Solicitud Corporativa'
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
            {serviceType === null ? (
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
            ) : (
              <BookingForm
                serviceId={serviceId}
                serviceName={serviceName}
                pricing={pricing}
                selectedDuration={selectedDuration}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

