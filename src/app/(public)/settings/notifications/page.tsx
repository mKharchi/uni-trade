"use client";
import { useAuth } from '@/app/AuthContext'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const NotificationBox = (props)=>{
    return <div className='w-full py-2 px-4 hover:bg-background/80'></div>
}


const page = () => {
    const { notifications, loading } = useAuth()


    return (
        <div className='w-full p-1 bg-gray-50 rounded-xl'>
            {loading ?
                <Loader2 />
                : notifications?.length > 0 ?
                <div className='w-full flex p-8 rounded-xl bg-white flex-col items-center justify-start'>
                    {notifications.map((el , index)=><NotificationBox {...el} key={index} />)}
                </div>
                
                : <div className='w-full flex p-8 gap-4 rounded-xl bg-white flex-col items-center justify-center'>
                    <h1 className='w-full text-center text-xl'>No notification at the moment.</h1>
                    <button className='px-4 py-3 bg-primary text-background rounded' onClick={()=>redirect("/")}>Go back home</button>

                </div> 

            }
        </div>

    )
}

export default page