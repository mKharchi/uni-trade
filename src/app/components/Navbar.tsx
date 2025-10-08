"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from "framer-motion"
import { Heart, User, User2 } from "lucide-react"
const Navbar = () => {
    const navlinks = [
        {
            text: "Home", link: "/"
        }, {
            text: "Contact", link: "/contact"
        }, {
            text: "About", link: "/about"
        }, {
            text: "Products", link: "/products"
        },
    ]
    return (
        <div className='w-full border-b border-gray-200 max-w-[80vw] mx-auto flex items-center py-5 px-6 justify-between'>
            <div className='w-full text-3xl flex items-center justify-start '>
                <motion.h1
                    initial={{
                        opacity: 0,
                        x: -10
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className='font-semibold'>
                    Unitrade<span className='text-red-600'>.</span>
                </motion.h1>

            </div>
            <div className='w-full hidden md:flex justify-center gap-4 items-center'>
                {
                    navlinks.map((el, index) => <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        
                        key={index}
                        className='text-lg hover:underline underline-offset-8 transition-all duration-200 '
                    >
                        <Link href={el.link}>{el.text}</Link>
                    </motion.p>)
                }
            </div>
            <motion.div
                initial={{
                    opacity: 0, x: 10
                }}
                animate={{
                    opacity: 1,
                    x: 0
                }}
                transition={{
                    duration: 0.5
                }}
                className='flex w-full items-center justify-end gap-2'>
                <Link href={"/"}>

                    <User2 size={20} />

                </Link>
                <Link href={"/"}>
                    <Heart size={20} />
                </Link>
            </motion.div>
        </div>
    )
}

export default Navbar