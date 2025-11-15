'use client'

import styles from './PremiumExperiences.module.css'

export function PremiumExperiences() {
  return (
    <section className={styles.premiumSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>
          Experiencias Premium
        </h2>
        <div className={styles.premiumGrid}>
          <div className={`${styles.premiumCard} ${styles.premiumCardDark}`}>
            <h3>Masaje en Pareja – Ritual Romántico</h3>
            <p>
              Un ritual íntimo diseñado para fortalecer la conexión y la
              complicidad. Disfruten juntos de un masaje relajante simultáneo en
              un ambiente exclusivo con aromaterapia personalizada, música suave
              y cava.
            </p>
            <div className={styles.premiumPricing}>
              <p className={styles.pricingLabel}>Duración y Precio por Pareja</p>
              <div className={styles.priceItemLight}>
                <span>60 min</span> <strong>$250.000</strong>
              </div>
              <div className={styles.priceItemLight}>
                <span>90 min</span> <strong>$330.000</strong>
              </div>
              <div className={styles.priceItemLight}>
                <span>120 min</span> <strong>$400.000</strong>
              </div>
            </div>
          </div>
          <div className={`${styles.premiumCard} ${styles.premiumCardDark}`}>
            <h3>Masaje Aura Spa – Cuatro Elementos</h3>
            <p>
              Nuestro masaje insignia, uniendo técnicas profundas y energéticas,
              inspirado en los cuatro elementos (Tierra, Agua, Fuego y Aire).
              Utiliza aceites esenciales orgánicos puros seleccionados para cada
              etapa. Restaura el equilibrio integral del ser, conectando lo
              físico, emocional y energético.
            </p>
            <div className={styles.premiumPricing}>
              <div className={`${styles.priceItemLight} ${styles.priceSpecial}`}>
                <span>90 min</span> <strong>$250.000</strong>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.homeServiceCard}>
          <div className={styles.homeIcon}>
            <i className="fa-solid fa-house"></i>
          </div>
          <div className={styles.homeContent}>
            <h3>Experiencia a Domicilio</h3>
            <p>
              Todos nuestros servicios están diseñados para su máxima
              <strong> conveniencia y personalización</strong>. Llevamos la
              experiencia de bienestar directamente a la comodidad y privacidad
              de su hogar, con disponibilidad de
              <strong> Domingo a Domingo, de 8 AM a 7 PM</strong>, adaptando cada
              sesión
              <strong> rigurosamente a sus necesidades y preferencias</strong>.
            </p>
          </div>
        </div>
        <p className={styles.disclaimer}>
          Debido a la naturaleza exclusiva de estas experiencias, solicitamos
          reservar con al menos 48 horas de anticipación para garantizar la
          preparación perfecta.
        </p>
      </div>
    </section>
  )
}

