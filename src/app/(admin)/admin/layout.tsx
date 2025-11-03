"use client";
import React, { useState } from 'react'
import AdminProvider from './AdminContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { toast } from 'react-toastify';
import LogoutButton from './LogoutButton';

const layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const isActive = (path: string) => {
        return pathname === path ? 'bg-white text-primary' : 'text-white hover:bg-white/10'
    }

    const closeSidebar = () => setIsSidebarOpen(false)

    return (<AdminProvider>
        <div className='w-full min-h-screen flex items-stretch justify-start p-3'>
            {/* Mobile Menu Button */}
            <nav className='w-full bg-background z-20 lg:hidden fixed left-0 top-0 flex flex-row-reverse items-center justify-between p-4 '>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="  z-50 p-2 bg-primary text-white rounded-md"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div
                    className="font-semibold text-2xl  z-30 p-2  text-primary rounded-md"
                >
                    Unitrade<span className='text-red-400'>.</span>
                    <span className='text-sm font-normal'> (Admin)</span>

                </div>
                <hr className='absolute left-0 mb-2 bottom-0 border w-full ' />
            </nav>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                bg-primary rounded text-background 
                w-64 lg:w-80 
                flex flex-col items-center justify-start
                p-6 px-4 gap-6
                fixed lg:static
                top-0 left-0 min-h-full
                z-40
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <h1 className=' text-2xl font-semibold text-white'>
                    Unitrade<span className='text-red-400'>.</span>
                    <span className='text-sm font-normal'> (Admin)</span>
                </h1>
                <hr className='w-full  border border-white/20' />
                <div className="flex w-full flex-col gap-3">
                    <Link
                        href="/admin/users"
                        onClick={closeSidebar}
                        className={`p-2 border rounded-md transition-colors duration-200 cursor-pointer border-white/20 w-full ${isActive('/admin/users')}`}
                    >
                        User Management
                    </Link>
                    <Link
                        href="/admin/settings"
                        onClick={closeSidebar}
                        className={`p-2 border rounded-md transition-colors duration-200 cursor-pointer border-white/20 w-full ${isActive('/admin/settings')}`}
                    >
                        Settings
                    </Link>
                </div>
                <div className='absolute bottom-8 px-4 w-full'>
                    <LogoutButton/>

                </div>
            </div>

            {/* Main Content */}
            <div className='w-full  lg:max-w-screen pt-16 lg:pt-0'>
                {children}
            </div>
        </div>
    </AdminProvider>)
}

export default layout