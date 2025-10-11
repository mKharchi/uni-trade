"use client";
import { createContext, useState, useContext } from "react";

// Define context type for better TypeScript support
type ProductsContextType = {
    latestArrivals: any[];
    setLatestArrivals: React.Dispatch<React.SetStateAction<any[]>>;
    bestSeller: any[];
    setBestSeller: React.Dispatch<React.SetStateAction<any[]>>;
    products: any[];
    setproducts: React.Dispatch<React.SetStateAction<any[]>>;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [latestArrivals, setLatestArrivals] = useState<any[]>([{
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }]);

    const [bestSeller, setBestSeller] = useState<any[]>([{
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }]);
    const [products, setproducts] = useState<any[]>([{
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    }, {
        image: "/test.png", name: "test Product 01", description: "test test test test", price: 500, rating: 5
    },]);

    return (
        <ProductsContext.Provider value={{ latestArrivals, setLatestArrivals, bestSeller, setBestSeller, products, setproducts }}>
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