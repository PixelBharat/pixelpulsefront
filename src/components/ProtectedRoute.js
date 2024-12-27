import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    console.log('ProtectedRoute user:', user); // Debugging statement

    const navigate = useNavigate();

    // console.log('ProtectedRoute user:', user); // Debugging statement

    if (!user) {
        // return navigate('/login');
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        // return navigate('/');
        return <Navigate to="/" />;
    }

    return Component;
};

export default ProtectedRoute;
