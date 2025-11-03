"use client";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type AuthContextShape = {
    login: (email: string, password: string) => Promise<boolean>;
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
    loginAdmin: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    token: string | null;
    user: any | null;
    getUser: () => Promise<boolean>;
    notifications: any[]
};

const AuthContext = createContext<AuthContextShape | null>(null);

function safeParseJson(text: string) {
    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
}

function decodeJwtPayload(token: string | null) {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);

            getUser();
            fetchNotifications()
        } else {
            localStorage.removeItem("authToken");
            setUser(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const requestWithAuth = async (url: string, opts: RequestInit = {}) => {
        const headers = {
            "Content-Type": "application/json",
            ...(opts.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await fetch(url, { ...opts, headers, credentials: "include" });
        const text = await res.text();
        const body = safeParseJson(text);
        return { ok: res.ok, status: res.status, body };
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const text = await res.text();
            const result = safeParseJson(text) || {};
            if (res.ok && result.success) {
                setToken(result.token ?? null);
                toast.success("Login successful!");
                return true;
            }
            throw new Error(result.error || result.message || "Login failed");
        } catch (err: any) {
            toast.error(`Login failed. ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const [notifications, setNotifications] = useState([])
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/notifications/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json()
            if ( result.success) {
                console.log(result.notifications);
                
                setNotifications(result.notifications)
            }else{
            throw new Error(result.error || "");
}        } catch (err: any) {
            toast.error(` ${err.message}`);
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
        try {
            setLoading(true);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstName, lastName, phone, university, year, specialty }),
            });
            const result = await res.json()
            if (res.ok && result.success) {
                setToken(result.token ?? null);
                toast.success("Registration successful!");

                return true;
            }
            throw new Error(result.error || "");
        } catch (err: any) {
            toast.error(`Registration failed. ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = async (email: string, password: string) => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const text = await res.text();
            const result = safeParseJson(text) || {};
            if (res.ok && result.success) {
                setToken(result.token ?? null);
                toast.success("Admin login successful!");
                return true;
            }
            throw new Error(result.error || "Admin login failed");
        } catch (err: any) {
            toast.error(`Admin login failed. ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        toast.info("Logged out successfully.");
    };

    // getUser tries several endpoints and uses token payload to match when needed
    const getUser = async (): Promise<boolean> => {
        try {
            setLoading(true);

            const response = await fetch("/api/users/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const result = await response.json()
            if (!result.success) {
                throw new Error(result.error)
            }
            setUser(result.user)
            return true;

        } catch (err: any) {
            toast.error(err.message || "Failed to fetch user");
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                register,
                loginAdmin,
                logout,
                loading,
                setLoading,
                token,
                user,
                getUser,
                notifications
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};

export default AuthProvider;