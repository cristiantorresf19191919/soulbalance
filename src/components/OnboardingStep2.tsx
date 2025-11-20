'use client'

import { TextField, Box, Typography, Button, Avatar } from '@mui/material'
import { MASSAGE_CATEGORIES } from '@/lib/massage-types'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

interface OnboardingStep2Props {
  formData: any
  errors: Record<string, string>
  handleChange: (field: string, value: any) => void
  handleProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  profilePicturePreview: string | null
}

export default function OnboardingStep2({
  formData,
  errors,
  handleChange,
  handleProfilePictureChange,
  profilePicturePreview
}: OnboardingStep2Props) {
  const handleServiceToggle = (service: string) => {
    const current = formData.servicesOffered || []
    const updated = current.includes(service)
      ? current.filter((s: string) => s !== service)
      : [...current, service]
    handleChange('servicesOffered', updated)
  }

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
        Perfil Profesional
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={profilePicturePreview || undefined}
          sx={{ 
            width: 120, 
            height: 120, 
            bgcolor: '#075257',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 600,
            border: '3px solid rgba(7, 82, 87, 0.2)',
            boxShadow: '0 4px 12px rgba(7, 82, 87, 0.15)'
          }}
        >
          {!profilePicturePreview && 'Foto'}
        </Avatar>
        <Button
          variant="outlined"
          component="label"
          sx={{
            color: '#075257',
            borderColor: '#075257',
            borderWidth: '2px',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { 
              borderColor: '#054347',
              bgcolor: 'rgba(7, 82, 87, 0.08)',
              borderWidth: '2px'
            }
          }}
        >
          Subir Foto
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </Button>
      </Box>

      <TextField
        label="Título Profesional"
        value={formData.professionalTitle}
        onChange={(e) => handleChange('professionalTitle', e.target.value)}
        error={!!errors.professionalTitle}
        helperText={errors.professionalTitle}
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
        label="Sobre Mí"
        multiline
        rows={4}
        value={formData.aboutMe}
        onChange={(e) => handleChange('aboutMe', e.target.value)}
        error={!!errors.aboutMe}
        helperText={errors.aboutMe}
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

      <Box>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#075257',
            mb: 2,
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          Servicios Ofrecidos
        </Typography>
        {errors.servicesOffered && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#d32f2f', 
              display: 'block', 
              mb: 1,
              fontWeight: 500
            }}
          >
            {errors.servicesOffered}
          </Typography>
        )}
        <FormGroup>
          {MASSAGE_CATEGORIES.map((service) => (
            <FormControlLabel
              key={service}
              control={
                <Checkbox
                  checked={(formData.servicesOffered || []).includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  sx={{
                    color: 'rgba(7, 82, 87, 0.5)',
                    '&.Mui-checked': { 
                      color: '#075257'
                    }
                  }}
                />
              }
              label={service}
              sx={{ 
                color: '#075257',
                fontWeight: 500,
                '&:hover': {
                  color: '#054347'
                }
              }}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  )
}

