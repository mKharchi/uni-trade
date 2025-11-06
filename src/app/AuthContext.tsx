"use client";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import React, { createContext, useEffect, useState } from "react";
import { AiFillWechatWork } from "react-icons/ai";
import { toast } from "react-toastify";
import { jwt } from "zod";

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
    notifications: any[];
    userProducts: any[];
    fetchUserProducts: () => void;
    history: any[];
    fetchHistory: () => void;
    favourites: any[];
    fetchFavourites: () => void;
    addToFavourites: (id: number) => void;
    removeFavourite: (id: number) => void;
    isFavourite: (id: number) => boolean;
    addToHistory: (productId: number, action: string) => void;
    removeHistory: (id: number) => void;
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
    const [notifications, setNotifications] = useState([]);
    const [userProducts, setUserProducts] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [favourites, setFavourites] = useState<any[]>([]);

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
        } else {
            localStorage.removeItem("authToken");
            setUser(null);
            setNotifications([]);
            setUserProducts([]);
            setHistory([]);
            setFavourites([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);


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

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();
            if (result.success) {
                console.log(result.notifications);
                setNotifications(result.notifications);
            } else {
                throw new Error(result.error || "Failed to fetch notifications");
            }
        } catch (err: any) {
            console.error("Notifications fetch error:", err.message);
        }
    };

    const fetchUserProducts = async () => {
        try {
            const response = await fetch("/api/users/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            setUserProducts(result.products);
        } catch (error: any) {
            console.error("User products fetch error:", error.message);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch("/api/users/history", {
                headers: { Authorization: `Bearer ${token}` }

            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            console.log(result);

            setHistory(result.history);
        } catch (error: any) {
            toast.error("History fetch error:", error.message);
        }
    };

    const addToHistory = async (productId: number, action: string) => {
        try {
            // Check if productId is valid
            if (!productId) {
                console.error("Invalid productId:", productId);
                return;
            }

            // First, fetch the latest history to check for duplicates
            const checkRes = await fetch("/api/users/history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const checkData = await checkRes.json();

            if (checkData.success) {
                const existingHistory = checkData.history.find(
                    (el: any) => el.productId === productId && el.action === action
                );

                if (existingHistory) {
                    console.log("Item already in history");
                    return; // Don't add duplicate
                }
            }

            // If not found, add to history
            setLoading(true);
            const res = await fetch("/api/users/history", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId,
                    action
                })
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error);
            }

            // Refresh history after adding
            await fetchHistory();

        } catch (error: any) {
            console.error("Add to history error:", error.message);
            // Don't show toast for this since it's a background operation
        } finally {
            setLoading(false);
        }
    }

    const removeHistory = async (id: number) => {
        try {
            const response = await fetch("/api/users/history", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"  // Add this header
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.info("Item Removed from History.");
            fetchHistory();
        } catch (error: any) {
            toast.error(error.message);
        }
    }
    const addToFavourites = async (id: number) => {
        try {

            const response = await fetch("/api/users/favourites", {
                method: "POST", body: JSON.stringify({
                    productId: id
                }), headers: { Authorization: `Bearer ${token}` }
            })

            const result = await response.json()
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Item added to favourites!")
            fetchFavourites()
        } catch (error: any) {
            toast.error(error.message);
        }
    }
    const isFavourite = (id: number) => {
        return favourites.some(el => el.id === id)
    }

    const removeFavourite = async (id: number) => {
        try {

            const response = await fetch("/api/users/favourites", {
                method: "DELETE", body: JSON.stringify({
                    productId: id
                }), headers: { Authorization: `Bearer ${token}` }
            })

            const result = await response.json()
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.info("Item Removed from favourites.")
            fetchFavourites()
        } catch (error: any) {
            toast.error(error.message);
        }

    }
    const fetchFavourites = async () => {
        try {
            const response = await fetch("/api/users/favourites", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            console.log(result);

            setFavourites(result.favourites.map((el: any) => (el.product)));
        } catch (error: any) {
            console.error("Favourites fetch error:", error.message);
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
            const result = await res.json();
            if (res.ok && result.success) {
                setToken(result.token ?? null);
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
        setNotifications([]);
        setUserProducts([]);
        setHistory([]);
        setFavourites([]);
        toast.info("Logged out successfully.");
    };

    // getUser fetches user data and triggers all related data fetches
    const getUser = async (): Promise<boolean> => {
        try {
            setLoading(true);

            const response = await fetch("/api/users/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            setUser(result.user);

            // Fetch all related data in parallel
            await Promise.allSettled([
                fetchNotifications(),
                fetchUserProducts(),
                fetchHistory(),
                fetchFavourites()
            ]);

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
                notifications,
                userProducts,
                fetchUserProducts,
                history,
                fetchHistory,
                favourites,
                fetchFavourites,
                addToFavourites,
                removeFavourite,
                isFavourite,
                addToHistory,
                removeHistory
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