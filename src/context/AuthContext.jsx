import React, { createContext, useState, useEffect } from 'react';

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
            const localUsers = JSON.parse(localStorage.getItem('local_users')) || [];
            const user = localUsers.find(u => u.email === email && u.password === password);

            if (user) {
                const userData = { ...user, token: 'mock-token-' + Date.now() };
                setUser(userData);
                localStorage.setItem('userInfo', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: "Invalid email or password" };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const localUsers = JSON.parse(localStorage.getItem('local_users')) || [];

            if (localUsers.find(u => u.email === email)) {
                return { success: false, message: "User already exists" };
            }

            const newUser = { id: Date.now().toString(), name, email, password };
            localUsers.push(newUser);
            localStorage.setItem('local_users', JSON.stringify(localUsers));

            const userData = { ...newUser, token: 'mock-token-' + Date.now() };
            setUser(userData);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateProfile = async (userData) => {
        try {
            const localUsers = JSON.parse(localStorage.getItem('local_users')) || [];
            const index = localUsers.findIndex(u => u.id === user.id);

            if (index !== -1) {
                localUsers[index] = { ...localUsers[index], ...userData };
                localStorage.setItem('local_users', JSON.stringify(localUsers));

                const updatedUser = { ...user, ...userData };
                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                return { success: true };
            }
            return { success: false, message: "User not found" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
