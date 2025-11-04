'use client'

import { useState } from 'react'
import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { BookingForm } from './BookingForm'
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth={false}
      className={styles.dialog}
      PaperProps={{
        className: styles.dialogPaper
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none'
        }
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
              <i className={`fa-solid fa-sparkles ${styles.titleIcon}`}></i>
              <span>Reservar {serviceName}</span>
            </div>
          </DialogTitle>
          <IconButton
            onClick={onClose}
            className={styles.closeButton}
            aria-label="cerrar"
          >
            <Close />
          </IconButton>
        </div>

        <div className={styles.modalContentWrapper}>
          <div className={styles.modalContent}>
            <BookingForm
              serviceId={serviceId}
              serviceName={serviceName}
              pricing={pricing}
              selectedDuration={selectedDuration}
              onSuccess={onClose}
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}

