import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Register from '../../Pages/Auth/UserRegister'

function AllRoutes() {
    return (
        <>
            <Routes>
                <Route path ='/register' element={<Register />}/>
            </Routes>
        </>
    )
}

export default AllRoutes