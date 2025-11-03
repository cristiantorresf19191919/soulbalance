'use client'

import styles from './AboutSection.module.css'

export function AboutSection() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          <h2 className={styles.sectionTitle}>
            Tu bienestar, nuestra pasión
          </h2>
          <p className={styles.aboutText}>
            En Soul Balance, creemos que cada persona merece momentos de paz y
            renovación. Ofrecemos experiencias de bienestar diseñadas para
            restaurar la armonía entre cuerpo, mente y alma. Con profesionales
            certificados y técnicas especializadas, llevamos el spa directamente
            a tu hogar.
          </p>
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fa-solid fa-house"></i>
              </div>
              <h3>Servicio a Domicilio</h3>
              <p>Domingo a Domingo, de 8 AM a 7 PM</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fa-solid fa-sparkles"></i>
              </div>
              <h3>Experiencias Personalizadas</h3>
              <p>Adaptadas a tus necesidades</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fa-solid fa-leaf"></i>
              </div>
              <h3>Productos Orgánicos</h3>
              <p>Aceites esenciales puros</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

