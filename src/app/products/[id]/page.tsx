"use client";
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/home-components/Navbar';
import ProductItem from '@/app/components/ProductItem';
import { useProducts } from '@/app/ProductsContext';
import { motion } from 'framer-motion';
import { loadComponents } from 'next/dist/server/load-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";


type Props = {
    params: Promise<{ id: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
};

const page = (props: Props) => {
    const defaultSizes = ["Small", "Medium", "Large"];
    const params = React.use(props.params);
    const { id } = params;
    const { getProduct, getRelatedProducts, loading, defaultImages } = useProducts();
    const [product, setProduct] = React.useState<any>(null);
    const [relatedProducts, setRelatedProducts] = React.useState<any[]>([]);
    const [image, setImage] = useState("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    useEffect(() => {
        const fetchProduct = async () => {
            const product_temp = await getProduct(id);
            if (product_temp) {
                setProduct(product_temp.product);
                setImage(product_temp.product?.image?.[0] || defaultImages[0]);
                const related = await getRelatedProducts(id);
                setRelatedProducts(related);
            }
        };
        fetchProduct();
    }, [id]);

    const [quantity, setQuantity] = useState(1);

    return loading ? <div className='w-full h-screen flex items-center justify-center'><ClipLoader /></div> : (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            exit={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='w-full flex flex-col items-center justify-start gap-4 py-4'
        >
            <div className='w-full  flex  flex-col md:flex-row items-start justify-center gap-4'>



                <div className='w-full  flex  flex-col md:flex-row-reverse items-center md:items-start  justify-center gap-4'>

                    <div className=' rounded-lg border overflow-hidden w-80 md:w-100  xl:w-150  h-auto flex items-center justify-center bg-gray-200'>
                        {product?.image ? <Image src={image} width={1024} height={1024} alt='product-image' /> :
                            <Image src={defaultImages[0]} width={1024} height={1024} alt='default-product-image' />
                        }
                    </div>
                    <div className=' flex md:flex-col  items-center justify-center md:justify-start gap-4'>
                        {product?.image && product.image.length > 1 ? product.image.map((img: string, index: number) => (
                            <div key={index} className='w-15 h-20 md:w-26 md:h-30 rounded-lg border overflow-hidden flex items-center justify-center '>
                                <Image onClick={() => setImage(img)} className='object-center object-cover w-full h-auto' src={img} width={80} height={80} alt={`product-image-${index}`} />
                            </div>
                        )) : defaultImages.map((img: string, index: number) => (
                            <div key={index} className='w-15 h-20 md:w-26 md:h-30 rounded-lg border overflow-hidden flex items-center justify-center '>
                                <Image onClick={() => setImage(img)} className='object-center object-cover w-full h-auto' src={img} width={80} height={80} alt={`product-image-${index}`} />
                            </div>
                        ))}
                    </div>

                </div>
                <div className='w-full flex flex-col items-start justify-start gap-2 xl:gap-6'>
                    <h1 className='text-2xl xl:text-5xl font-bold'>{product?.name || "Unnamed Product"}</h1>
                    <p className=' text-lg xl:text-2xl '> ${product?.price?.toFixed(2) || "N/A"}</p>
                    <p className='text-gray-600'>{product?.description || "No description available."}</p>
                    {
                        product?.sizes && product.sizes.length > 0 ? <div className='w-full mb-3 flex flex-col items-start justify-center gap-4'>
                            <hr className='w-full my-4 border border-primary ' />
                            <h2 >Choose Size</h2>
                            <div className='flex  gap-4'>
                                {product.sizes.map((size: string, index: number) => (
                                    <button className={`py-2 px-4 cursor-pointer border border-primary rounded-full ${selectedSize === size ? 'bg-primary text-white' : 'bg-secondary/60 text-primary'}`} key={index} value={size} onClick={() => setSelectedSize(size)}>{size}</button>
                                ))}
                            </div>

                        </div> : <div className='w-full mb-3 flex flex-col items-start justify-center gap-4'>
                            <hr className='w-full  border border-primary ' />
                            <h2 >Choose Size</h2>
                            <div className='flex  gap-4'>
                                {defaultSizes.map((size: string, index: number) => (
                                    <button className={`py-2 px-4 cursor-pointer border border-primary rounded-full ${selectedSize === size ? 'bg-primary text-white' : 'bg-secondary/60 text-primary'}`} key={index} value={size} onClick={() => setSelectedSize(size)}>{size}</button>
                                ))}
                            </div>
                        </div>
                    }
                    <hr className='w-full border border-primary ' />
                    <div className='w-full flex  items-center justify-between gap-4'>
                        <div className={` flex items-center px-3 text-3xl border border-primary rounded-full bg-secondary/60 justify-center gap-2' ${!selectedSize ? 'opacity-50 ' : ''}`}>
                            <button disabled={!selectedSize} onClick={() => setQuantity(quantity - 1)} className='px-2 cursor-pointer  py-1'>-</button>
                            <span className=' px-6 text-xl '>{quantity}</span>
                            <button disabled={!selectedSize} onClick={() => setQuantity(quantity + 1)} className='px-2 cursor-pointer  py-1 '>+</button>
                        </div>

                        <button className='px-4 cursor-pointer py-2 bg-primary w-full  rounded-full text-white text-xl  transition'>Add to Cart</button>

                    </div>
                    <hr className='w-full my-4 border border-primary ' />
                    <div className='w-full flex flex-col items-start justify-center gap-2'>
                        <div className='w-full flex md:flex-row flex-col gap-2 md:items-center md:justify-between'>

                            <h2 className='text-xl xl:text-2xl font-semibold'>Seller Information</h2>

                            {
                                product?.is_exchangeable ? <button className='xl:px-4 px-2 py-1 bg-primary text-white hover:bg-secondary/80 hover:text-primary cursor-pointer xl:py-2 border border-primary shadow  rounded-full  text-lg  transition'>Request Exchange</button> : null
                            }
                        </div>
                        <p className='text-gray-600'>{product?.owner.firstName} {product?.owner.lastName} ( {product?.owner.phone} ) </p>
                        <p className='text-gray-600'>{product?.owner.university}</p>
                        <p className='text-gray-600'>Member since {product?.owner.createdAt.toString().split("T")[0].split("-")[0]}</p>
                    </div>

                </div>

                {/**Related products */}

            </div>
            <hr className='w-full my-4 border border-primary ' />
            <h2 className='text-3xl font-semibold text-center w-full'>You might also like</h2>
            <div className='w-full my-3 grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {/**Related products */}
                {relatedProducts.map((relatedProduct) => (
                    <ProductItem key={relatedProduct?.name} {...relatedProduct} />
                ))}
            </div>

        </motion.div >
    );
};

export default page;