import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const storedUserData = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        return storedUserData ? JSON.parse(storedUserData) : { token: null, role: null };
    });

    const login = (token, role, rememberMe) => {
        const userData = { token, role };

        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        setAuthState(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setAuthState({ token: null, role: null });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
