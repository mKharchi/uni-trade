"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../ProductsContext";
import { useAuth } from "@/app/AuthContext";

type AdminContextType = {
    loading: boolean;
    users: {
        admins: any[],
        students: any[]
    };
};

const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth(); // token provided by ProductContext
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<AdminContextType["users"]>({
        students: [],
        admins: []
    })

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
            });

            // handle empty or non-json responses safely

            const result = await res.json();
            if (!result.success) {
                // prefer server-provided error, otherwise statusText
                throw new Error(result?.error || res.statusText || "Failed to fetch users");
            }

            console.log(result);

            setUsers({
                ...result.users
            }
            );
        } catch (error: any) {
            if (error?.name === "AbortError") return;
            toast.error(error?.message || "Unable to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        


    }, []);

    const values =
    {
        loading, users
    }

    return <AdminContext.Provider value={values}>{children}</AdminContext.Provider>;
}

export const useAdmin = (): AdminContextType => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
    return ctx;
};

