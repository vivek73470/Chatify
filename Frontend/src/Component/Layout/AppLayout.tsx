import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

const AppLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      <Outlet />
    </Box>
  )
}

export default AppLayout
