'use client'

import { ContactForm } from './ContactForm'
import styles from './ContactSection.module.css'

export function ContactSection() {
  return (
    <section id="contacto" className={styles.contact}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          Hablemos de tu bienestar
        </h2>
        <p className={styles.contactIntro}>
          Estamos aquí para escucharte y crear la experiencia perfecta para ti.
          Cuéntanos qué necesitas y con gusto te ayudaremos a encontrar el
          servicio ideal.
        </p>

        <div className={styles.contactWrapper}>
          <ContactForm />

          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <i className="fa-solid fa-phone"></i>
              </div>
              <h4>Teléfono</h4>
              <p>Contáctanos directamente</p>
              <a href="tel:+573202632993">320 2632993</a>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <i className="fa-regular fa-envelope"></i>
              </div>
              <h4>Email</h4>
              <p>Escríbenos cuando quieras</p>
              <a href="mailto:balancecol2024@gmail.com">
                balancecol2024@gmail.com
              </a>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <i className="fa-regular fa-clock"></i>
              </div>
              <h4>Horarios</h4>
              <p>Estamos disponibles</p>
              <p>
                <strong>Domingo a Domingo<br />8:00 AM - 7:00 PM</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

