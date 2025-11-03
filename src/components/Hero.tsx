'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <Box
      component="section"
      className={styles.heroSection}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(7, 82, 87, 0.7) 0%, rgba(5, 63, 67, 0.7) 50%, rgba(7, 82, 87, 0.7) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Box sx={{ mb: 4 }}>
            <Image
              src="/superLogo.png"
              alt="Soul Balance Logo"
              width={200}
              height={200}
              className={styles.logoHero}
              priority
            />
          </Box>
          
          <Typography
            variant="h1"
            className={styles.brandName}
            sx={{
              fontSize: { xs: '3rem', md: '6rem' },
              fontWeight: 700,
              mb: 2,
              letterSpacing: '4px',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.6)',
            }}
          >
            SOUL BALANCE
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.75rem' },
              fontWeight: 500,
              mb: 1,
              letterSpacing: '5px',
              textTransform: 'uppercase',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
            }}
          >
            Bienestar que Transforma
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.35rem' },
              fontStyle: 'italic',
              mb: 4,
              opacity: 0.92,
              maxWidth: '700px',
              mx: 'auto',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
            }}
          >
            Experiencias de bienestar diseñadas para restaurar la armonía entre cuerpo, mente y alma
          </Typography>

          <Button
            component={Link}
            href="/#contacto"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: '50px',
              fontSize: '1.15rem',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'none',
              boxShadow: '0 10px 40px rgba(7, 82, 87, 0.4)',
              '&:hover': {
                boxShadow: '0 15px 50px rgba(7, 82, 87, 0.5)',
              },
            }}
          >
            Reservar Experiencia
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

