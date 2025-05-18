import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../../Pages/Auth/Login'

function AllRoutes() {
    return (
        <>
            <Routes>
                <Route path ='/login' element={<Login/>}/>
            </Routes>
        </>
    )
}

export default AllRoutes