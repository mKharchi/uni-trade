"use client";
import React from 'react'
import { motion } from 'framer-motion'
type Props = {
    title: string
}

const Title = (props: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            exit={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.5 }}

            className='w-full flex items-center justify-start my-4'>
            <div className='flex border border-primary rounded-l overflow-hidden items-stretch'>
                <div className='bg-primary w-6 flex-shrink-0' />
                <h1 className='text-lg text-primary px-2 py-1.5 bg-secondary '>
                    {props.title}
                </h1>
            </div>
        </motion.div>
    )
}

export default Title