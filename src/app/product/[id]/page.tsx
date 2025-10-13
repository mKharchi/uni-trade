"use client";
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/home-components/Navbar';
import ProductItem from '@/app/components/ProductItem';
import { useProducts } from '@/app/ProductsContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { set } from 'zod';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
};

const page = (props: Props) => {
    const params = React.use(props.params);
    const { id } = params;
    const { getProduct, getRelatedProducts } = useProducts();
    const [product, setProduct] = React.useState<any>(null);
    const [real_product, setRealProduct] = React.useState<any>(null);
    const [relatedProducts, setRelatedProducts] = React.useState<any[]>([]);
    const [image, setImage] = useState("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    useEffect(() => {
        const fetchProduct = async () => {
            const product_temp = await getProduct(id);
            setProduct(product_temp.product);
            setRealProduct(product_temp.real);
            setImage(product_temp.product?.image ? product_temp.product.image[0] : null);
            const related = await getRelatedProducts(id);
            setRelatedProducts(related);
        };
        fetchProduct();
    }, [id, getProduct]);

    const [quantity, setQuantity] = useState(1);
    if (!product) {
        return <div>Loading...</div>;
    }
    return (
        <div className='w-full min-h-screen flex flex-col items-center justify-start'>
            <div className='px-4 py-2 max-w-7xl flex flex-col items-center justify-start gap-4 w-full'>
                <Navbar />
                <div className='w-full  flex  flex-col md:flex-row items-start justify-center gap-4'>
                    <div className='w-full  flex  flex-col md:flex-row-reverse items-start justify-center gap-4'>

                        <div className=' rounded-lg border overflow-hidden w-150  h-auto flex items-center justify-center bg-gray-200'>
                            {product?.image ? <Image src={image} width={1024} height={1024} alt='product-image' /> : <div>No Image Available</div>}
                        </div>
                        <div className=' flex flex-col  items-center justify-start gap-4'>
                            {product?.image && product.image.length > 1 ? product.image.map((img: string, index: number) => (
                                <div key={index} className='w-26 h-30 rounded-lg border overflow-hidden flex items-center justify-center '>
                                    <Image onClick={() => setImage(img)} className='object-center object-cover w-full h-auto' src={img} width={80} height={80} alt={`product-image-${index}`} />
                                </div>
                            )) : <div>No Additional Images</div>}
                        </div>

                    </div>
                    <div className='w-full flex flex-col items-start justify-start gap-6'>
                        <h1 className='text-5xl font-bold'>{product?.name || "Unnamed Product"}</h1>
                        <p className='text-2xl '> ${product?.price?.toFixed(2) || "N/A"}</p>
                        <p className='text-gray-600'>{product?.description || "No description available."}</p>
                        <hr className='w-full border border-primary ' />
                        {
                            product?.sizes && product.sizes.length > 0 ? <div className='w-full flex flex-col items-start justify-center gap-4'>
                                <h2>Choose Size</h2>
                                <div className='flex gap-4'>
                                    {product.sizes.map((size: string, index: number) => (
                                        <button className={`py-2 px-4 cursor-pointer border border-primary rounded-full ${selectedSize === size ? 'bg-primary text-white' : 'bg-secondary text-primary'}`} key={index} value={size} onClick={() => setSelectedSize(size)}>{size}</button>
                                    ))}
                                </div>

                            </div> : null
                        }
                        <hr className='w-full border border-primary ' />
                        <div className='w-full flex  items-center justify-between gap-1'>
                            <div className={` flex items-center px-3 text-3xl border border-primary rounded-full bg-secondary justify-center gap-2' ${!selectedSize ? 'opacity-50 ' : ''}`}>
                                <button disabled={!selectedSize} onClick={() => setQuantity(quantity - 1)} className='px-2 cursor-pointer  py-1'>-</button>
                                <span className=' px-6 text-xl '>{quantity}</span>
                                <button disabled={!selectedSize} onClick={() => setQuantity(quantity + 1)} className='px-2 cursor-pointer  py-1 '>+</button>
                            </div>

                            <button className='px-4 cursor-pointer py-2 bg-primary w-full  rounded-full text-white text-xl  transition'>Add to Cart</button>
                            {
                                product?.isExchangeable ? <button className='px-2 cursor-pointer py-2 border border-primary w-full  rounded-full text-primary text-lg  transition'>Request Exchange</button> : null
                            }
                        </div>
                        <hr className='w-full border border-primary ' />
                        <div className='w-full flex flex-col items-start justify-center gap-2'>
                            <h2 className='text-2xl font-semibold'>Seller Information</h2>
                            <p className='text-gray-600'>{real_product?.owner.firstName} {real_product?.owner.lastName} ( {real_product?.owner.phone} ) </p>
                            <p className='text-gray-600'>{real_product?.owner.university}</p>
                            <p className='text-gray-600'>Member since {real_product?.owner.createdAt.toString().split("T")[0].split("-")[0]}</p>
                        </div>
                        
                    </div>
                </div>
                {/**Related products */}
                <hr className='w-full my-4 border border-primary ' />
                <h2 className='text-3xl font-semibold text-center w-full'>You might also like</h2>
                <div className='w-full my-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {/**Related products */}
                    {relatedProducts.map((relatedProduct) => (
                        <ProductItem key={relatedProduct?.name} {...relatedProduct} />
                    ))}
                </div>


            </div>
            <Footer />
        </div>
    );
};

export default page;