import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../Pages/Auth/Login';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';


function AllRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route path='/' element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

export default AllRoutes;
