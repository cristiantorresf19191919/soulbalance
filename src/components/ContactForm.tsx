'use client'

import { useState, FormEvent } from 'react'
import { useContactForm } from '@/hooks/useContactForm'
import { LoadingOverlay } from './LoadingOverlay'
import { showToast } from './ToastNotifications'
import styles from './ContactForm.module.css'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [showLoading, setShowLoading] = useState(false)
  const { submitForm } = useContactForm()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    setShowLoading(true)

    const result = await submitForm(formData)

    setShowLoading(false)

    if (result.success) {
      showToast('¡Éxito!', result.message, 'success')
      setFormData({ name: '', email: '', phone: '', service: '', message: '' })
    } else {
      showToast('Error', result.message, 'error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <LoadingOverlay show={showLoading} />
      
      <form onSubmit={handleSubmit} className={styles.contactForm} id="contactForm">
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="fa-solid fa-sparkles"></i>
          </div>
          <h3 className={styles.formTitle}>Reserva tu Experiencia de Bienestar</h3>
          <p className={styles.formSubtitle}>
            Completa el formulario y te contactaremos en menos de 24 horas
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">
            <i className="fa-solid fa-user label-icon"></i>
            Tu nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="¿Cómo te gusta que te llamemos?"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">
            <i className="fa-regular fa-envelope label-icon"></i>
            Tu email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="tu@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">
            <i className="fa-solid fa-mobile-screen label-icon"></i>
            Tu teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+57 300 123 4567"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="service">
            <i className="fa-solid fa-leaf label-icon"></i>
            ¿Qué servicio te interesa?
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="relajante">Masaje Relajante</option>
            <option value="descontracturante">Masaje Descontracturante</option>
            <option value="piedras">Masaje con Piedras Volcánicas</option>
            <option value="prenatal">Masaje Prenatal</option>
            <option value="4manos">Masaje a 4 Manos</option>
            <option value="piernas">Masaje Piernas Cansadas</option>
            <option value="pareja">Masaje en Pareja</option>
            <option value="soulbalance">Masaje Soul Balance - Cuatro Elementos</option>
            <option value="otro">Otro servicio</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">
            <i className="fa-regular fa-comment label-icon"></i>
            Cuéntanos más sobre ti y lo que buscas
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="¿Hay algo específico que te gustaría que sepamos? Cualquier detalle nos ayuda a personalizar tu experiencia perfecta..."
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className={styles.formTrust}>
          <div className={styles.trustItem}>
            <i className="fa-solid fa-check trust-icon"></i>
            <span>Respuesta en menos de 24 horas</span>
          </div>
          <div className={styles.trustItem}>
            <i className="fa-solid fa-check trust-icon"></i>
            <span>Profesionales certificados</span>
          </div>
          <div className={styles.trustItem}>
            <i className="fa-solid fa-check trust-icon"></i>
            <span>100% personalizado</span>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          <span>Reservar mi Experiencia</span>
          <i className="fa-solid fa-sparkles btn-icon"></i>
        </button>
      </form>
    </>
  )
}

