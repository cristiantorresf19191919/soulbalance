'use client'

import styles from './ServicesHero.module.css'

export function ServicesHero() {
  return (
    <section className={styles.servicesHero}>
      <div className={styles.container}>
        <div className={styles.servicesHeroContent}>
          <h1 className={styles.servicesTitle}>
            Masajes Relajantes y Terapéuticos
          </h1>
          <p className={styles.servicesSubtitle}>
            Descubre todos nuestros servicios de masajes terapéuticos y relajantes.
            Desde masajes clásicos hasta terapias especializadas con técnicas ancestrales.
          </p>
        </div>
      </div>
    </section>
  )
}

