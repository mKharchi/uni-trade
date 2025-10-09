"use client";
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
const FastLinks = () => {
    const fastLinks = [
        {
            text: "Woman’s Fashion", link: "/"
        }, {
            text: "Men’s Fashion", link: "/"
        }, {
            text: "Electronics", link: "/"
        }, {
            text: "Home & Lifestyle", link: "/"
        }, {
            text: "Medicine", link: "/"
        }, {
            text: "Sports & Outdoor", link: "/"
        }, {
            text: "Baby’s & Toys", link: "/"
        }, {
            text: "Groceries & Pets", link: "/"
        }, {
            text: "Health & Beauty", link: "/"
        }
    ]
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8, delay: 0.3
            }}
            className='w-1/3 md:border-r gap-3  px-2  flex flex-col items-center justify-center '>
            {
                fastLinks.map((el, index) => {
                    return <Link key={index} href={el.link}
                        className={` w-full px-4 py-2 ${index === fastLinks.length - 1 ? "" : "border-b border-primary"} `}
                    >    {el.text}
                    </Link>
                })
            }
        </motion.div>

    )
}

export default FastLinks