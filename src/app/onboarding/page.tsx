'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { UserRole } from '@/lib/user-roles'
import { MassageCategory, MASSAGE_CATEGORIES } from '@/lib/massage-types'
import { partnerService } from '@/lib/partner-service'
import { useLanguage } from '@/lib/language-context'
import BrandButton from '@/components/BrandButton'
import BrandLoader from '@/components/BrandLoader'
import InlineLoader from '@/components/InlineLoader'
import OnboardingVideoBackground from '@/components/OnboardingVideoBackground'
import OnboardingFormContainer from '@/components/OnboardingFormContainer'
import OnboardingStepper from '@/components/OnboardingStepper'
import OnboardingStep1 from '@/components/OnboardingStep1'
import OnboardingStep2 from '@/components/OnboardingStep2'
import OnboardingStep3 from '@/components/OnboardingStep3'
import OnboardingNavigation from '@/components/OnboardingNavigation'

interface OnboardingData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  profilePicture: File | null
  professionalTitle: string
  aboutMe: string
  servicesOffered: MassageCategory[]
  primaryServiceCity: string
  serviceAreas: string[]
  pricing: {
    [key in MassageCategory]?: number
  }
  availability: {
    [key: string]: {
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    professionalTitle: '',
    aboutMe: '',
    servicesOffered: [],
    primaryServiceCity: '',
    serviceAreas: [],
    pricing: {},
    availability: {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false }
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('validation.fullname.required')
    }
    if (!formData.email.trim()) {
      newErrors.email = t('validation.email.required')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('validation.email.invalid')
      }
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.phone.required')
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = t('validation.phone.invalid')
      }
    }
    if (!formData.password) {
      newErrors.password = t('validation.password.required')
    } else if (formData.password.length < 6) {
      newErrors.password = t('validation.password.min')
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmpassword.required')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmpassword.mismatch')
    }
    return newErrors
  }, [formData, t])

  const validateStep2 = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.professionalTitle.trim()) {
      newErrors.professionalTitle = t('validation.professionaltitle.required')
    }
    if (!formData.aboutMe.trim()) {
      newErrors.aboutMe = t('validation.aboutme.required')
    } else if (formData.aboutMe.trim().length < 50) {
      newErrors.aboutMe = t('validation.aboutme.min')
    }
    if (formData.servicesOffered.length === 0) {
      newErrors.servicesOffered = t('validation.services.required')
    }
    return newErrors
  }, [formData, t])

  const validateStep3 = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.primaryServiceCity.trim()) {
      newErrors.primaryServiceCity = t('validation.city.required')
    }
    if (formData.serviceAreas.length === 0) {
      newErrors.serviceAreas = t('validation.areas.required')
    }
    const hasPricing = Object.values(formData.pricing).some(price => price && price > 0)
    if (!hasPricing) {
      newErrors.pricing = t('validation.pricing.required')
    }
    const hasAvailability = Object.values(formData.availability).some(day =>
      day.morning || day.afternoon || day.evening
    )
    if (!hasAvailability) {
      newErrors.availability = t('validation.availability.required')
    }
    return newErrors
  }, [formData, t])

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  const handleProfilePictureChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handlePricingChange = useCallback((service: MassageCategory, price: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [service]: price }
    }))
  }, [])

  const handleAvailabilityChange = useCallback((day: string, timeSlot: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], [timeSlot]: checked }
      }
    }))
  }, [])

  const handleNext = useCallback(() => {
    let newErrors: Record<string, string> = {}
    if (activeStep === 1) {
      newErrors = { ...validateStep1(), ...validateStep2() }
    } else if (activeStep === 2) {
      newErrors = validateStep3()
    }
    if (Object.keys(newErrors).length === 0) {
      setActiveStep(prev => prev + 1)
      setErrors({})
    } else {
      setErrors(newErrors)
    }
  }, [activeStep, validateStep1, validateStep2, validateStep3])

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1)
    setErrors({})
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user
      await updateProfile(user, { displayName: formData.fullName })
      await partnerService.createPartner({
        uid: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: UserRole.MASSAGE_PROVIDER,
        professionalTitle: formData.professionalTitle || '',
        aboutMe: formData.aboutMe || '',
        servicesOffered: formData.servicesOffered || [],
        primaryServiceCity: formData.primaryServiceCity || '',
        serviceAreas: formData.serviceAreas || [],
        pricing: formData.pricing || {},
        availability: formData.availability || {},
        profilePictureUrl: profilePicturePreview || undefined
      })
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      console.error('Error creating account:', error)
      setError(error.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [formData, profilePicturePreview, router])

  const handleCreateLater = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user
      await updateProfile(user, { displayName: formData.fullName })
      await partnerService.createPartner({
        uid: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: UserRole.MASSAGE_PROVIDER,
        professionalTitle: '',
        aboutMe: '',
        servicesOffered: [],
        primaryServiceCity: '',
        serviceAreas: [],
        pricing: {},
        availability: {},
        profilePictureUrl: undefined
      })
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      console.error('Error creating account:', error)
      setError(error.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [formData, router])

  const canProceed = useMemo(() => {
    if (activeStep === 1) {
      const step1Errors = validateStep1()
      const step2Errors = validateStep2()
      return Object.keys(step1Errors).length === 0 && Object.keys(step2Errors).length === 0
    } else if (activeStep === 2) {
      const step3Errors = validateStep3()
      return Object.keys(step3Errors).length === 0
    }
    return false
  }, [activeStep, validateStep1, validateStep2, validateStep3])

  const step3FormData = useMemo(() => ({
    primaryServiceCity: formData.primaryServiceCity,
    serviceAreas: formData.serviceAreas,
    servicesOffered: formData.servicesOffered,
    pricing: formData.pricing,
    availability: formData.availability
  }), [formData.primaryServiceCity, formData.serviceAreas, formData.servicesOffered, formData.pricing, formData.availability])

  if (success) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        color: 'white'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <BrandLoader />
          <Typography variant="h5" sx={{ mt: 3, fontWeight: 600 }}>
            {t('partner.account.created')}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
            {t('redirecting.to.dashboard')}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <OnboardingVideoBackground />
      <Box sx={{
        position: 'relative',
        zIndex: 30,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <OnboardingFormContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Box sx={{
              textAlign: 'center',
              mb: { xs: 2, sm: 3, md: 3 },
              maxWidth: '900px',
              mx: 'auto',
              px: 2
            }}>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  letterSpacing: '0.01em',
                  lineHeight: 1.3,
                  mb: 1
                }}
              >
                {t('complete.profile.steps')}
                <motion.span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginLeft: '6px',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.98)',
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.95, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {t('success')}
                </motion.span>
              </Typography>
            </Box>
          </motion.div>

          <OnboardingStepper activeStep={activeStep} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Box sx={{
              p: { xs: 2, sm: 3, md: 3 },
              position: 'relative',
              pb: { xs: 8, sm: 10, md: 10 }
            }}>
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <OnboardingStep1
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                )}
                {activeStep === 2 && (
                  <OnboardingStep2
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleProfilePictureChange={handleProfilePictureChange}
                    profilePicturePreview={profilePicturePreview}
                  />
                )}
                {activeStep === 3 && (
                  <OnboardingStep3
                    formData={step3FormData}
                    errors={errors}
                    handleChange={handleChange}
                    handlePricingChange={handlePricingChange}
                    handleAvailabilityChange={handleAvailabilityChange}
                  />
                )}
              </AnimatePresence>
            </Box>
          </motion.div>

          <OnboardingNavigation
            activeStep={activeStep}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onCreateLater={handleCreateLater}
            loading={loading}
            canProceed={canProceed}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  mx: { xs: 2, sm: 3, md: 4 },
                  mb: 2,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444'
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </OnboardingFormContainer>
      </Box>
    </Box>
  )
}

