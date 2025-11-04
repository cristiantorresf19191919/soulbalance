'use client'

import { useState, useEffect, FormEvent } from 'react'
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
import { DatePickerModal } from './DatePickerModal'
import styles from './BookingForm.module.css'

interface BookingFormProps {
  serviceId: string
  serviceName: string
  pricing: Array<{ duration: string; price: string }>
  selectedDuration?: string
  onSuccess?: () => void
}

export function BookingForm({ 
  serviceId, 
  serviceName, 
  pricing,
  selectedDuration: initialDuration,
  onSuccess 
}: BookingFormProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [selectedDuration, setSelectedDuration] = useState<string>(initialDuration || '')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showLoading, setShowLoading] = useState(false)
  const { submitForm } = useContactForm()

  // Update selected duration when initialDuration prop changes
  useEffect(() => {
    if (initialDuration) {
      setSelectedDuration(initialDuration)
    }
  }, [initialDuration])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!selectedDuration) {
      showToast('Error', 'Por favor selecciona una duración', 'error')
      return
    }

    if (!selectedDate) {
      showToast('Error', 'Por favor selecciona una fecha', 'error')
      return
    }

    setShowLoading(true)

    const selectedPrice = pricing.find(p => p.duration === selectedDuration)
    const message = formData.message || 'Sin mensaje adicional'

    const result = await submitForm({
      ...formData,
      service: serviceId,
      message,
      bookingDate: selectedDate,
      duration: selectedDuration,
      price: selectedPrice?.price || '',
      serviceName: serviceName
    })

    setShowLoading(false)

    if (result.success) {
      showToast('¡Éxito!', result.message, 'success')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSelectedDuration('')
      setSelectedDate(null)
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500)
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

  const handleDurationChange = (e: SelectChangeEvent<string>) => {
    setSelectedDuration(e.target.value)
  }

  // Filter out past dates and weekends
  const isWeekday = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6 // Exclude Sundays (0) and Saturdays (6)
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1) // Start from tomorrow

  return (
    <>
      <LoadingOverlay show={showLoading} />
      
      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        <div className={styles.serviceInfo}>
          <div className={styles.serviceBadge}>
            <i className="fa-solid fa-leaf"></i>
            <span>{serviceName}</span>
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>
            <i className="fa-solid fa-clock label-icon"></i>
            Selecciona la duración
          </label>
          <FormControl fullWidth className={styles.durationSelect}>
            <Select
              value={selectedDuration}
              onChange={handleDurationChange}
              required
              displayEmpty
              className={styles.select}
              renderValue={(selected) => {
                if (!selected) {
                  return <span className={styles.placeholder}>Selecciona una duración</span>
                }
                const price = pricing.find(p => p.duration === selected)
                return `${selected} - ${price?.price}`
              }}
            >
              {pricing.map((option) => (
                <MenuItem key={option.duration} value={option.duration} className={styles.menuItem}>
                  <div className={styles.durationOption}>
                    <span className={styles.duration}>{option.duration}</span>
                    <span className={styles.price}>{option.price}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>
            <i className="fa-solid fa-calendar-days label-icon"></i>
            Selecciona la fecha
          </label>
          <div className={styles.datePickerWrapper}>
            <input
              type="text"
              readOnly
              value={selectedDate ? selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : ''}
              placeholder="Selecciona una fecha"
              className={styles.datePicker}
              onClick={() => setIsDatePickerOpen(true)}
              required
            />
            <DatePickerModal
              open={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              selectedDate={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={minDate}
              filterDate={isWeekday}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <label htmlFor="name" className={styles.label}>
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
            className={styles.input}
          />
        </div>

        <div className={styles.formSection}>
          <label htmlFor="email" className={styles.label}>
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
            className={styles.input}
          />
        </div>

        <div className={styles.formSection}>
          <label htmlFor="phone" className={styles.label}>
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
            className={styles.input}
          />
        </div>

        <div className={styles.formSection}>
          <label htmlFor="message" className={styles.label}>
            <i className="fa-regular fa-comment label-icon"></i>
            Mensaje adicional (opcional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="¿Hay algo específico que te gustaría que sepamos?"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="contained"
            className={styles.submitButton}
            fullWidth
          >
            <span>Confirmar Reserva</span>
            <i className="fa-solid fa-check"></i>
          </Button>
        </div>
      </form>
    </>
  )
}

