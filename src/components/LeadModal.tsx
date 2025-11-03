'use client'

import styles from './LeadModal.module.css'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  subject?: string
  createdAt: Date
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

  const getServiceName = (serviceKey: string) => {
    const services: Record<string, string> = {
      relajante: 'Masaje Relajante',
      descontracturante: 'Masaje Descontracturante',
      piedras: 'Masaje con Piedras Volcánicas',
      prenatal: 'Masaje Prenatal',
      '4manos': 'Masaje a 4 Manos',
      piernas: 'Masaje Piernas Cansadas',
      pareja: 'Masaje en Pareja',
      soulbalance: 'Masaje Soul Balance - Cuatro Elementos',
      otro: 'Otro servicio'
    }
    return services[serviceKey] || serviceKey || 'No especificado'
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
                  {getServiceName(lead.service)}
                </span>
              </div>
            </div>

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

