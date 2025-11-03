"use client"
import LogoutButton from '@/app/(admin)/admin/LogoutButton'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'



const Sidebar = (
    { isSidebarOpen, closeSidebar, isActive }: {
        isSidebarOpen: boolean,
        closeSidebar: () => void,
        isActive: (path: string) => string
    }
) => {
    return <div className={`
                border border-primary rounded text-primary 
                bg-gray-100
                w-64 lg:w-80 
                flex flex-col items-center justify-start
                p-6 px-4 gap-6
                fixed lg:static
                top-0 left-0 
                z-40
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
        <div className="flex w-full flex-col gap-3">
            <Link
                href="/settings/profile"
                onClick={closeSidebar}
                className={`p-2 border rounded-md transition-colors text-center duration-200 cursor-pointer border-black/20 w-full ${isActive("/settings/profile")}`}
            >
                Profile
            </Link>
        </div>
        
    </div>

}


const layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    const isActive = (path: string) => {
        return pathname === path ? 'bg-gray-600 text-white' : 'text-primary '
    }

    const closeSidebar = () => setIsSidebarOpen(false)


    return (
        <div className='w-full gap-4 min-h-screen flex items-start'>
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
            <Sidebar isSidebarOpen={isSidebarOpen} isActive={isActive} closeSidebar={closeSidebar} />
            {/* Main Content */}
            <div className='w-full  lg:max-w-screen pt-16 lg:pt-0'>
                {children}
            </div>
        </div>
    )
}

export default layout