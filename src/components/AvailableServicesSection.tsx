'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { services } from '@/data/services'
import styles from './AvailableServicesSection.module.css'

interface PartnerData {
  id: string
  fullName?: string
  professionalTitle?: string
  primaryServiceCity?: string
  servicesOffered?: string[]
  availability?: {
    [key: string]: {
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }
}

interface AvailableServiceItem {
  partnerId: string
  partnerName: string
  professionalTitle?: string
  city?: string
  serviceId: string
}

function hasAnyAvailability(availability?: PartnerData['availability']) {
  if (!availability) return false
  return Object.values(availability).some(
    (day) => day?.morning || day?.afternoon || day?.evening
  )
}

export function AvailableServicesSection() {
  const [items, setItems] = useState<AvailableServiceItem[]>([])

  useEffect(() => {
    if (!firestore) return

    const partnersRef = collection(firestore, 'partners')

    const unsubscribe = onSnapshot(
      partnersRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const partners: PartnerData[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            fullName: data.fullName || data.name || data.displayName || '',
            professionalTitle: data.professionalTitle || '',
            primaryServiceCity: data.primaryServiceCity || '',
            servicesOffered: data.servicesOffered || [],
            availability: data.availability || {},
          }
        })

        const availableItems: AvailableServiceItem[] = []

        partners.forEach((partner) => {
          if (!partner.servicesOffered || partner.servicesOffered.length === 0) return
          if (!hasAnyAvailability(partner.availability)) return

          partner.servicesOffered.forEach((serviceId) => {
            const catalogService = services.find((s) => s.id === serviceId)
            if (!catalogService) return

            availableItems.push({
              partnerId: partner.id,
              partnerName: partner.fullName || 'Terapeuta',
              professionalTitle: partner.professionalTitle,
              city: partner.primaryServiceCity,
              serviceId,
            })
          })
        })

        setItems(availableItems)
      },
      (error) => {
        console.error('Error loading available services:', error)
        setItems([])
      }
    )

    return () => unsubscribe()
  }, [])

  if (items.length === 0) {
    return (
      <section className={styles.availableSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Servicios Disponibles</h2>
            <p className={styles.subtitle}>
              Pronto verás aquí los servicios ofrecidos por terapeutas certificados de nuestra red.
            </p>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fa-regular fa-calendar"></i>
            </div>
            <h3>No hay servicios activos en este momento</h3>
            <p>
              Cuando nuestros terapeutas habiliten su disponibilidad, podrás ver aquí quién está
              atendiendo cada tipo de masaje.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const itemsWithService = items.map((item) => {
    const service = services.find((s) => s.id === item.serviceId)
    return {
      ...item,
      serviceName: service?.name || item.serviceId,
      serviceDescription: service?.description || '',
      serviceImage: service?.image || '',
      pricing: service?.pricing || [],
    }
  })

  return (
    <section className={styles.availableSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Servicios Disponibles</h2>
          <p className={styles.subtitle}>
            Explora los servicios que actualmente están siendo ofrecidos por terapeutas
            certificados de nuestra red.
          </p>
        </div>

        <div className={styles.grid}>
          {itemsWithService.map((item) => (
            <article key={`${item.partnerId}-${item.serviceId}`} className={styles.card}>
              {item.serviceImage && (
                <div
                  className={styles.image}
                  style={{ backgroundImage: `url('${item.serviceImage}')` }}
                >
                  <div className={styles.badge}>Disponible</div>
                </div>
              )}

              <div className={styles.content}>
                <h3 className={styles.serviceName}>{item.serviceName}</h3>
                {item.serviceDescription && (
                  <p className={styles.description}>{item.serviceDescription}</p>
                )}

                <div className={styles.meta}>
                  <div className={styles.therapist}>
                    <i className="fa-solid fa-user-nurse"></i>
                    <div>
                      <span className={styles.therapistName}>{item.partnerName}</span>
                      {item.professionalTitle && (
                        <span className={styles.therapistTitle}>{item.professionalTitle}</span>
                      )}
                    </div>
                  </div>
                  {item.city && (
                    <div className={styles.city}>
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{item.city}</span>
                    </div>
                  )}
                </div>

                {item.pricing.length > 0 && (
                  <div className={styles.pricing}>
                    {item.pricing.slice(0, 2).map((p) => (
                      <div key={p.duration} className={styles.priceTag}>
                        <span>{p.duration}</span>
                        <strong>{p.price}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


