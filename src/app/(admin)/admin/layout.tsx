"use client";
import React from 'react'
import AdminProvider from './AdminContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path ? 'bg-white text-primary' : 'text-white hover:bg-white/10'
    }

    return (<AdminProvider>
        <div
            className='w-full min-h-screen
            flex items-stretch justify-start p-3'
        >
            <div className='bg-primary rounded text-background w-40 lg:w-80 flex flex-col items-center justify-start
            p-6 px-4 gap-6'>
                <h1
                    className='text-2xl font-semibold text-white'
                >
                    Unitrade<span className='text-red-400'>.</span> <span className='text-sm font-normal'>(Admin)</span>
                </h1>
                <hr className='w-full border border-white/20' />
                <div className="flex w-full flex-col gap-3">
                    <Link 
                        href="/admin/users" 
                        className={`p-2 border rounded-md transition-colors duration-200 cursor-pointer border-white/20 w-full ${isActive('/admin/users')}`}
                    >
                        User Management
                    </Link>
                    <Link 
                        href="/admin/settings" 
                        className={`p-2 border rounded-md transition-colors duration-200 cursor-pointer border-white/20 w-full ${isActive('/admin/settings')}`}
                    >
                        Settings
                    </Link>
                </div>
            </div>
            <div className='w-full max-w-[80vw] py-6 px-4'>
                {children}
            </div>
        </div>
    </AdminProvider>)
}

export default layout