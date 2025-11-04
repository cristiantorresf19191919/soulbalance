'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BookingModal } from '@/components/BookingModal'
import { services } from '@/data/services'
import type { Service } from '@/data/services'
import styles from './page.module.css'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  
  const [service, setService] = useState<Service | null>(null)
  const [bookingModal, setBookingModal] = useState<{
    open: boolean
    serviceId: string
    serviceName: string
    serviceImage: string
    pricing: Array<{ duration: string; price: string }>
    selectedDuration?: string
  }>({
    open: false,
    serviceId: '',
    serviceName: '',
    serviceImage: '',
    pricing: [],
    selectedDuration: undefined
  })

  useEffect(() => {
    if (slug) {
      const foundService = services.find(s => s.id === slug)
      if (foundService) {
        setService(foundService)
      } else {
        // Service not found, redirect to services page
        router.push('/servicios')
      }
    }
  }, [slug, router])

  const handleReserveClick = (
    serviceId: string, 
    serviceName: string, 
    serviceImage: string, 
    pricing: Array<{ duration: string; price: string }>, 
    selectedDuration?: string
  ) => {
    setBookingModal({
      open: true,
      serviceId,
      serviceName,
      serviceImage,
      pricing,
      selectedDuration
    })
  }

  const handleCloseModal = () => {
    setBookingModal({
      open: false,
      serviceId: '',
      serviceName: '',
      serviceImage: '',
      pricing: [],
      selectedDuration: undefined
    })
  }

  if (!service) {
    return (
      <>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando servicio...</p>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </>
    )
  }

  return (
    <>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div className={styles.serviceDetailPage}>
          <div className={styles.container}>
            <Breadcrumb 
              sticky={true}
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Servicios', href: '/servicios' },
                { label: service.name }
              ]} 
            />
            
            <div className={styles.serviceDetailCard}>
              <div 
                className={styles.serviceImage}
                style={{ backgroundImage: `url('${service.image}')` }}
              >
                <div className={styles.imageOverlay}>
                  <span className={styles.serviceBadge}>Disponible</span>
                </div>
              </div>
              
              <div className={styles.serviceContent}>
                <h1 className={styles.serviceTitle}>{service.name}</h1>
                
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                
                <div className={styles.pricingSection}>
                  <h2 className={styles.pricingTitle}>Precios y Duración</h2>
                  <div className={styles.pricingGrid}>
                    {service.pricing.map((price, idx) => (
                      <div 
                        key={idx} 
                        className={styles.priceCard}
                        onClick={() => handleReserveClick(
                          service.id, 
                          service.name, 
                          service.image, 
                          service.pricing, 
                          price.duration
                        )}
                      >
                        <div className={styles.priceDuration}>
                          <i className="fa-solid fa-clock"></i>
                          <span>{price.duration}</span>
                        </div>
                        <div className={styles.priceAmount}>
                          {price.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  className={styles.reserveButton}
                  onClick={() => handleReserveClick(
                    service.id, 
                    service.name, 
                    service.image, 
                    service.pricing
                  )}
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Reservar Ahora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BookingModal
        open={bookingModal.open}
        onClose={handleCloseModal}
        serviceId={bookingModal.serviceId}
        serviceName={bookingModal.serviceName}
        serviceImage={bookingModal.serviceImage}
        pricing={bookingModal.pricing}
        selectedDuration={bookingModal.selectedDuration}
      />
      
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

