'use client'

import { useState, FormEvent } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'

export interface FormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
  // Booking fields (optional for regular contact form)
  bookingDate?: Date | null
  duration?: string
  price?: string
  serviceName?: string
}

export function useContactForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = (data: FormData): string[] => {
    const errors: string[] = []
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Por favor, ingresa tu nombre completo')
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email || !emailPattern.test(data.email)) {
      errors.push('Por favor, ingresa un email válido')
    }
    
    const phonePattern = /^(\+?57)?[0-9]{10}$/
    const phone = data.phone.replace(/\s+/g, '')
    if (!data.phone || !phonePattern.test(phone)) {
      errors.push('Por favor, ingresa un teléfono válido (ej: +57 300 123 4567)')
    }
    
    if (!data.service) {
      errors.push('Por favor, selecciona un servicio')
    }
    
    return errors
  }

  const submitForm = async (data: FormData): Promise<{ success: boolean; message: string }> => {
    setLoading(true)
    setError(null)

    try {
      // Validate
      const errors = validateForm(data)
      if (errors.length > 0) {
        throw new Error(errors[0])
      }

      if (!firestore) {
        throw new Error('Firestore no está disponible')
      }

      // Prepare Firestore data
      const firestoreData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        service: data.service || '',
        message: data.message || '',
        subject: data.service ? `Consulta sobre: ${data.service}` : 'Consulta general',
        createdAt: serverTimestamp()
      }

      // Add booking details if present
      if (data.bookingDate) {
        // Convert Date to Firestore Timestamp
        const bookingTimestamp = Timestamp.fromDate(data.bookingDate)
        firestoreData.bookingDate = bookingTimestamp
        firestoreData.bookingDateTimestamp = data.bookingDate.getTime()
      }
      if (data.duration) {
        firestoreData.duration = data.duration
      }
      if (data.price) {
        firestoreData.price = data.price
      }
      if (data.serviceName) {
        firestoreData.serviceName = data.serviceName
      }

      // Save to Firestore
      const contactsCollection = collection(firestore, 'contacts')
      await addDoc(contactsCollection, firestoreData)

      return { success: true, message: '¡Mensaje enviado exitosamente! Te contactaremos pronto.' }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al enviar el formulario. Por favor, intenta nuevamente.'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submitForm }
}

