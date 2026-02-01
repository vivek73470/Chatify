import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../Pages/Auth/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import ChatDashboard from '../../Pages/Dashboard/ChatDashboard';


function AllRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/chatDashboard" replace />} />
                <Route path="/chatDashboard" element={<ChatDashboard />} />
            </Route>
        </Routes>
    );
}

export default AllRoutes;
