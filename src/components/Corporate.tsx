'use client'

import { Box, Container, Typography } from '@mui/material'

export function Corporate() {
  return (
    <Box component="section" sx={{ py: 8, bgcolor: 'secondary.light' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" color="primary" gutterBottom>
          Bienestar Empresarial
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Migración en progreso...
        </Typography>
      </Container>
    </Box>
  )
}

