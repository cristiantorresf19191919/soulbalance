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
      <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
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

      <Box>
        <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
          Áreas de Servicio
        </Typography>
        {errors.serviceAreas && (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
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
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '& .MuiChip-deleteIcon': { color: 'white' }
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
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
          }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
          Precios por Servicio
        </Typography>
        {errors.pricing && (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          />
        ))}
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
          Disponibilidad
        </Typography>
        {errors.availability && (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
            {errors.availability}
          </Typography>
        )}
        {days.map((day) => (
          <Box key={day} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1, textTransform: 'capitalize' }}>
              {day}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {timeSlots.map((slot) => (
                <Button
                  key={slot.key}
                  variant={formData.availability[day]?.[slot.key as keyof typeof formData.availability[typeof day]] ? 'contained' : 'outlined'}
                  onClick={() => handleAvailabilityChange(day, slot.key, !formData.availability[day]?.[slot.key as keyof typeof formData.availability[typeof day]])}
                  size="small"
                  sx={{
                    color: formData.availability[day]?.[slot.key as keyof typeof formData.availability[typeof day]] ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: formData.availability[day]?.[slot.key as keyof typeof formData.availability[typeof day]] ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
                  }}
                >
                  {slot.label}
                </Button>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

