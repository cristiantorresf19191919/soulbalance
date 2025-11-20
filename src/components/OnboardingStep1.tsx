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
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#075257',
          mb: 2, 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          letterSpacing: '-0.02em'
        }}
      >
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a1a',
            borderRadius: '12px',
            '& fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.2)',
              borderWidth: '1.5px'
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.4)'
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#075257',
              borderWidth: '2px'
            }
          },
          '& .MuiInputLabel-root': { 
            color: 'rgba(7, 82, 87, 0.7)',
            fontWeight: 500
          },
          '& .MuiInputLabel-root.Mui-focused': { 
            color: '#075257',
            fontWeight: 600
          },
          '& .MuiFormHelperText-root': { 
            color: 'rgba(7, 82, 87, 0.65)',
            fontSize: '0.875rem'
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#d32f2f'
          }
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a1a',
            borderRadius: '12px',
            '& fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.2)',
              borderWidth: '1.5px'
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.4)'
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#075257',
              borderWidth: '2px'
            }
          },
          '& .MuiInputLabel-root': { 
            color: 'rgba(7, 82, 87, 0.7)',
            fontWeight: 500
          },
          '& .MuiInputLabel-root.Mui-focused': { 
            color: '#075257',
            fontWeight: 600
          },
          '& .MuiFormHelperText-root': { 
            color: 'rgba(7, 82, 87, 0.65)',
            fontSize: '0.875rem'
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#d32f2f'
          }
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a1a',
            borderRadius: '12px',
            '& fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.2)',
              borderWidth: '1.5px'
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.4)'
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#075257',
              borderWidth: '2px'
            }
          },
          '& .MuiInputLabel-root': { 
            color: 'rgba(7, 82, 87, 0.7)',
            fontWeight: 500
          },
          '& .MuiInputLabel-root.Mui-focused': { 
            color: '#075257',
            fontWeight: 600
          },
          '& .MuiFormHelperText-root': { 
            color: 'rgba(7, 82, 87, 0.65)',
            fontSize: '0.875rem'
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#d32f2f'
          }
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a1a',
            borderRadius: '12px',
            '& fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.2)',
              borderWidth: '1.5px'
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.4)'
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#075257',
              borderWidth: '2px'
            }
          },
          '& .MuiInputLabel-root': { 
            color: 'rgba(7, 82, 87, 0.7)',
            fontWeight: 500
          },
          '& .MuiInputLabel-root.Mui-focused': { 
            color: '#075257',
            fontWeight: 600
          },
          '& .MuiFormHelperText-root': { 
            color: 'rgba(7, 82, 87, 0.65)',
            fontSize: '0.875rem'
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#d32f2f'
          }
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a1a',
            borderRadius: '12px',
            '& fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.2)',
              borderWidth: '1.5px'
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(7, 82, 87, 0.4)'
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#075257',
              borderWidth: '2px'
            }
          },
          '& .MuiInputLabel-root': { 
            color: 'rgba(7, 82, 87, 0.7)',
            fontWeight: 500
          },
          '& .MuiInputLabel-root.Mui-focused': { 
            color: '#075257',
            fontWeight: 600
          },
          '& .MuiFormHelperText-root': { 
            color: 'rgba(7, 82, 87, 0.65)',
            fontSize: '0.875rem'
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#d32f2f'
          }
        }}
      />
    </Box>
  )
}

