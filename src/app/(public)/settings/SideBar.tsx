import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
   
const Sidebar = (
    { isSidebarOpen, closeSidebar, isActive }: {
        isSidebarOpen: boolean,
        closeSidebar: () => void,
        isActive: (path: string) => string
    }
) => {
    return <motion.div
        className={`
                border border-primary rounded text-primary 
                bg-gray-100
                w-50 lg:w-64 
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
           
            <Link
                href="/settings/products"
                onClick={closeSidebar}
                className={`p-2 border rounded-md transition-colors text-center duration-200 cursor-pointer border-black/20 w-full ${isActive("/settings/products")}`}
            >
                My products
            </Link>
            <Link
                href="/settings/history"
                onClick={closeSidebar}
                className={`p-2 border rounded-md transition-colors text-center duration-200 cursor-pointer border-black/20 w-full ${isActive("/settings/history")}`}
            >
                History
            </Link>
        </div>

    </motion.div>

}

export default Sidebar