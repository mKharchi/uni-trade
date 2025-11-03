"use client"
import Link from 'next/link'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Heart, User2, Menu, X, Bell } from "lucide-react"
import { useAuth } from '../AuthContext'
import { AiFillNotification, AiOutlineNotification } from 'react-icons/ai'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);
    const [hovered, setHovered] = React.useState(false);

    const { token, logout } = useAuth();
    const isConnected = Boolean(token);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 20);
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navlinks = [
        { text: "Home", link: "/" },
        { text: "Products", link: "/products" },
        { text: "Contact", link: "/contact" },
        { text: "About", link: "/about" },
    ]

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/90 backdrop-blur-md shadow-border shadow-lg'
                : 'bg-background border-b border-gray-200'
                }`}
        >
            <div className='w-full mx-auto flex items-center py-5 px-2 md:px-6 justify-between'>
                {/* Logo */}
                <div className='w-full text-3xl flex items-center justify-start'>
                    <motion.h1
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className='font-semibold'
                    >
                        Unitrade<span className='text-red-600'>.</span>
                    </motion.h1>
                </div>

                {/* Desktop Navigation */}
                <div className='w-full hidden lg:flex justify-center gap-4 items-center'>
                    {navlinks.map((el, index) => (
                        <motion.p
                            key={index}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className='text-lg hover:underline underline-offset-8 transition-all duration-200'
                        >
                            <Link href={el.link}>{el.text}</Link>
                        </motion.p>
                    ))}
                </div>

                {/* Right Icons */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex w-full items-center justify-end gap-2 relative'
                >
                    {/* WRAPPER for icon + dropdown */}
                    <div
                        className="relative flex flex-col items-end"
                        onPointerEnter={() => setHovered(true)}
                        onPointerLeave={() => setHovered(false)}

                    >
                        <div className='flex items-center gap-2 justify-center cursor-pointer'>


                            <User2

                                size={20} />
                        </div>

                        <AnimatePresence>
                            {hovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className='absolute mt-2 bg-gray-50 rounded shadow-lg top-full right-0 flex flex-col min-w-[160px]'
                                >
                                    {isConnected ? (
                                        <>
                                            <Link
                                                href="/settings/profile"
                                                className='px-4 py-2 hover:bg-gray-100 text-right'
                                            >
                                                Go to profile
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className='px-4 py-2 text-right hover:bg-gray-100'
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/auth/"
                                                className='px-4 py-2 hover:bg-gray-100 text-right'
                                            >
                                                Login
                                            </Link>

                                            <Link
                                                href="/admin-login"
                                                className='px-4 py-2 hover:bg-gray-100 text-right'
                                            >
                                                Login as Admin
                                            </Link>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/">
                        <Heart size={20} />
                    </Link>
                    {isConnected && <Link href={"/settings/notifications"}>
                        <Bell size={20} />
                    </Link>}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='lg:hidden p-1'
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.button>
                </motion.div>

            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className='lg:hidden border-t border-gray-200  overflow-hidden'
                    >
                        <div className='flex flex-col py-4 px-4 gap-1'>
                            {navlinks.map((el, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={el.link}
                                        onClick={() => setIsMenuOpen(false)}
                                        className='block px-4 py-3 text-lg hover:bg-gray-50 rounded-lg transition-all duration-200'
                                    >
                                        {el.text}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar
