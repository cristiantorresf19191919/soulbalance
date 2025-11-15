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
      <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
        Perfil Profesional
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={profilePicturePreview || undefined}
          sx={{ width: 120, height: 120, bgcolor: 'rgba(255, 255, 255, 0.2)' }}
        >
          {!profilePicturePreview && 'Foto'}
        </Avatar>
        <Button
          variant="outlined"
          component="label"
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' }
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
          Servicios Ofrecidos
        </Typography>
        {errors.servicesOffered && (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
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
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-checked': { color: 'white' }
                  }}
                />
              }
              label={service}
              sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  )
}

