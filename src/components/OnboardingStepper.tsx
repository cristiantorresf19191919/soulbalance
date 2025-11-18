'use client'

import { Box, Step, StepLabel, Stepper } from '@mui/material'
import { useLanguage } from '@/lib/language-context'

interface OnboardingStepperProps {
  activeStep: number
}

export default function OnboardingStepper({ activeStep }: OnboardingStepperProps) {
  const { t } = useLanguage()
  const steps = [
    t('onboarding.stepper.step1'),
    t('onboarding.stepper.step2'),
    t('onboarding.stepper.step3')
  ]

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 4, pb: 2 }}>
      <Stepper 
        activeStep={activeStep - 1} 
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          },
          '& .MuiStepConnector-active .MuiStepConnector-line': {
            borderColor: 'var(--primary-green)'
          },
          '& .MuiStepConnector-completed .MuiStepConnector-line': {
            borderColor: 'var(--primary-green)'
          },
          '& .MuiStepIcon-root': {
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '1.75rem',
            '&.Mui-active': {
              color: 'var(--primary-green)'
            },
            '&.Mui-completed': {
              color: 'var(--primary-green)'
            }
          },
          '& .MuiStepIcon-text': {
            fill: 'white',
            fontWeight: 600
          }
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 500,
                  '&.Mui-active': {
                    color: 'rgba(255, 255, 255, 1)',
                    fontWeight: 600
                  },
                  '&.Mui-completed': {
                    color: 'rgba(255, 255, 255, 0.95)'
                  }
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

