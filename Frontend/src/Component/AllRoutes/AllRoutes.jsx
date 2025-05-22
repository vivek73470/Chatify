import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../Pages/Auth/Login';

function AllRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AllRoutes;
