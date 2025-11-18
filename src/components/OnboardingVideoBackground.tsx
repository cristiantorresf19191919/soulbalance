'use client'

import { Box } from '@mui/material'

export default function OnboardingVideoBackground() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(7, 82, 87, 0.85) 0%, rgba(5, 63, 67, 0.9) 50%, rgba(140, 90, 48, 0.8) 100%)',
          zIndex: 2
        }
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      >
        <source src="/rostro.mp4" type="video/mp4" />
      </video>
    </Box>
  )
}

