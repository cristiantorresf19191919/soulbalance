'use client'

import Link from 'next/link'
import styles from './CorporateSection.module.css'

export function CorporateSection() {
  return (
    <section id="empresarial" className={styles.corporateSection}>
      <div className={styles.container}>
        <div className={styles.corporateHeader}>
          <div className={styles.corporateIcon}>
            <i className="fa-solid fa-building"></i>
          </div>
          <h2 className={styles.sectionTitleCorporate}>
            Bienestar Empresarial
          </h2>
          <p className={styles.corporateIntro}>
            Nuestros programas están diseñados para promover la salud física,
            mental y emocional de sus colaboradores. Ofrecemos un enfoque
            <strong> holístico</strong>, respaldado por la formación dual en
            <strong> Masaje Terapéutico y Psicología</strong>, lo que nos permite
            crear jornadas de bienestar que transforman el ambiente de trabajo,
            fomentando la armonía, reduciendo el estrés y disparando la
            productividad.
          </p>
        </div>

        <div className={styles.corporateSubtitle}>
          Paquetes Corporativos: Opciones flexibles y adaptables a las
          necesidades específicas y ritmo de cada empresa:
        </div>

        <div className={styles.corporatePackages}>
          <div className={styles.corporatePackageCard}>
            <div className={styles.packageIcon}>
              <i className="fa-regular fa-clock"></i>
            </div>
            <h3>Jornada de ½ Día</h3>
            <p>
              Perfecta para integrar el bienestar en la rutina sin interrumpir
              la jornada. Incluye actividades energizantes y de relajación
              concentradas en un bloque de 3 o 4 horas.
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
              Una inmersión completa en el bienestar. Este programa de día
              entero maximiza el impacto en la salud y el ánimo, logrando una
              desconexión y revitalización total del equipo.
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
              Máxima flexibilidad para cubrir necesidades puntuales. Contrata
              sesiones específicas (ej: masajes express, pausas activas)
              adaptadas exactamente al horario y presupuesto de su compañía.
            </p>
            <div className={styles.packageBadge}>
              <span>Por Horas</span>
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
              Nuestros servicios cumplen con altos estándares de calidad y
              estrictos protocolos de bioseguridad. Además, pueden generar
              oportunidades de beneficios fiscales y fortalecer su estrategia de
              Responsabilidad Social Empresarial (RSE), alineándose con las
              normativas vigentes.
            </p>
          </div>
        </div>

        <div className={styles.corporateGuarantee}>
          <p>
            Garantizamos total flexibilidad de horarios (incluyendo fines de
            semana) y capacidad de atención simultánea adaptada a su número de
            colaboradores.
          </p>
          <Link href="/empresarial" className={styles.corporateCta}>
            Contáctenos para una cotización personalizada y eleve el bienestar
            de su equipo al nivel Premium →
          </Link>
        </div>
      </div>
    </section>
  )
}

