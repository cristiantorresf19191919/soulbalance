'use client'

import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'

export default function OnboardingFormContainer({ children }: { children: ReactNode }) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 6 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 980,
          background:
            'linear-gradient(180deg, rgba(252, 250, 245, 0.99) 0%, rgba(250, 248, 244, 0.99) 40%, rgba(252, 250, 245, 0.99) 100%)',
          borderRadius: '28px',
          border: '1.5px solid rgba(7, 82, 87, 0.15)',
          boxShadow:
            '0 26px 80px rgba(0, 0, 0, 0.45), 0 8px 28px rgba(7, 82, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
          overflow: 'hidden',
          backdropFilter: 'blur(18px)',
          position: 'relative'
        }}
      >
        {children}
      </Box>
    </Container>
  )
}

