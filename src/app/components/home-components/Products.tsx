"use client";
import { useProducts } from '@/app/ProductsContext';
import React from 'react'
import Title from './Title';
import ProductItem from '../ProductItem';

const Products = () => {
    const { products } = useProducts()
    const home_products = products.slice(0, 8)

    return (
        <div className='w-full my-4 flex gap-3 flex-col '>
            <Title title='Our Products' />
            <h1 className='text-2xl mb-6 font-semibold'>Explore Our Products</h1>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center'>
                {
                    home_products.map((el, index) => <ProductItem key={index} {...el} />)
                }
            </div>
            <button className='px-6 w-fit cursor-pointer  mx-auto my-6 py-2 rounded border border-primary text-center text-primary bg-secondary/60'>
                View All Products
            </button>
        </div>
    )
}

export default Products