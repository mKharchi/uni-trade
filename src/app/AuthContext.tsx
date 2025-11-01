"use client";
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
            // fetch user when token becomes available
            getUser();
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
            const text = await res.text();
            const result = safeParseJson(text) || {};
            if (res.ok && result.success) {
                toast.success("Registration successful!");
                return true;
            }
            throw new Error(result.error || "Registration failed");
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

            // 1) Try dedicated endpoint /api/auth/me
            try {
                const res1 = await requestWithAuth("/api/auth/me", { method: "GET" });
                if (res1.ok && res1.body?.user) {
                    setUser(res1.body.user);
                    return true;
                }
            } catch {
                // continue to next
            }

            // 2) Try /api/users (legacy)
            try {
                const res2 = await requestWithAuth("/api/users", { method: "GET" });
                if (res2.ok && res2.body?.user) {
                    setUser(res2.body.user);
                    return true;
                }
            } catch {
                // continue to next
            }

            // 3) Try admin users listing and match against token payload (if JWT)
            try {
                const res3 = await requestWithAuth("/api/admin/users", { method: "GET" });
                if (res3.ok && res3.body?.users) {
                    const students = Array.isArray(res3.body.users.students) ? res3.body.users.students : [];
                    const admins = Array.isArray(res3.body.users.admins) ? res3.body.users.admins : [];
                    const all = [...students, ...admins];

                    const payload = decodeJwtPayload(token);
                    const candidate =
                        all.find((u: any) => {
                            if (!u) return false;
                            if (payload?.email && u.email && String(u.email).toLowerCase() === String(payload.email).toLowerCase()) return true;
                            const uid = u.id ?? u._id ?? u.studentId ?? u.adminId;
                            if (payload?.sub && uid && String(uid) === String(payload.sub)) return true;
                            if (payload?.id && uid && String(uid) === String(payload.id)) return true;
                            return false;
                        }) ?? null;

                    if (candidate) {
                        setUser(candidate);
                        return true;
                    }
                }
            } catch {
                // ignore
            }

            // If nothing found, clear user
            setUser(null);
            return false;
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