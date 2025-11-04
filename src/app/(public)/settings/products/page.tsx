"use client";
import { useAuth } from '@/app/AuthContext'
import ProductItem from '@/app/components/ProductItem'
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

/**
 * 
 * name
description
category
subcategory
price
is_exchangeable
 */

const categories = []
const subcategories = []
const AddProduct = () => {
  const [form, setForm] = useState({
    name: ""
    , description: ""
    , category: ""
    , subcategory: ""
    , price: ""
    , is_exchangeable: ""
  })
  return <div className='w-full max-w-5xl flex flex-col justify-start items-start gap-3'>
    <h1>Add a product</h1>
    <form>

    </form>
  </div>


}

const page = () => {
  const [formOpen, setFormOpen] = useState(false)

  const { userProducts, fetchUserProducts, loading } = useAuth()
  let shown_products = userProducts.slice()
  return (
    <div className='w-full'>
      {
        loading ? <Loader2 /> :
          shown_products && shown_products.length > 0 ? (
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4'>
              {shown_products.map((product: any) => (
                <ProductItem  {...product} />
              ))}</div>
          ) : (<div className='w-full flex flex-col items-center justify-center gap-4'>
            <p className='text-gray-600 w-full mt-10 text-xl  text-center'>No products found.</p>
            <button className='px-4 py-2 mx-auto bg-primary text-background rounded hover:bg-primary/80 cursor-pointer '>
              + Add rpoducts
            </button>
          </div>)
      }
      {
        formOpen && <AddProduct />
      }
    </div>

  )
}

export default page