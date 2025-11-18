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
    'success': '3 pasos',
    // Step 1 - Personal Information
    'onboarding.step1.title': 'Información Personal',
    'onboarding.step1.fullname': 'Nombre Completo',
    'onboarding.step1.email': 'Email',
    'onboarding.step1.phone': 'Teléfono',
    'onboarding.step1.password': 'Contraseña',
    'onboarding.step1.confirmPassword': 'Confirmar Contraseña',
    // Step 2 - Professional Profile
    'onboarding.step2.title': 'Perfil Profesional',
    'onboarding.step2.photo': 'Foto',
    'onboarding.step2.uploadPhoto': 'Subir Foto',
    'onboarding.step2.professionalTitle': 'Título Profesional',
    'onboarding.step2.aboutMe': 'Sobre Mí',
    'onboarding.step2.servicesOffered': 'Servicios Ofrecidos',
    // Step 3 - Practice Details
    'onboarding.step3.title': 'Detalles de Práctica',
    'onboarding.step3.primaryCity': 'Ciudad Principal de Servicio',
    'onboarding.step3.serviceAreas': 'Áreas de Servicio',
    'onboarding.step3.addArea': 'Agregar área',
    'onboarding.step3.pricing': 'Precios por Servicio',
    'onboarding.step3.availability': 'Disponibilidad',
    'onboarding.step3.morning': 'Mañana',
    'onboarding.step3.afternoon': 'Tarde',
    'onboarding.step3.evening': 'Noche',
    // Stepper
    'onboarding.stepper.step1': 'Información Personal',
    'onboarding.stepper.step2': 'Perfil Profesional',
    'onboarding.stepper.step3': 'Detalles de Práctica',
    // Navigation
    'onboarding.nav.back': 'Atrás',
    'onboarding.nav.next': 'Siguiente',
    'onboarding.nav.completeLater': 'Completar Después',
    'onboarding.nav.creating': 'Creando...',
    'onboarding.nav.createAccount': 'Crear Cuenta',
    // Days
    'onboarding.day.monday': 'Lunes',
    'onboarding.day.tuesday': 'Martes',
    'onboarding.day.wednesday': 'Miércoles',
    'onboarding.day.thursday': 'Jueves',
    'onboarding.day.friday': 'Viernes',
    'onboarding.day.saturday': 'Sábado',
    'onboarding.day.sunday': 'Domingo',
    // Error messages
    'error.auth.unavailable': 'El servicio de autenticación no está disponible. Intenta de nuevo más tarde.',
    'error.account.create.failed': 'Error al crear la cuenta. Por favor, intenta de nuevo.',
    'error.account.create.generic': 'No se pudo crear la cuenta. Por favor, intenta de nuevo.',
    'error.auth.email.in.use': 'Este correo electrónico ya está en uso. Por favor, usa otro.',
    'error.auth.invalid.email': 'El correo electrónico no es válido.',
    'error.auth.weak.password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
    'error.auth.network.failed': 'Error de conexión. Por favor, verifica tu conexión a internet.',
    // Dev tooltip
    'dev.autofill.tooltip': 'Auto-completar datos de prueba (Solo desarrollo)',
    // Navbar
    'nav.enroll': 'Únete a Nosotros',
    'nav.login': 'Iniciar Sesión',
    'nav.admin': 'Admin',
    'nav.logout': 'Cerrar Sesión',
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.corporate': 'Empresarial',
    'nav.blog': 'Blog',
    'nav.shorts': 'Shorts',
    'nav.play': 'Juega',
    'nav.contact': 'Contacto'
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
    'success': '3 steps',
    // Step 1 - Personal Information
    'onboarding.step1.title': 'Personal Information',
    'onboarding.step1.fullname': 'Full Name',
    'onboarding.step1.email': 'Email',
    'onboarding.step1.phone': 'Phone',
    'onboarding.step1.password': 'Password',
    'onboarding.step1.confirmPassword': 'Confirm Password',
    // Step 2 - Professional Profile
    'onboarding.step2.title': 'Professional Profile',
    'onboarding.step2.photo': 'Photo',
    'onboarding.step2.uploadPhoto': 'Upload Photo',
    'onboarding.step2.professionalTitle': 'Professional Title',
    'onboarding.step2.aboutMe': 'About Me',
    'onboarding.step2.servicesOffered': 'Services Offered',
    // Step 3 - Practice Details
    'onboarding.step3.title': 'Practice Details',
    'onboarding.step3.primaryCity': 'Primary Service City',
    'onboarding.step3.serviceAreas': 'Service Areas',
    'onboarding.step3.addArea': 'Add area',
    'onboarding.step3.pricing': 'Pricing per Service',
    'onboarding.step3.availability': 'Availability',
    'onboarding.step3.morning': 'Morning',
    'onboarding.step3.afternoon': 'Afternoon',
    'onboarding.step3.evening': 'Evening',
    // Stepper
    'onboarding.stepper.step1': 'Personal Information',
    'onboarding.stepper.step2': 'Professional Profile',
    'onboarding.stepper.step3': 'Practice Details',
    // Navigation
    'onboarding.nav.back': 'Back',
    'onboarding.nav.next': 'Next',
    'onboarding.nav.completeLater': 'Complete Later',
    'onboarding.nav.creating': 'Creating...',
    'onboarding.nav.createAccount': 'Create Account',
    // Days
    'onboarding.day.monday': 'Monday',
    'onboarding.day.tuesday': 'Tuesday',
    'onboarding.day.wednesday': 'Wednesday',
    'onboarding.day.thursday': 'Thursday',
    'onboarding.day.friday': 'Friday',
    'onboarding.day.saturday': 'Saturday',
    'onboarding.day.sunday': 'Sunday',
    // Error messages
    'error.auth.unavailable': 'Authentication service is not available. Please try again later.',
    'error.account.create.failed': 'Failed to create account. Please try again.',
    'error.account.create.generic': 'Failed to create account. Please try again.',
    'error.auth.email.in.use': 'This email is already in use. Please use another one.',
    'error.auth.invalid.email': 'The email address is not valid.',
    'error.auth.weak.password': 'The password is too weak. It must be at least 6 characters.',
    'error.auth.network.failed': 'Network error. Please check your internet connection.',
    // Dev tooltip
    'dev.autofill.tooltip': 'Auto-fill test data (Dev only)',
    // Navbar
    'nav.enroll': 'Enroll With Us',
    'nav.login': 'Login',
    'nav.admin': 'Admin',
    'nav.logout': 'Log Out',
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.corporate': 'Corporate',
    'nav.blog': 'Blog',
    'nav.shorts': 'Shorts',
    'nav.play': 'Play',
    'nav.contact': 'Contact'
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

