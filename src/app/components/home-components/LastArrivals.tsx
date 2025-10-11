"use client";
import React from 'react'
import Title from './Title'
import { useProducts } from '@/app/ProductsContext'
import ProductItem from '../ProductItem';

const LastArrivals = () => {
  const { latestArrivals } = useProducts()

  return (
    <div className='w-full my-4 flex gap-3 flex-col '>
      <Title title='Today’s selection' />
      <div className='w-full flex items-center justify-between'>
        {
          latestArrivals.map((el , index)=><ProductItem key={index} {...el} />)
        }
      </div>
      <button className='px-6 cursor-pointer w-fit mx-auto my-6 py-2 rounded border border-primary text-center text-primary bg-secondary/60'>
          View All Products
      </button>
    </div>
  )
}

export default LastArrivals