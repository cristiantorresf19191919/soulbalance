'use client'

import Link from 'next/link'
import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'
import styles from './CorporateDetailSection.module.css'

const processContainerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.12,
    },
  },
}

const processStepVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 6, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function CorporateDetailSection() {
  const processRef = useRef<HTMLDivElement | null>(null)
  const processInView = useInView(processRef, {
    margin: '-20% 0px -20% 0px',
    once: true,
  })

  return (
    <section className={styles.corporateDetailSection}>
      <div className={styles.container}>
        <div className={styles.highlightBox}>
          <h3>Nuestro Enfoque Holístico</h3>
          <p>
            Nuestros programas están diseñados para promover la salud física, mental y emocional de sus colaboradores.
            Ofrecemos un enfoque <strong>holístico</strong>, respaldado por la formación dual en
            <strong> Masaje Terapéutico y Psicología</strong>, lo que nos permite crear jornadas de bienestar que
            transforman el ambiente de trabajo, fomentando la armonía, reduciendo el estrés y disparando la productividad.
          </p>
        </div>

        <div className={styles.corporateSubtitle}>
          Paquetes Corporativos
        </div>
        <p className={styles.subtitleDescription}>
          Opciones flexibles y adaptables a las necesidades específicas y ritmo de cada empresa
        </p>

        <div className={styles.corporatePackages}>
          <div className={styles.corporatePackageCard}>
            <div className={styles.packageIcon}>
              <i className="fa-regular fa-clock"></i>
            </div>
            <h3>Jornada de ½ Día</h3>
            <p>
              Perfecta para integrar el bienestar en la rutina sin interrumpir la jornada. Incluye actividades
              energizantes y de relajación concentradas en un bloque de 3 o 4 horas.
            </p>
            <div className={styles.packageBadge}>
              <span>3-4 Horas</span>
            </div>
          </div>

          <div className={styles.corporatePackageCard}>
            <div className={styles.packageIcon}>
              <i className="fa-solid fa-sun"></i>
            </div>
            <h3>Jornada Full Day</h3>
            <p>
              Una inmersión completa en el bienestar. Este programa de día entero maximiza el impacto en la salud
              y el ánimo, logrando una desconexión y revitalización total del equipo.
            </p>
            <div className={styles.packageBadge}>
              <span>Día Completo</span>
            </div>
          </div>

          <div className={styles.corporatePackageCard}>
            <div className={styles.packageIcon}>
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3>Servicio por Horas</h3>
            <p>
              Máxima flexibilidad para cubrir necesidades puntuales. Contrata sesiones específicas
              (ej: masajes express, pausas activas) adaptadas exactamente al horario y presupuesto de su compañía.
            </p>
            <div className={styles.packageBadge}>
              <span>Por Horas</span>
            </div>
          </div>
        </div>

        <div className={styles.highlightBox} style={{ marginTop: 'calc(var(--spacing-lg) * 2)' }}>
          <h3 style={{ textAlign: 'center' }}>Nuestro Enfoque Integral</h3>
          <div className={styles.approachGrid}>
            <div className={styles.approachCard}>
              <div className={styles.approachCardIcon}>
                <i className="fa-solid fa-brain"></i>
              </div>
              <h4>Bienestar Mental</h4>
              <p>Técnicas de mindfulness y gestión del estrés para mejorar la concentración y reducir la ansiedad.</p>
            </div>
            <div className={styles.approachCard}>
              <div className={styles.approachCardIcon}>
                <i className="fa-solid fa-hand-sparkles"></i>
              </div>
              <h4>Bienestar Físico</h4>
              <p>Masajes terapéuticos y sesiones de relajación para aliviar tensiones y dolores musculares.</p>
            </div>
            <div className={styles.approachCard}>
              <div className={styles.approachCardIcon}>
                <i className="fa-solid fa-heart"></i>
              </div>
              <h4>Bienestar Emocional</h4>
              <p>Espacios de contención y apoyo emocional para promover un clima laboral más positivo.</p>
            </div>
          </div>
        </div>

        <div className={styles.corporateValue}>
          <div className={styles.valueIcon}>
            <i className="fa-solid fa-check"></i>
          </div>
          <div className={styles.valueContent}>
            <h3>Maximice el valor para su empresa:</h3>
            <p>
              Nuestros servicios cumplen con altos estándares de calidad y estrictos protocolos de bioseguridad.
              Además, pueden generar oportunidades de beneficios fiscales y fortalecer su estrategia de
              Responsabilidad Social Empresarial (RSE), alineándose con las normativas vigentes.
            </p>
          </div>
        </div>

        <div className={styles.highlightBox}>
          <h3>Beneficios Clave</h3>
          <ul>
            <li>Reducción significativa del estrés laboral y la ansiedad</li>
            <li>Mejora en la productividad y el rendimiento del equipo</li>
            <li>Disminución del ausentismo laboral y las bajas por enfermedad</li>
            <li>Fortalecimiento del clima organizacional y la cohesión del equipo</li>
            <li>Potenciales beneficios fiscales y refuerzo de la estrategia RSE</li>
          </ul>
        </div>

        <div className={styles.processSection}>
          <h3>Proceso Simple y Eficiente</h3>
          <motion.div
            ref={processRef}
            className={styles.processSteps}
            variants={processContainerVariants}
            initial="hidden"
            animate={processInView ? 'visible' : 'hidden'}
          >
            <motion.div className={styles.processStep} variants={processStepVariants}>
              <div className={styles.processStepNumber}>1</div>
              <div className={styles.processStepLabel}>Consulta</div>
            </motion.div>
            <motion.div className={styles.processStep} variants={processStepVariants}>
              <div className={styles.processStepNumber}>2</div>
              <div className={styles.processStepLabel}>Cotización</div>
            </motion.div>
            <motion.div className={styles.processStep} variants={processStepVariants}>
              <div className={styles.processStepNumber}>3</div>
              <div className={styles.processStepLabel}>Ejecución</div>
            </motion.div>
            <motion.div className={styles.processStep} variants={processStepVariants}>
              <div className={styles.processStepNumber}>4</div>
              <div className={styles.processStepLabel}>Resultados</div>
            </motion.div>
          </motion.div>
        </div>

        <div className={styles.corporateGuarantee}>
          <p>
            Garantizamos total flexibilidad de horarios (incluyendo fines de semana) y capacidad de atención
            simultánea adaptada a su número de colaboradores.
          </p>
          <Link href="/#contacto" className={styles.corporateCta}>
            Contáctenos para una cotización personalizada y eleve el bienestar de su equipo al nivel Premium →
          </Link>
        </div>
      </div>
    </section>
  )
}

