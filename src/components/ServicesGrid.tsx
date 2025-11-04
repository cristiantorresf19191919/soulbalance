'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { services } from '@/data/services'
import { serviceCategories } from '@/data/serviceCategories'
import { BookingModal } from './BookingModal'
import styles from './ServicesGrid.module.css'

// Helper to get service data by ID
function getServiceById(serviceId: string) {
  return services.find(s => s.id === serviceId)
}

export function ServicesGrid() {
  const router = useRouter()
  const [expandedCategory, setExpandedCategory] = useState<string | null>('relajantes')
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

  const handleAccordionChange = (categoryId: string) => {
    setExpandedCategory(prev => 
      prev === categoryId ? null : categoryId
    )
  }

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

  // Filter categories that have services in the services array
  const categoriesWithServices = serviceCategories
    .map(category => ({
      ...category,
      services: category.services
        .map(s => ({ ...s, serviceData: getServiceById(s.value) }))
        .filter(s => s.serviceData)
    }))
    .filter(category => category.services.length > 0)

  return (
    <section id="servicios" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.servicesHeader}>
          <h2 className={styles.sectionTitle}>
            Nuestros Servicios
          </h2>
          <Link href="/servicios" className={styles.viewAllLink}>
            Ver todos <span style={{ fontSize: '1.2rem' }}>→</span>
          </Link>
        </div>

        <div className={styles.categoriesContainer}>
          {categoriesWithServices.map((category) => {
            const isExpanded = expandedCategory === category.id
            return (
              <Accordion
                key={category.id}
                expanded={isExpanded}
                onChange={() => handleAccordionChange(category.id)}
                className={styles.categoryAccordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore className={styles.expandIcon} />}
                  className={styles.categorySummary}
                  aria-controls={`${category.id}-content`}
                  id={`${category.id}-header`}
                >
                  <div className={styles.categoryHeaderContent}>
                    {category.icon && (
                      <i className={`fa-solid ${category.icon} ${styles.categoryIcon}`}></i>
                    )}
                    <h3 className={styles.categoryTitle}>{category.name}</h3>
                  </div>
                </AccordionSummary>
                <AccordionDetails className={styles.categoryDetails}>
                  <div className={styles.servicesGrid}>
                    {category.services.map((service) => {
                      const serviceData = service.serviceData!
                      return (
                        <div 
                          key={service.value} 
                          className={styles.serviceCard}
                          onClick={(e) => handleCardClick(service.value, e)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={styles.serviceImage}
                            style={{ backgroundImage: `url('${serviceData.image}')` }}
                          ></div>
                          <div className={styles.serviceContent}>
                            <h4 className={styles.serviceTitle}>{serviceData.name}</h4>
                            <p className={styles.serviceDescription}>
                              {serviceData.description}
                            </p>
                            <div className={styles.servicePricing}>
                              {serviceData.pricing.map((price, idx) => (
                                <div 
                                  key={idx} 
                                  className={styles.priceItem}
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
                </AccordionDetails>
              </Accordion>
            )
          })}
        </div>
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
    </section>
  )
}

