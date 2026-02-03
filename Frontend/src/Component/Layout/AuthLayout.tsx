import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

const AuthLayout = () => {
    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `
          radial-gradient(circle at top left, #e8edf1ff 0%, transparent 40%),
          radial-gradient(circle at bottom right, #b9b1b4ff 0%, transparent 40%),
          linear-gradient(135deg, #d3d3d4ff 0%, #e0e1e2ff 100%)
        `
                }}
            >
                <Outlet />
            </Box>
        </>
    )
}

export default AuthLayout
