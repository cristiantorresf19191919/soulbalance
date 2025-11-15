'use client'

import { useState, FormEvent } from 'react'
import { 
  Select, 
  MenuItem, 
  FormControl, 
  SelectChangeEvent,
  ListSubheader
} from '@mui/material'
import { useContactForm } from '@/hooks/useContactForm'
import { LoadingOverlay } from './LoadingOverlay'
import { showToast } from './ToastNotifications'
import { serviceCategories, getServiceLabel } from '@/data/serviceCategories'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      service: e.target.value
    })
  }

  return (
    <>
      <LoadingOverlay show={showLoading} />
      
      <form onSubmit={handleSubmit} className={styles.contactForm} id="contactForm">
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <h3 className={styles.formTitle}>Reserva tu Servicio Terapéutico</h3>
          <p className={styles.formSubtitle}>
            Completa el formulario y te contactaremos en menos de 24 horas para confirmar tu cita
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
          <label htmlFor="service" className={styles.selectLabel}>
            <i className="fa-solid fa-leaf label-icon"></i>
            ¿Qué servicio te interesa?
          </label>
          <FormControl fullWidth className={styles.muiSelectWrapper}>
            <Select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleSelectChange}
              required
              displayEmpty
              className={styles.muiSelect}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <span className={styles.placeholderText}>
                      <span className={styles.checkmark}>✓</span> Selecciona una opción
                    </span>
                  )
                }
                return getServiceLabel(selected)
              }}
              MenuProps={{
                PaperProps: {
                  className: styles.muiMenuPaper
                }
              }}
            >
              <MenuItem value="" disabled className={styles.muiMenuItemPlaceholder}>
                <span className={styles.checkmark}>✓</span> Selecciona una opción
              </MenuItem>
              {serviceCategories.flatMap((category) => [
                <ListSubheader 
                  key={`category-${category.id}`} 
                  className={styles.categoryHeader}
                >
                  {category.icon && (
                    <i className={`fa-solid ${category.icon} ${styles.categoryIcon}`}></i>
                  )}
                  {category.name}
                </ListSubheader>,
                ...category.services.map((service) => (
                  <MenuItem 
                    key={service.value} 
                    value={service.value} 
                    className={styles.muiMenuItem}
                  >
                    {service.label}
                  </MenuItem>
                ))
              ])}
            </Select>
          </FormControl>
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
            <div className={styles.trustIcon}>
              <i className="fa-solid fa-check"></i>
            </div>
            <span>Respuesta en menos de 24 horas</span>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>
              <i className="fa-solid fa-check"></i>
            </div>
            <span>Profesionales certificados</span>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>
              <i className="fa-solid fa-check"></i>
            </div>
            <span>100% personalizado</span>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          <span>Reservar mi Servicio</span>
          <i className="fa-solid fa-paper-plane btn-icon"></i>
        </button>
      </form>
    </>
  )
}

