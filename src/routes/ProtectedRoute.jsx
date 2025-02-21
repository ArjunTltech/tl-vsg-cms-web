import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role = null }) => {
    const { authState } = useAuth(); 

    // Check if the user is authenticated
    if (!authState.token) {
        return <Navigate to="/login" replace />;
    }

    if (role && !role.includes(authState.role)) {
        return <Navigate to="/error/403" replace />;
    }

    return children; 
};

export default ProtectedRoute;