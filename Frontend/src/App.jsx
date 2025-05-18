import { useState } from 'react'
import './App.css'
import AllRoutes from './Component/AllRoutes/AllRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer/>
      <AllRoutes />
    </>
  )
}

export default App
