'use client'

import { useState, FormEvent } from 'react'
import { 
  Select, 
  MenuItem, 
  FormControl,
  SelectChangeEvent,
  Button
} from '@mui/material'
import { useContactForm } from '@/hooks/useContactForm'
import { LoadingOverlay } from './LoadingOverlay'
import { showToast } from './ToastNotifications'
import styles from './CorporateBookingForm.module.css'

interface CorporateBookingFormProps {
  serviceId?: string
  serviceName?: string
  onSuccess?: () => void
}

export function CorporateBookingForm({ 
  serviceId, 
  serviceName,
  onSuccess 
}: CorporateBookingFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    numberOfEmployees: '',
    city: '',
    address: '',
    contactName: '',
    contactPosition: '',
    email: '',
    phone: '',
    serviceCategory: '',
    frequency: '',
    wellnessFormation: [] as string[],
    massageSession: true,
    message: ''
  })
  const [showLoading, setShowLoading] = useState(false)
  const { submitForm } = useContactForm()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    setShowLoading(true)

    const formationText = formData.wellnessFormation.length > 0 
      ? formData.wellnessFormation.join(', ')
      : 'Ninguna formación seleccionada'
    
    const message = `SOLICITUD CORPORATIVA\n\n` +
      `Empresa: ${formData.companyName}\n` +
      `Número de empleados: ${formData.numberOfEmployees}\n` +
      `Ciudad: ${formData.city}\n` +
      `Dirección: ${formData.address}\n` +
      `Persona de contacto: ${formData.contactName} - ${formData.contactPosition}\n` +
      `Categoría de interés: ${formData.serviceCategory || 'No especificada'}\n` +
      `Frecuencia deseada: ${formData.frequency || 'No especificada'}\n` +
      `Jornada de masajes: ${formData.massageSession ? 'Sí' : 'No'}\n` +
      `Formación en bienestar deseada: ${formationText}\n\n` +
      `Mensaje adicional:\n${formData.message || 'Sin mensaje adicional'}`

    const result = await submitForm({
      name: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      service: serviceId || 'empresarial',
      message: message,
      serviceName: serviceName || 'Servicio Corporativo',
      // Corporate-specific fields in message
    })

    setShowLoading(false)

    if (result.success) {
      showToast('¡Solicitud enviada!', 'Te contactaremos pronto con una propuesta personalizada para tu empresa.', 'success')
      setFormData({
        companyName: '',
        numberOfEmployees: '',
        city: '',
        address: '',
        contactName: '',
        contactPosition: '',
        email: '',
        phone: '',
        serviceCategory: '',
        frequency: '',
        wellnessFormation: [],
        massageSession: true,
        message: ''
      })
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000)
      }
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
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <LoadingOverlay show={showLoading} />
      
      <form onSubmit={handleSubmit} className={styles.corporateForm}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="fa-solid fa-building"></i>
          </div>
          <h3 className={styles.formTitle}>Solicitar Propuesta Corporativa</h3>
          <p className={styles.formSubtitle}>
            Completa el formulario y te enviaremos una propuesta personalizada para tu empresa
          </p>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <label htmlFor="companyName" className={styles.label}>
              <i className="fa-solid fa-building label-icon"></i>
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Ej: Tech Solutions S.A.S."
              required
              value={formData.companyName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formSection}>
            <label htmlFor="numberOfEmployees" className={styles.label}>
              <i className="fa-solid fa-users label-icon"></i>
              Número de Empleados *
            </label>
            <FormControl fullWidth className={styles.selectWrapper}>
              <Select
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleSelectChange}
                required
                displayEmpty
                className={styles.select}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span className={styles.placeholder}>Selecciona un rango</span>
                  }
                  return selected
                }}
              >
                <MenuItem value="1-10">1-10 empleados</MenuItem>
                <MenuItem value="11-25">11-25 empleados</MenuItem>
                <MenuItem value="26-50">26-50 empleados</MenuItem>
                <MenuItem value="51-100">51-100 empleados</MenuItem>
                <MenuItem value="101-250">101-250 empleados</MenuItem>
                <MenuItem value="251-500">251-500 empleados</MenuItem>
                <MenuItem value="500+">Más de 500 empleados</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <label htmlFor="city" className={styles.label}>
              <i className="fa-solid fa-map-marker-alt label-icon"></i>
              Ciudad *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Ej: Bogotá, Medellín, Cali"
              required
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formSection}>
            <label htmlFor="address" className={styles.label}>
              <i className="fa-solid fa-map-pin label-icon"></i>
              Dirección de la Oficina *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Dirección completa donde se realizaría el servicio"
              required
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <label htmlFor="contactName" className={styles.label}>
              <i className="fa-solid fa-user-tie label-icon"></i>
              Nombre del Contacto *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              placeholder="Tu nombre completo"
              required
              value={formData.contactName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formSection}>
            <label htmlFor="contactPosition" className={styles.label}>
              <i className="fa-solid fa-briefcase label-icon"></i>
              Cargo *
            </label>
            <input
              type="text"
              id="contactPosition"
              name="contactPosition"
              placeholder="Ej: Gerente de RRHH, Director de Talento"
              required
              value={formData.contactPosition}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <label htmlFor="email" className={styles.label}>
              <i className="fa-regular fa-envelope label-icon"></i>
              Email Corporativo *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="contacto@empresa.com"
              required
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formSection}>
            <label htmlFor="phone" className={styles.label}>
              <i className="fa-solid fa-mobile-screen label-icon"></i>
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+57 300 123 4567"
              required
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <label htmlFor="serviceCategory" className={styles.label}>
              <i className="fa-solid fa-spa label-icon"></i>
              Tipo de Servicio de Interés
            </label>
            <FormControl fullWidth className={styles.selectWrapper}>
              <Select
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleSelectChange}
                displayEmpty
                className={styles.select}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span className={styles.placeholder}>Selecciona una categoría</span>
                  }
                  return selected
                }}
              >
                <MenuItem value="Masajes en oficina">Masajes en oficina (en silla ergonómica)</MenuItem>
                <MenuItem value="Jornadas de bienestar">Jornadas de bienestar mensuales</MenuItem>
                <MenuItem value="Bonos de regalo">Bonos de regalo para empleados</MenuItem>
                <MenuItem value="Experiencias corporativas">Experiencias corporativas (cuatro elementos, aromaterapia)</MenuItem>
                <MenuItem value="Programa personalizado">Programa personalizado a medida</MenuItem>
                <MenuItem value="No estoy seguro">No estoy seguro, necesito orientación</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className={styles.formSection}>
            <label htmlFor="frequency" className={styles.label}>
              <i className="fa-solid fa-calendar-check label-icon"></i>
              Frecuencia Deseada
            </label>
            <FormControl fullWidth className={styles.selectWrapper}>
              <Select
                name="frequency"
                value={formData.frequency}
                onChange={handleSelectChange}
                displayEmpty
                className={styles.select}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span className={styles.placeholder}>Selecciona una frecuencia</span>
                  }
                  return selected
                }}
              >
                <MenuItem value="Una vez">Una vez (evento especial)</MenuItem>
                <MenuItem value="Semanal">Semanal</MenuItem>
                <MenuItem value="Quincenal">Quincenal</MenuItem>
                <MenuItem value="Mensual">Mensual</MenuItem>
                <MenuItem value="Bimestral">Bimestral</MenuItem>
                <MenuItem value="Trimestral">Trimestral</MenuItem>
                <MenuItem value="A definir">A definir según propuesta</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>
            <i className="fa-solid fa-hand-sparkles label-icon"></i>
            Jornada de Bienestar
          </label>
          <div className={styles.wellnessSection}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.massageSession}
                  onChange={(e) => setFormData({ ...formData, massageSession: e.target.checked })}
                  className={styles.checkbox}
                />
                <span>Jornada de Masajes (Recomendada)</span>
              </label>
              <p className={styles.checkboxDescription}>
                Sesiones de masajes personalizadas para tu equipo
              </p>
            </div>
            
            <div className={styles.formationSection}>
              <label className={styles.formationLabel}>
                Formación en Bienestar (Opcional)
              </label>
              <p className={styles.formationDescription}>
                Complementa la jornada de masajes con formación práctica. Un empleado con buena salud mental aumenta la productividad.
              </p>
              <div className={styles.checkboxGrid}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.wellnessFormation.includes('salud-mental')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: [...formData.wellnessFormation, 'salud-mental']
                        })
                      } else {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: formData.wellnessFormation.filter(f => f !== 'salud-mental')
                        })
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Salud Mental</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.wellnessFormation.includes('buenos-habitos')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: [...formData.wellnessFormation, 'buenos-habitos']
                        })
                      } else {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: formData.wellnessFormation.filter(f => f !== 'buenos-habitos')
                        })
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Buenos Hábitos</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.wellnessFormation.includes('cuidado-piel')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: [...formData.wellnessFormation, 'cuidado-piel']
                        })
                      } else {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: formData.wellnessFormation.filter(f => f !== 'cuidado-piel')
                        })
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Cuidado de Piel</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.wellnessFormation.includes('cuidado-cuerpo')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: [...formData.wellnessFormation, 'cuidado-cuerpo']
                        })
                      } else {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: formData.wellnessFormation.filter(f => f !== 'cuidado-cuerpo')
                        })
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Cuidado de Cuerpo</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.wellnessFormation.includes('equilibrate-posturas')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: [...formData.wellnessFormation, 'equilibrate-posturas']
                        })
                      } else {
                        setFormData({ 
                          ...formData, 
                          wellnessFormation: formData.wellnessFormation.filter(f => f !== 'equilibrate-posturas')
                        })
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Equilibrate Posturas</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <label htmlFor="message" className={styles.label}>
            <i className="fa-regular fa-comment label-icon"></i>
            Mensaje Adicional (Opcional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Cuéntanos más sobre las necesidades de bienestar de tu equipo, horarios preferidos, presupuesto aproximado, o cualquier detalle que consideres relevante..."
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formNote}>
          <i className="fa-solid fa-info-circle"></i>
          <span>
            Te contactaremos en menos de 24 horas con una propuesta personalizada adaptada a las necesidades de tu empresa.
          </span>
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="contained"
            className={styles.submitButton}
            fullWidth
          >
            <span>Solicitar Propuesta Personalizada</span>
            <i className="fa-solid fa-paper-plane"></i>
          </Button>
        </div>
      </form>
    </>
  )
}

