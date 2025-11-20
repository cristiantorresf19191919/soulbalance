'use client'

import { Box, Step, StepLabel, Stepper } from '@mui/material'

interface OnboardingStepperProps {
  activeStep: number
}

export default function OnboardingStepper({ activeStep }: OnboardingStepperProps) {
  const steps = ['Información Personal', 'Perfil Profesional', 'Detalles de Práctica']

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 4, pb: 2 }}>
      <Stepper 
        activeStep={activeStep - 1} 
        alternativeLabel
        sx={{
          '& .MuiStepIcon-root': {
            color: 'rgba(7, 82, 87, 0.25)',
            fontSize: { xs: '1.75rem', sm: '2rem' },
            '&.Mui-active': {
              color: '#075257'
            },
            '&.Mui-completed': {
              color: '#075257'
            },
            '& text': {
              fill: '#fff',
              fontWeight: 600
            }
          },
          '& .MuiStepIcon-root.Mui-active text': {
            fill: '#fff',
            fontWeight: 700
          },
          '& .MuiStepIcon-root.Mui-completed text': {
            fill: '#fff',
            fontWeight: 700
          },
          '& .MuiStepLabel-label': {
            color: 'rgba(7, 82, 87, 0.7)',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem' },
            fontWeight: 500,
            mt: 1
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: '#075257',
            fontWeight: 600
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: '#075257',
            fontWeight: 500
          },
          '& .MuiStepConnector-root': {
            top: { xs: '14px', sm: '16px' }
          },
          '& .MuiStepConnector-line': {
            borderColor: 'rgba(7, 82, 87, 0.2)',
            borderTopWidth: '2px'
          },
          '& .MuiStepConnector-line.MuiStepConnector-active': {
            borderColor: '#075257'
          },
          '& .MuiStepConnector-line.MuiStepConnector-completed': {
            borderColor: '#075257'
          }
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

