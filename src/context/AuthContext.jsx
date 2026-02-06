import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const { data } = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message ? error.response.data.message : error.message
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const { data } = await axios.post(`${apiUrl}/api/auth/register`, { name, email, password }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message ? error.response.data.message : error.message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateProfile = async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                withCredentials: true
            };
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const { data } = await axios.put(`${apiUrl}/api/auth/profile`, userData, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message ? error.response.data.message : error.message
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
