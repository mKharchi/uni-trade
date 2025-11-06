"use client"
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'
import Sidebar from './SideBar'




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

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}


            > <Sidebar isSidebarOpen={isSidebarOpen} isActive={isActive} closeSidebar={closeSidebar} />
                {/* Main Content */}
            </motion.div>
            <motion.div

                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className='w-full  lg:max-w-screen pt-16 lg:pt-0'>
                {children}
            </motion.div>
        </div>
    )
}

export default layout