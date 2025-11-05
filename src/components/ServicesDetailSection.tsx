'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { services } from '@/data/services'
import { serviceCategories } from '@/data/serviceCategories'
import { BookingModal } from './BookingModal'
import { MassageStepper } from './MassageStepper'
import styles from './ServicesDetailSection.module.css'

// Helper to get service data by ID
function getServiceById(serviceId: string) {
  return services.find(s => s.id === serviceId)
}

export function ServicesDetailSection() {
  const router = useRouter()
  const [stepperOpen, setStepperOpen] = useState(false)
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

  // Filter out categories that don't have services in the services array
  const categoriesWithServices = serviceCategories
    .map(category => ({
      ...category,
      services: category.services
        .map(s => ({ ...s, serviceData: getServiceById(s.value) }))
        .filter(s => s.serviceData) // Only include services that exist in services.ts
    }))
    .filter(category => category.services.length > 0)

  const handleCardClick = (serviceId: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on pricing or reserve button
    const target = e.target as HTMLElement
    const clickedElement = target.closest('[class*="priceItem"], [class*="reserveButton"]')
    if (clickedElement) {
      return
    }
    router.push(`/servicios/${serviceId}`)
  }

  const handleReserveClick = (serviceId: string, serviceName: string, serviceImage: string, pricing: Array<{ duration: string; price: string }>, selectedDuration?: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
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

  return (
    <section className={styles.servicesDetailSection}>
      <div className={styles.container}>
        <div className={styles.recommendationBanner}>
          <div className={styles.recommendationBannerContent}>
            <div className={styles.recommendationBannerIcon}>
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <div className={styles.recommendationBannerText}>
              <h3 className={styles.recommendationBannerTitle}>¿No sabes qué masaje escoger?</h3>
              <p className={styles.recommendationBannerSubtitle}>
                Responde unas preguntas y te recomendaremos el masaje perfecto para ti
              </p>
            </div>
            <button
              className={styles.recommendationButton}
              onClick={() => setStepperOpen(true)}
            >
              <i className="fa-solid fa-sparkles"></i>
              Encontrar mi masaje ideal
            </button>
          </div>
        </div>

        {categoriesWithServices.map((category) => (
          <div key={category.id} className={styles.serviceCategory}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>
                {category.name}
              </h2>
              <div className={styles.categoryDivider}></div>
            </div>

            <div className={styles.servicesLayout}>
              {category.services.map((service) => {
                const serviceData = service.serviceData!
                return (
                  <div 
                    key={service.value} 
                    className={styles.serviceCardDetailed}
                    onClick={(e) => handleCardClick(service.value, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={styles.serviceImageDetailed}
                      style={{ backgroundImage: `url('${serviceData.image}')` }}
                    >
                      <div className={styles.serviceImageOverlay}>
                        <span className={styles.serviceBadge}>Disponible</span>
                      </div>
                    </div>
                    <div className={styles.serviceContentDetailed}>
                      <h3 className={styles.serviceTitleDetailed}>
                        {serviceData.name}
                      </h3>
                      <p className={styles.serviceDescriptionDetailed}>
                        {serviceData.description}
                      </p>
                      <div className={styles.servicePricingDetailed}>
                        {serviceData.pricing.map((price, idx) => (
                          <div 
                            key={idx} 
                            className={styles.priceItemDetailed}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReserveClick(service.value, serviceData.name, serviceData.image, serviceData.pricing, price.duration, e)
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <span>{price.duration}</span>
                            <strong>{price.price}</strong>
                          </div>
                        ))}
                      </div>
                      <button
                        className={styles.reserveButton}
                        id="reserve-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReserveClick(service.value, serviceData.name, serviceData.image, serviceData.pricing, undefined, e)
                        }}
                      >
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>Reservar</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        open={bookingModal.open}
        onClose={handleCloseModal}
        serviceId={bookingModal.serviceId}
        serviceName={bookingModal.serviceName}
        serviceImage={bookingModal.serviceImage}
        pricing={bookingModal.pricing}
        selectedDuration={bookingModal.selectedDuration}
      />

      <MassageStepper
        open={stepperOpen}
        onClose={() => setStepperOpen(false)}
      />
    </section>
  )
}

