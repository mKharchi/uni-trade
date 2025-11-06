"use client";
import { useAuth } from '@/app/AuthContext'
import ProductItem from '@/app/components/ProductItem';
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'



const page = () => {
    const { favourites, loading } = useAuth()


    return (
        <div className='w-full p-1  bg-gray-50 rounded-xl'>
            {loading ?
                <Loader2 />
                : favourites?.length > 0 ?
                    <div className='w-full min-h-screen  p-8 rounded-xl bg-white '>

                        <h1 className='text-3xl'>Favourites</h1>
                        <div className="w-full my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {favourites.map((el, index) => <ProductItem {...el} key={index} />)}
                        </div>
                    </div>

                    : <div className='w-full min-h-screen flex p-8 gap-4 rounded-xl bg-white flex-col items-center justify-center'>
                        <h1 className='w-full text-center text-xl'>Your favourites list is empty.</h1>
                        <button className='px-4 py-3 bg-primary text-background rounded' onClick={() => redirect("/")}>Go back home</button>

                    </div>

            }
        </div>

    )
}

export default page