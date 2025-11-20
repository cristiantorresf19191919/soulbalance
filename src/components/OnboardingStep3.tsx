'use client'

import { TextField, Box, Typography, Chip, Button } from '@mui/material'
import { MassageCategory } from '@/lib/massage-types'

interface OnboardingStep3Props {
  formData: {
    primaryServiceCity: string
    serviceAreas: string[]
    servicesOffered: MassageCategory[]
    pricing: { [key in MassageCategory]?: number }
    availability: {
      [key: string]: {
        morning: boolean
        afternoon: boolean
        evening: boolean
      }
    }
  }
  errors: Record<string, string>
  handleChange: (field: string, value: any) => void
  handlePricingChange: (service: MassageCategory, price: number) => void
  handleAvailabilityChange: (day: string, timeSlot: string, checked: boolean) => void
}

export default function OnboardingStep3({
  formData,
  errors,
  handleChange,
  handlePricingChange,
  handleAvailabilityChange
}: OnboardingStep3Props) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const timeSlots = [
    { key: 'morning', label: 'Mañana' },
    { key: 'afternoon', label: 'Tarde' },
    { key: 'evening', label: 'Noche' }
  ]

  const handleAreaAdd = (area: string) => {
    if (area && !formData.serviceAreas.includes(area)) {
      handleChange('serviceAreas', [...formData.serviceAreas, area])
    }
  }

  const handleAreaRemove = (area: string) => {
    handleChange('serviceAreas', formData.serviceAreas.filter((a) => a !== area))
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
        Detalles de Práctica
      </Typography>

      <TextField
        label="Ciudad Principal de Servicio"
        value={formData.primaryServiceCity}
        onChange={(e) => handleChange('primaryServiceCity', e.target.value)}
        error={!!errors.primaryServiceCity}
        helperText={errors.primaryServiceCity}
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
          Áreas de Servicio
        </Typography>
        {errors.serviceAreas && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#d32f2f', 
              display: 'block', 
              mb: 1,
              fontWeight: 500
            }}
          >
            {errors.serviceAreas}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {formData.serviceAreas.map((area) => (
            <Chip
              key={area}
              label={area}
              onDelete={() => handleAreaRemove(area)}
              sx={{
                backgroundColor: '#075257',
                color: '#fff',
                fontWeight: 500,
                '& .MuiChip-deleteIcon': { 
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { color: '#fff' }
                }
              }}
            />
          ))}
        </Box>
        <TextField
          placeholder="Agregar área"
          size="small"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAreaAdd((e.target as HTMLInputElement).value)
              ;(e.target as HTMLInputElement).value = ''
            }
          }}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              borderRadius: '10px',
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
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(7, 82, 87, 0.5)',
              opacity: 1
            }
          }}
        />
      </Box>

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
          Precios por Servicio
        </Typography>
        {errors.pricing && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#d32f2f', 
              display: 'block', 
              mb: 1,
              fontWeight: 500
            }}
          >
            {errors.pricing}
          </Typography>
        )}
        {formData.servicesOffered.map((service) => (
          <TextField
            key={service}
            label={service}
            type="number"
            value={formData.pricing[service] || ''}
            onChange={(e) => handlePricingChange(service, Number(e.target.value))}
            fullWidth
            sx={{ mb: 2,
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
              }
            }}
          />
        ))}
      </Box>

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
          Disponibilidad
        </Typography>
        {errors.availability && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#d32f2f', 
              display: 'block', 
              mb: 1,
              fontWeight: 500
            }}
          >
            {errors.availability}
          </Typography>
        )}
        {days.map((day) => (
          <Box key={day} sx={{ mb: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#075257', 
                mb: 1.5, 
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              {day === 'monday' ? 'Lunes' : 
               day === 'tuesday' ? 'Martes' :
               day === 'wednesday' ? 'Miércoles' :
               day === 'thursday' ? 'Jueves' :
               day === 'friday' ? 'Viernes' :
               day === 'saturday' ? 'Sábado' : 'Domingo'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {timeSlots.map((slot) => {
                const isSelected = formData.availability[day]?.[slot.key as keyof typeof formData.availability[typeof day]]
                return (
                  <Button
                    key={slot.key}
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => handleAvailabilityChange(day, slot.key, !isSelected)}
                    size="small"
                    sx={{
                      color: isSelected ? '#fff' : '#075257',
                      borderColor: '#075257',
                      borderWidth: '2px',
                      bgcolor: isSelected ? '#075257' : 'transparent',
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 2.5,
                      py: 0.75,
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: isSelected ? '#054347' : 'rgba(7, 82, 87, 0.08)',
                        borderColor: isSelected ? '#054347' : '#075257',
                        borderWidth: '2px'
                      }
                    }}
                  >
                    {slot.label}
                  </Button>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

