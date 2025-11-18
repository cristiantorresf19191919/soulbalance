'use client'

import { useState } from 'react'
import { TextField, Box, Typography, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useLanguage } from '@/lib/language-context'

interface OnboardingStep1Props {
  formData: any
  errors: Record<string, string>
  handleChange: (field: string, value: any) => void
}

export default function OnboardingStep1({ formData, errors, handleChange }: OnboardingStep1Props) {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
        {t('onboarding.step1.title')}
      </Typography>
      
      <TextField
        label={t('onboarding.step1.fullname')}
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
        label={t('onboarding.step1.email')}
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
        label={t('onboarding.step1.phone')}
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
        label={t('onboarding.step1.password')}
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
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
        label={t('onboarding.step1.confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label="toggle confirm password visibility"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
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

