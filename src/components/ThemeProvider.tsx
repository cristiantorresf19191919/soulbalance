'use client'

import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#075257',
      dark: '#053F43',
      light: '#0A6B72',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F2E9C9',
      dark: '#E8DCB0',
      light: '#F7F1DC',
      contrastText: '#4D4D4D',
    },
    text: {
      primary: '#4D4D4D',
      secondary: '#6B6B6B',
    },
    background: {
      default: '#F5F1E8',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '50px',
          fontWeight: 600,
          padding: '12px 32px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
        },
      },
    },
  },
})

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', height: '100%', flex: 1 }}>
        {children}
      </div>
    </MUIThemeProvider>
  )
}

