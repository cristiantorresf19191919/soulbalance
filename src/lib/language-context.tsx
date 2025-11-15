'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  es: {
    'validation.fullname.required': 'El nombre completo es requerido',
    'validation.email.required': 'El email es requerido',
    'validation.email.invalid': 'El email no es válido',
    'validation.phone.required': 'El teléfono es requerido',
    'validation.phone.invalid': 'El teléfono no es válido',
    'validation.password.required': 'La contraseña es requerida',
    'validation.password.min': 'La contraseña debe tener al menos 6 caracteres',
    'validation.confirmpassword.required': 'Confirma tu contraseña',
    'validation.confirmpassword.mismatch': 'Las contraseñas no coinciden',
    'validation.professionaltitle.required': 'El título profesional es requerido',
    'validation.aboutme.required': 'La descripción es requerida',
    'validation.aboutme.min': 'La descripción debe tener al menos 50 caracteres',
    'validation.services.required': 'Debes seleccionar al menos un servicio',
    'validation.city.required': 'La ciudad es requerida',
    'validation.areas.required': 'Debes seleccionar al menos un área de servicio',
    'validation.pricing.required': 'Debes establecer precios para al menos un servicio',
    'validation.availability.required': 'Debes seleccionar al menos un horario disponible',
    'partner.account.created': '¡Cuenta creada exitosamente!',
    'redirecting.to.dashboard': 'Redirigiendo al panel...',
    'complete.profile.steps': 'Completa tu perfil en',
    'success': '3 pasos'
  },
  en: {
    'validation.fullname.required': 'Full name is required',
    'validation.email.required': 'Email is required',
    'validation.email.invalid': 'Email is not valid',
    'validation.phone.required': 'Phone is required',
    'validation.phone.invalid': 'Phone is not valid',
    'validation.password.required': 'Password is required',
    'validation.password.min': 'Password must be at least 6 characters',
    'validation.confirmpassword.required': 'Please confirm your password',
    'validation.confirmpassword.mismatch': 'Passwords do not match',
    'validation.professionaltitle.required': 'Professional title is required',
    'validation.aboutme.required': 'Description is required',
    'validation.aboutme.min': 'Description must be at least 50 characters',
    'validation.services.required': 'You must select at least one service',
    'validation.city.required': 'City is required',
    'validation.areas.required': 'You must select at least one service area',
    'validation.pricing.required': 'You must set prices for at least one service',
    'validation.availability.required': 'You must select at least one available time slot',
    'partner.account.created': 'Account created successfully!',
    'redirecting.to.dashboard': 'Redirecting to dashboard...',
    'complete.profile.steps': 'Complete your profile in',
    'success': '3 steps'
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'es' || saved === 'en')) {
      setLanguage(saved)
    }
  }, [])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    }
  }
  return context
}

