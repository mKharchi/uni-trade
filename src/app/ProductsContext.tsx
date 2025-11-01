"use client";
import { createContext, useState, useContext, useCallback, useEffect } from "react";
import { toast } from 'react-toastify';

// Define context type for better TypeScript support
type ProductsContextType = {
    latestArrivals: any[];
    setLatestArrivals: React.Dispatch<React.SetStateAction<any[]>>;
    bestSeller: any[];
    setBestSeller: React.Dispatch<React.SetStateAction<any[]>>;
    products: any[];
    setproducts: React.Dispatch<React.SetStateAction<any[]>>;
    getProduct: (id: string) => Promise<any>;
    getRelatedProducts: (id: string) => Promise<any[]>;
    loading: boolean
    defaultImages: string[]
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [latestArrivals, setLatestArrivals] = useState<any[]>([{
        id: 3, image: ["/test.png"], name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }]);

    const [bestSeller, setBestSeller] = useState<any[]>([{
        id: 3, image: ["/test.png"], name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }]);


    const [products, setproducts] = useState<any[]>([{


        isExchangeable: true, id: 3, image: ["/test.png", "/test.png", "/test.png", "/test.png",], sizes: ["Small", "Medium", "Large"], name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }]);

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products');
            const data = await response.json();
            if (data.success) {
                setproducts(data.products);
                console.log(data.products);

            } else {
                toast.error(data.message || "Failed to fetch products");
            }
        } catch (error) {
            toast.error("An error occurred while fetching products");
        } finally {
            setLoading(false)
        }
    };
    const getProduct = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products/${id}`);
            const data = await response.json();

            if (data.success) {
                console.log(data.product);

                return { product: data.product };
            } else {
                toast.error(data.message || "Failed to fetch product");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }// No dependencies

    const getRelatedProducts = async (id: string) => {
        // Fetch related products by ID logic here
        // const response = await fetch(`/api/products/related/${id}`);
        // const data = await response.json();
        // if (data.success) {
        //     return products.slice(1, 5);
        // } else {
        //     toast.error(data.message || "Failed to fetch related products");
        // }

        return products.slice(0, 5);
    }
    useEffect(() => {
        fetchProducts();
    }, []);
    const defaultImages = ["/test.png", "/test.png", "/test.png", "/test.png",];
    return (
        <ProductsContext.Provider value={{ latestArrivals, setLatestArrivals, bestSeller, setBestSeller, products, setproducts, getProduct, getRelatedProducts, loading, defaultImages}}>
            {children}
        </ProductsContext.Provider>
    );
};

// Custom hook for easy access
export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
};