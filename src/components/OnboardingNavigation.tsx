'use client'

import { Box, Button } from '@mui/material'
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
        Atrás
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
            Completar Después
          </Button>
        )}
        {activeStep < 3 ? (
          <BrandButton
            variant="contained"
            onClick={onNext}
            disabled={!canProceed || loading}
            sx={{
              bgcolor: 'white',
              color: '#8B5CF6',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
              '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            Siguiente
          </BrandButton>
        ) : (
          <BrandButton
            variant="contained"
            onClick={onSubmit}
            disabled={!canProceed || loading}
            sx={{
              bgcolor: 'white',
              color: '#8B5CF6',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
              '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </BrandButton>
        )}
      </Box>
    </Box>
  )
}

