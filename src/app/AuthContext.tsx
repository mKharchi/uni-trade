"use client";
import React , {createContext} from 'react'
import { toast } from 'react-toastify';

const AuthContext = createContext<{
    login: (email: string, password: string) => Promise<void>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading  , setLoading ] = React.useState(false);

    const login = async (email: string, password: string) => {
        // Implement login logic here
        try {
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
            } else {
                throw new Error(result.error || "Login failed");
            }
        } catch (error) {
            toast.error(`Login failed. ${(error as Error).message}`);
        }
    
    }

  return (
    <AuthContext.Provider value={{ login , loading , setLoading }}>
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