'use client'

import { TextField, Box, Typography } from '@mui/material'

interface OnboardingStep1Props {
  formData: any
  errors: Record<string, string>
  handleChange: (field: string, value: any) => void
}

export default function OnboardingStep1({ formData, errors, handleChange }: OnboardingStep1Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
        Información Personal
      </Typography>
      
      <TextField
        label="Nombre Completo"
        value={formData.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        error={!!errors.fullName}
        helperText={errors.fullName}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'white' }
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
          '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }}
      />

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'white' }
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
          '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }}
      />

      <TextField
        label="Teléfono"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={!!errors.phone}
        helperText={errors.phone}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'white' }
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
          '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }}
      />

      <TextField
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'white' }
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
          '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }}
      />

      <TextField
        label="Confirmar Contraseña"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'white' }
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
          '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }}
      />
    </Box>
  )
}

