'use client'

import { Box, Button } from '@mui/material'
import { useLanguage } from '@/lib/language-context'
import BrandButton from './BrandButton'

interface OnboardingNavigationProps {
  activeStep: number
  onNext: () => void
  onBack: () => void
  onSubmit: () => void
  onCreateLater: () => void
  loading: boolean
  canProceed: boolean
}

export default function OnboardingNavigation({
  activeStep,
  onNext,
  onBack,
  onSubmit,
  onCreateLater,
  loading,
  canProceed
}: OnboardingNavigationProps) {
  const { t } = useLanguage()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        p: { xs: 2, sm: 3, md: 4 },
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <Button
        onClick={onBack}
        disabled={activeStep === 1 || loading}
        sx={{
          color: 'white',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          '&:disabled': { color: 'rgba(255, 255, 255, 0.3)' }
        }}
      >
        {t('onboarding.nav.back')}
      </Button>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {activeStep === 3 && (
          <Button
            onClick={onCreateLater}
            disabled={loading}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: 'white' }
            }}
          >
            {t('onboarding.nav.completeLater')}
          </Button>
        )}
        {activeStep < 3 ? (
          <BrandButton
            variant="contained"
            onClick={onNext}
            disabled={!canProceed || loading}
            sx={{
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)',
              color: 'white',
              '&:hover': { 
                background: 'linear-gradient(135deg, var(--primary-green-dark) 0%, var(--primary-green) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(7, 82, 87, 0.4)'
              },
              '&:disabled': { 
                background: 'rgba(7, 82, 87, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {t('onboarding.nav.next')}
          </BrandButton>
        ) : (
          <BrandButton
            variant="contained"
            onClick={onSubmit}
            disabled={!canProceed || loading}
            sx={{
              background: 'linear-gradient(135deg, var(--primary-terracotta) 0%, rgba(140, 90, 48, 0.9) 100%)',
              color: 'white',
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(140, 90, 48, 0.9) 0%, var(--primary-terracotta) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(140, 90, 48, 0.4)'
              },
              '&:disabled': { 
                background: 'rgba(140, 90, 48, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {loading ? t('onboarding.nav.creating') : t('onboarding.nav.createAccount')}
          </BrandButton>
        )}
      </Box>
    </Box>
  )
}

