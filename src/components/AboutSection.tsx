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
            En Aura Spa, ofrecemos servicios terapéuticos profesionales diseñados
            para tu bienestar. Con terapeutas certificados y técnicas especializadas,
            llevamos nuestros servicios directamente a tu hogar. Reserva tu cita
            y disfruta de una experiencia personalizada.
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
                <i className="fa-solid fa-wand-magic-sparkles"></i>
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

