'use client'

import styles from './CorporateHero.module.css'

export function CorporateHero() {
  return (
    <section className={styles.corporateHero}>
      <div className={styles.container}>
        <div className={styles.corporateHeroContent}>
          <div className={styles.corporateHeroIcon}>
            <i className="fa-solid fa-building"></i>
          </div>
          <h1>Bienestar Empresarial</h1>
          <p>
            Transforme el ambiente laboral de su empresa con nuestros programas
            integrales de bienestar diseñados para maximizar la productividad,
            reducir el estrés y fomentar un equipo más saludable y feliz.
          </p>
        </div>
      </div>
    </section>
  )
}

