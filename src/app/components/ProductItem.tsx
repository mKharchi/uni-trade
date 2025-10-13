import { Eye, Heart, Star } from 'lucide-react'
import Image from 'next/image'
import React, { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
    id: number, image: string[], name: string, description: string, price: number, rating: number
}

const ProductItem = (props: Props) => { // Placeholder for navigation hook
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className='w-75 hover:scale-105 hover:shadow-xl  transition-all duration-200 bg-secondary/60 border border-gray-300 overflow-hidden rounded-xl shadow-lg relative flex flex-col justify-start '>

            <div className='absolute flex flex-col items-center justify-start gap-2   p-2 right-3 top-3 
         text-primary'>

                <div className="p-2 rounded-full bg-secondary/60 " >  <Heart size={20} /></div>
                <Link href={`/product/${props.id}`} className="p-2 rounded-full bg-secondary/60 " >                <Eye size={20} /></Link>

            </div>
            <div className='w-full overflow-hidden object-cover'>
                <Image width={512} height={512} src={props.image[0]} alt='product-image' className='w-full min-h-60 object-cover ' />

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

        </motion.div>
    )
}

export default ProductItem