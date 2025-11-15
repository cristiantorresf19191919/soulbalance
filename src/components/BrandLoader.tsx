import { CircularProgress, Box } from '@mui/material'

export default function BrandLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress size={60} sx={{ color: 'white' }} />
    </Box>
  )
}

