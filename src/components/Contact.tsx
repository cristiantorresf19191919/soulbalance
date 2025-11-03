'use client'

import { Box, Container, Typography } from '@mui/material'

export function Contact() {
  return (
    <Box component="section" id="contacto" sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" color="primary" gutterBottom>
          Contacto
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Migración en progreso...
        </Typography>
      </Container>
    </Box>
  )
}

