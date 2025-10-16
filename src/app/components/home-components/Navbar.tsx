"use client"
import Link from 'next/link'
import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Heart, User2, Menu, X } from "lucide-react"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if scrolled past threshold
            setIsScrolled(currentScrollY > 20);

            // Show navbar when scrolling up, hide when scrolling down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
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
                <div className='w-full hidden md:flex justify-center gap-4 items-center'>
                    {navlinks.map((el, index) => (
                        <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            key={index}
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
                    className='flex w-full items-center justify-end gap-2'
                >
                    <Link href="/">
                        <User2 size={20} />
                    </Link>
                    <Link href="/">
                        <Heart size={20} />
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='md:hidden  p-1'
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
                        className='md:hidden border-t border-gray-200  overflow-hidden'
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