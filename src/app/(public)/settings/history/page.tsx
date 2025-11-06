"use client";
import { useAuth } from '@/app/AuthContext'
import Title from '@/app/components/home-components/Title'
import ProductItem from '@/app/components/ProductItem'
import { Loader2, X } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion';

const page = () => {

    const { loading, history, removeHistory } = useAuth()
    const shown_products = history.slice()
    return (
        <div className='w-full rounded-xl flex items-start p-1 bg-gray-50 justify-center'>
            <div className='w-full rounded-xl space-y-4 bg-white max-w-5xl p-4 '>
                <h1 className='text-3xl'>History</h1>
                {loading ? (
                    <div className='w-full flex items-center justify-center py-20'>
                        <Loader2 className='animate-spin' size={48} />
                    </div>
                ) : shown_products && shown_products.length > 0 ? (
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {shown_products.map((his: any, index: number) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                                key={index} className='relative w-full'>
                                <span
                                    onClick={() =>  removeHistory(his.id)}
                                    className='absolute cursor-pointer  z-50 flex items-center justify-center top-5 left-5 rounded-full p-2 bg-gray-50'>
                                    <X size={20} />
                                </span>
                                <ProductItem {...his.product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className='w-full flex p-8 gap-4 rounded-xl bg-white flex-col items-center justify-center'>
                        <h1 className='w-full text-center text-xl'>You still haven't ordered or exchanged anything.</h1>
                        <button className='px-4 py-3 bg-primary text-background rounded' onClick={() => redirect("/")}>Go back home</button>

                    </div>

                )}

            </div>
        </div>
    )
}

export default page