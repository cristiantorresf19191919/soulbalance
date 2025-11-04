'use client'

import styles from './LeadModal.module.css'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  serviceName?: string
  message: string
  subject?: string
  createdAt: Date
  // Booking fields
  bookingDate?: Date | any
  duration?: string
  price?: string
}

interface LeadModalProps {
  lead: Lead
  onClose: () => void
  onDelete: (leadId: string, leadName: string) => void
}

export function LeadModal({ lead, onClose, onDelete }: LeadModalProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatBookingDate = (date: Date | any) => {
    if (!date) return 'No especificada'
    const bookingDate = date instanceof Date ? date : new Date(date)
    return bookingDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Detalle del Lead</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.leadDetail}>
            <div className={styles.detailSection}>
              <h3>Información Personal</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nombre:</span>
                  <span className={styles.detailValue}>{lead.name || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>
                    <a href={`mailto:${lead.email}`}>{lead.email || 'N/A'}</a>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Teléfono:</span>
                  <span className={styles.detailValue}>
                    <a href={`tel:${lead.phone}`}>{lead.phone || 'N/A'}</a>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha:</span>
                  <span className={styles.detailValue}>
                    {formatDate(lead.createdAt)} {formatTime(lead.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Servicio de Interés</h3>
              <div className={styles.serviceDetail}>
                <span className={`${styles.serviceBadge} ${styles.large}`}>
                  {lead.serviceName || lead.service || 'No especificado'}
                </span>
              </div>
            </div>

            {(lead.bookingDate || lead.duration || lead.price) && (
              <div className={styles.detailSection}>
                <h3>Detalles de Reserva</h3>
                <div className={styles.detailGrid}>
                  {lead.bookingDate && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <i className="fa-solid fa-calendar-days"></i> Fecha de Reserva:
                      </span>
                      <span className={styles.detailValue}>
                        {formatBookingDate(lead.bookingDate)}
                      </span>
                    </div>
                  )}
                  {lead.duration && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <i className="fa-solid fa-clock"></i> Duración:
                      </span>
                      <span className={styles.detailValue}>{lead.duration}</span>
                    </div>
                  )}
                </div>
                {lead.price && (
                  <div className={styles.priceHighlight}>
                    <div className={styles.priceHighlightContent}>
                      <div className={styles.priceHighlightLabel}>
                        <i className="fa-solid fa-dollar-sign"></i>
                        <span>Precio Total</span>
                      </div>
                      <div className={styles.priceHighlightValue}>
                        {lead.price}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {lead.message && (
              <div className={styles.detailSection}>
                <h3>Mensaje</h3>
                <div className={styles.messageContent}>{lead.message}</div>
              </div>
            )}

            {lead.subject && (
              <div className={styles.detailSection}>
                <h3>Asunto</h3>
                <div className={styles.messageContent}>{lead.subject}</div>
              </div>
            )}

            <div className={styles.detailActions}>
              <a href={`tel:${lead.phone}`} className={`${styles.detailActionBtn} ${styles.call}`}>
                <i className="fa-solid fa-phone"></i> Llamar
              </a>
              <a href={`mailto:${lead.email}`} className={`${styles.detailActionBtn} ${styles.email}`}>
                <i className="fa-regular fa-envelope"></i> Enviar Email
              </a>
              <button
                className={`${styles.detailActionBtn} ${styles.delete}`}
                onClick={() => {
                  onDelete(lead.id, lead.name)
                }}
              >
                <i className="fa-solid fa-trash"></i> Eliminar Lead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

