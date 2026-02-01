
import './App.css'
import AllRoutes from './Component/AllRoutes/AllRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
} from '@mui/material';

function App() {
  return (
    <>
      <ToastContainer/>
      <Box className='app'>
      <AllRoutes />
      </Box>

    </>
  )
}

export default App
