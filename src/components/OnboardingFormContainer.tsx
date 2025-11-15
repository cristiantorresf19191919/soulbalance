'use client'

import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'

export default function OnboardingFormContainer({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
      >
        {children}
      </Box>
    </Container>
  )
}

