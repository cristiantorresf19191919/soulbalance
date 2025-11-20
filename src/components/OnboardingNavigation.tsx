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
        borderTop: '1px solid rgba(7, 82, 87, 0.15)',
        backgroundColor: 'rgba(7, 82, 87, 0.03)',
        borderRadius: '0 0 28px 28px'
      }}
    >
      <Button
        onClick={onBack}
        disabled={activeStep === 1 || loading}
        sx={{
          color: '#075257',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
          px: 3,
          py: 1.25,
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: 'rgba(7, 82, 87, 0.08)'
          },
          '&:disabled': { 
            color: 'rgba(7, 82, 87, 0.3)'
          }
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
              color: 'rgba(7, 82, 87, 0.7)',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
              py: 1.25,
              borderRadius: '10px',
              '&:hover': { 
              color: '#075257',
              backgroundColor: 'rgba(7, 82, 87, 0.08)'
              }
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
              bgcolor: '#075257',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              px: 4,
              py: 1.25,
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(7, 82, 87, 0.25)',
              '&:hover': { 
              bgcolor: '#054347',
              boxShadow: '0 6px 16px rgba(7, 82, 87, 0.35)'
              },
              '&:disabled': { 
              bgcolor: 'rgba(7, 82, 87, 0.3)',
              color: 'rgba(255, 255, 255, 0.6)'
              }
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
              bgcolor: '#075257',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              px: 4,
              py: 1.25,
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(7, 82, 87, 0.25)',
              '&:hover': { 
              bgcolor: '#054347',
              boxShadow: '0 6px 16px rgba(7, 82, 87, 0.35)'
              },
              '&:disabled': { 
              bgcolor: 'rgba(7, 82, 87, 0.3)',
              color: 'rgba(255, 255, 255, 0.6)'
              }
            }}
          >
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </BrandButton>
        )}
      </Box>
    </Box>
  )
}

