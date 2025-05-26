import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../Pages/Auth/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import ChatDashboard from '../../Pages/Dashboard/ChatDashboard';


function AllRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route path='/' element={
                <ProtectedRoute>
                    <ChatDashboard />
                </ProtectedRoute>
            }>
                <Route path="chatDashboard" element={<ChatDashboard />} />
            </Route>
        </Routes>
    );
}

export default AllRoutes;
