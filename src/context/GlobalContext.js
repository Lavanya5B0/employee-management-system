import React, { createContext, useState, useEffect } from 'react';
import { initialEmployees } from '../utils/mockData';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [employees, setEmployees] = useState(() => {
        const saved = localStorage.getItem('employees');
        const parsedSaved = saved ? JSON.parse(saved) : [];

        // If the file has MORE employees than the storage, use the file
        if (initialEmployees.length > parsedSaved.length) {
            return initialEmployees;
        }

        return parsedSaved.length > 0 ? parsedSaved : initialEmployees;
    });

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
    }, [employees]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <GlobalContext.Provider value={{ employees, setEmployees, user, login, logout }}>
            {children}
        </GlobalContext.Provider>
    );
};