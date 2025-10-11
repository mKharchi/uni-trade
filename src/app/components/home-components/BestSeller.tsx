"use client";
import { useProducts } from '@/app/ProductsContext'
import React from 'react'
import Title from './Title';
import ProductItem from '../ProductItem';

const BestSeller = () => {
    const { bestSeller } = useProducts()
    return (
        <div className='w-full my-4 flex gap-3 flex-col '>
            <Title title='This Month' />
            <h1 className='text-2xl mb-6 font-semibold'>Best Selling Products</h1>
            <div className='w-full flex items-center justify-between'>
                {
                    bestSeller.map((el, index) => <ProductItem key={index} {...el} />)
                }
            </div>
        </div>
    )
}

export default BestSeller