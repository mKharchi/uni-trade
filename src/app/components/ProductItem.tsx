import { Eye, Heart, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    image: string, name: string, description: string, price: number, rating: number
}

const ProductItem = (props: Props) => {


    return (
        <div className='w-75 hover:scale-105 hover:shadow-xl  transition-all duration-200 bg-secondary/60 border border-gray-300 overflow-hidden rounded-xl shadow-lg relative flex flex-col justify-start '>

            <div className='absolute flex flex-col items-center justify-start gap-2   p-2 right-3 top-3 
         text-primary'>

                <div className="p-2 rounded-full bg-secondary/60 " >  <Heart size={20} /></div>
                <div className="p-2 rounded-full bg-secondary/60 " >                <Eye size={20} /></div>

            </div>
            <div className='w-full overflow-hidden object-cover'>
                <Image width={512} height={512} src={props.image} alt='product-image' className='w-full min-h-60 object-cover ' />

            </div>
            <div
                className='w-full text-primary px-8 gap-1 py-4 flex flex-col items-start justify-between'
            >
                <h1 className='text-xl '>{props.name}</h1>
                <span className='font-bold'>${props.price}</span>
                <div className='flex items-center justify-start gap-2'>
                    {
                        new Array(props.rating).fill(1).map((item, index) => <Star key={index} size={15} className='' fill='' />)
                    }
                </div>
            </div>

        </div>
    )
}

export default ProductItem