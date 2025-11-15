'use client'

import { Box, Step, StepLabel, Stepper } from '@mui/material'

interface OnboardingStepperProps {
  activeStep: number
}

export default function OnboardingStepper({ activeStep }: OnboardingStepperProps) {
  const steps = ['Información Personal', 'Perfil Profesional', 'Detalles de Práctica']

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 4, pb: 2 }}>
      <Stepper activeStep={activeStep - 1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
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

