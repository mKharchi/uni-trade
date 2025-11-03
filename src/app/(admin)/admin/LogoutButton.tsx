"use client";
import { useAuth } from '@/app/AuthContext'
import { redirect } from 'next/navigation';
import React from 'react'

const LogoutButton = () => {
    const { logout } = useAuth()
    const handleLogout = ()=>{
        logout()
        
    }
    return (
        <button
            onClick={logout}
            className={`p-2 border bg-white text-primary  rounded-md transition-colors duration-200 cursor-pointer border-white/20 w-full `}
        >
            Logout
        </button>

    )
}

export default LogoutButton