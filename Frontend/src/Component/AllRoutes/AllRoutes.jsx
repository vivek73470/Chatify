import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../Pages/Auth/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import ChatDashboard from '../../Pages/Dashboard/ChatDashboard';
import AuthLayout from '../Layout/AuthLayout';
import AppLayout from '../Layout/AppLayout';


function AllRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route index element={<Navigate to="/chatDashboard" replace />} />
                    <Route path="/chatDashboard" element={<ChatDashboard />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default AllRoutes;
