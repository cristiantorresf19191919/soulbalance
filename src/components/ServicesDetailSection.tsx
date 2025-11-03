'use client'

import { services } from '@/data/services'
import styles from './ServicesDetailSection.module.css'

export function ServicesDetailSection() {
  return (
    <section className={styles.servicesDetailSection}>
      <div className={styles.container}>
        <div className={styles.serviceCategory}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Todos Nuestros Servicios</h2>
            <p className={styles.categoryDescription}>
              Cada servicio está diseñado para restaurar el equilibrio y promover tu bienestar integral
            </p>
          </div>

          <div className={styles.servicesLayout}>
            {services.map((service) => (
              <div key={service.id} className={styles.serviceCardDetailed}>
                <div
                  className={styles.serviceImageDetailed}
                  style={{ backgroundImage: `url('${service.image}')` }}
                >
                  <div className={styles.serviceImageOverlay}>
                    <span className={styles.serviceBadge}>Disponible</span>
                  </div>
                </div>
                <div className={styles.serviceContentDetailed}>
                  <h3 className={styles.serviceTitleDetailed}>{service.name}</h3>
                  <p className={styles.serviceDescriptionDetailed}>
                    {service.description}
                  </p>
                  <div className={styles.servicePricingDetailed}>
                    <div className={styles.pricingTitle}>Precios</div>
                    {service.pricing.map((price, idx) => (
                      <div key={idx} className={styles.priceItemDetailed}>
                        <span>{price.duration}</span>
                        <strong>{price.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

