"use client";
import React, { createContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import { set } from 'zod';

const AuthContext = createContext<{
    login: (email: string, password: string) => Promise<boolean>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    register: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        university: string,
        year: number,
        specialty: string
    ) => Promise<boolean>;
    token: string | null;
    logout: () => void;
    loginAdmin: (email: string, password: string) => Promise<boolean>;
} | null>(null);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(false);
    const [token, setToken] = React.useState<string | null>(null);

    useEffect(() => {
        // Check for existing token in localStorage on mount
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        // Store token in localStorage whenever it changes
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        // Implement login logic here
        try {
            setLoading(true);
            const data = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const result = await data.json();

            if (result.success) {
                toast.success("Login successful!");
                setToken(result.token);
                return true;
            } else {
                throw new Error(result.error || "Login failed");
            }
        } catch (error) {
            toast.error(`Login failed. ${(error as Error).message}`);
            return false;
        } finally {
            setLoading(false);
        }

    }
    const register = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        university: string,
        year: number,
        specialty: string
    ) => {
        // Implement registration logic here
        try {
            setLoading(true);
            const data = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, firstName, lastName, phone, university, year, specialty }),
            });
            const result = await data.json();
            if (result.success) {
                toast.success("Registration successful!");
                return true;
            } else {
                throw new Error(result.error || "Registration failed");
            }
        } catch (error) {
            toast.error(`Registration failed. ${(error as Error).message}`);
            return false;
        } finally {
            setLoading(false);
        }
    }
    const logout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
        toast.info("Logged out successfully.");
    }
    const loginAdmin = async (email: string, password: string) => {
        // Implement admin login logic here
        try {
            setLoading(true);
            const data = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const result = await data.json();

            console.log(result);
            if (result.success) {

                toast.success("Admin login successful!");
                setToken(result.token);
                return true;
            } else {
                throw new Error(result.error || "Admin login failed");
            }
        } catch (error) {
            toast.error(`Admin login failed. ${(error as Error).message}`);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ login, loading, setLoading, register, token, logout, loginAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthProvider;