'use client'

import { services } from '@/data/services'
import { serviceCategories } from '@/data/serviceCategories'
import styles from './ServicesDetailSection.module.css'

// Helper to get service data by ID
function getServiceById(serviceId: string) {
  return services.find(s => s.id === serviceId)
}

export function ServicesDetailSection() {
  // Filter out categories that don't have services in the services array
  const categoriesWithServices = serviceCategories
    .map(category => ({
      ...category,
      services: category.services
        .map(s => ({ ...s, serviceData: getServiceById(s.value) }))
        .filter(s => s.serviceData) // Only include services that exist in services.ts
    }))
    .filter(category => category.services.length > 0)

  return (
    <section className={styles.servicesDetailSection}>
      <div className={styles.container}>
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
                  <div key={service.value} className={styles.serviceCardDetailed}>
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
                          <div key={idx} className={styles.priceItemDetailed}>
                            <span>{price.duration}</span>
                            <strong>{price.price}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

