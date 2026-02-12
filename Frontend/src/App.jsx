
import './App.css'
import AllRoutes from './Component/AllRoutes/AllRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
} from '@mui/material';
import { ConfirmDialogProvider } from './Component/Common/ConfirmDialogProvider';

function App() {
  return (
    <>
      <ToastContainer/>
      <ConfirmDialogProvider>
        <Box className='app'>
          <AllRoutes />
        </Box>
      </ConfirmDialogProvider>

    </>
  )
}

export default App
