import React, { Component, ReactNode } from 'react'
import Title from './Title'
import Link from 'next/link'
import { Camera, Computer, Gamepad, Headphones, Phone, Watch } from 'lucide-react'

const CatgeoryBox = ({
    label
    , icon
    , link
}: {
    label: string,
    icon: ReactNode | null,
    link: string,
}) => {
    return <button className='flex cursor-pointer flex-col items-center w-40 justify-center transition-colors duration-300 py-8 border rounded border-primary gap-2 text-primary hover:text-white hover:bg-primary'>
        {icon}
        <Link href={link} className='text-lg '>{label}</Link>
    </button>

}

const Categories = () => {
    /**
     * Phones
Computers
SmartWatch
Camera
HeadPhones
Gaming
     */
    const categories = [{
        label: "Phones", icon: <Phone />
        , link: ""
    }, {
        label: "Computers", icon: <Computer />
        , link: ""
    }, {
        label: "SmartWatch", icon: <Watch />
        , link: ""
    }, {
        label: "Camera", icon: <Camera />
        , link: ""
    }, {
        label: "HeadPhones", icon: <Headphones />
        , link: ""
    }, {
        label: "Gaming", icon: <Gamepad />
        , link: ""
    },]
    return (
        <div className='w-full my-4 flex gap-3 flex-col '>
            <Title title='Categories' />
            <h1 className='text-2xl mb-6 font-semibold'>Browse By Category</h1>
            <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 place-items-center gap-4 items-center justify-between'>
                {
                    categories.map((el, index) => <CatgeoryBox {...el} key={index} />)
                }
            </div>
        </div>
    )
}

export default Categories