'use client'

import Link from 'next/link'
import Image from 'next/image'
import { services } from '@/data/services'
import styles from './ServicesGrid.module.css'

export function ServicesGrid() {
  return (
    <section id="servicios" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.servicesHeader}>
          <h2 className={styles.sectionTitle}>
            Masajes Relajantes y Terapéuticos
          </h2>
          <Link href="/servicios" className={styles.viewAllLink}>
            Ver todos <span style={{ fontSize: '1.2rem' }}>→</span>
          </Link>
        </div>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => {
            const isLast = index === services.length - 1
            const isSolo = (services.length % 3) === 1 && isLast
            return (
              <div 
                key={service.id} 
                className={`${styles.serviceCard} ${isSolo ? styles.soloCard : ''}`}
              >
                <div
                  className={styles.serviceImage}
                  style={{ backgroundImage: `url('${service.image}')` }}
                ></div>
                <div className={styles.serviceContent}>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className={styles.servicePricing}>
                    {service.pricing.map((price, idx) => (
                      <div key={idx} className={styles.priceItem}>
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
    </section>
  )
}

