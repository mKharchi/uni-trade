"use client";
import React, { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '../ProductsContext';
import ProductItem from '../components/ProductItem';


const FilterSidebar = ({ searchTerm, setSearchTerm, filters, setFilters , handlePriceChange, handleCategoryToggle  ,handleClearFilters , handleSortChange} : { searchTerm: string, setSearchTerm: React.Dispatch<React.SetStateAction<string>>, filters: any, setFilters: React.Dispatch<React.SetStateAction<any>>, handlePriceChange: (type: 'min' | 'max', value: number) => void, handleCategoryToggle: (category: string) => void, handleClearFilters: () => void, handleSortChange: (sortBy: string) => void }) => {
    return (            <div className='bg-secondary/20 border-primary w-150 flex flex-col items-start justify-start gap-4 p-4 border rounded'>
                
                {/* Search Bar */}
                <div className='w-full mb-4'>
                    <input
                        type='text'
                        placeholder='Search products...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full border border-primary rounded p-2 bg-secondary/60 text-primary'
                    />
                </div>
                {/** Filters Section */}
                <h2 className='text-lg font-semibold text-primary'>Filters</h2>
                <div className='w-full flex flex-col items-start justify-start gap-4'>
                    <div className='w-full flex items-center gap-6'>
                        <div className='w-full flex flex-col items-start justify-start gap-2'>
                            <label className='text-primary font-medium'>Min Price: ${filters.price_range.min}</label>
                            <input 
                                type='number' 
                                min={0} 
                                max={filters.price_range.max} 
                                value={filters.price_range.min} 
                                onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                                className='w-full rounded bg-white p-2 text-center' 
                            />
                        </div>
                        <div className='w-full flex flex-col items-start justify-start gap-2'>
                            <label className='text-primary font-medium'>Max Price: ${filters.price_range.max}</label>
                            <input 
                                type='number' 
                                min={filters.price_range.min} 
                                max={1000} 
                                value={filters.price_range.max} 
                                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                                className='w-full rounded bg-white p-2 text-center' 
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-col items-start justify-start gap-2'>
                        <label className='text-primary font-medium'>Category:</label>
                        <div className='w-full grid grid-cols-2 rounded p-2 gap-2 text-primary'>
                            {["electronics", "fashion", "home_appliances", "books", "toys"].map(category => (
                                <button 
                                    key={category} 
                                    className={`w-full cursor-pointer text-left p-2 border ${
                                        filters.category.includes(category) 
                                            ? "bg-primary text-white" 
                                            : "bg-white text-primary"
                                    }`}
                                    onClick={() => handleCategoryToggle(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='w-full flex flex-col items-start justify-start gap-2'>
                        <label className='text-primary font-medium'>Sort By:</label>
                        <select 
                            value={filters.sortBy} 
                            onChange={(e) => handleSortChange(e.target.value)}
                            className='w-full border border-primary rounded p-2 bg-secondary/60 text-primary'
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price_low_to_high">Price: Low to High</option>
                            <option value="price_high_to_low">Price: High to Low</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="oldest">Oldest Arrivals</option>
                        </select>
                    </div>
                </div>
                <button 
                    onClick={handleClearFilters}
                    className='w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition'
                >
                    Clear Filters
                </button>
            </div>
)
}
const page = () => {
    const { products } = useProducts();
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [shown_products, setShown_products] = React.useState<any[]>([]);
    const [filters, setFilters] = React.useState<{
        price_range: {
            min: number; max: number
        };
        category: string[];
        sortBy: 'relevance' | 'price_low_to_high' | 'price_high_to_low' | 'newest' | 'oldest';
    }>({
        price_range: {
            min: 0, max: 1000
        },
        category: [],
        sortBy: 'relevance'
    })

    // Filter and sort products whenever products or filters change
    useEffect(() => {
        let filtered = [...products];
        // Filter by search term
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(term) || 
                product.description.toLowerCase().includes(term)
            );
        }
        // Filter by price range
        filtered = filtered.filter(product => 
            product.price >= filters.price_range.min && 
            product.price <= filters.price_range.max
        );

        // Filter by category
        if (filters.category.length > 0) {
            filtered = filtered.filter(product => 
                filters.category.includes(product?.category.toLowerCase())
            );
        }

        // Sort products
        switch (filters.sortBy) {
            case 'price_low_to_high':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_high_to_low':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
            case 'oldest':
                filtered.sort((a, b) => 
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                break;
            case 'relevance':
            default:
                break;
        }

        setShown_products(filtered);
    }, [products, filters , searchTerm]);

    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        setFilters(prev => ({
            ...prev,
            price_range: {
                ...prev.price_range,
                [type]: value
            }
        }));
    };

    const handleCategoryToggle = (category: string) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category.includes(category)
                ? prev.category.filter(cat => cat !== category)
                : [...prev.category, category]
        }));
    };

    const handleSortChange = (sortBy: any) => {
        setFilters(prev => ({ ...prev, sortBy }));
    };

    const handleClearFilters = () => {
        setFilters({
            price_range: { min: 0, max: 1000 },
            category: [],
            sortBy: 'relevance'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            exit={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='w-full flex flex-col md:flex-row min-h-screen items-start justify-evenly gap-8 my-4'
        >
            {/** Filters side bar */}
            <FilterSidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filters={filters} setFilters={setFilters} handlePriceChange={handlePriceChange} handleCategoryToggle={handleCategoryToggle} />
            {/** Products grid */}
            <div className='w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  place-items-center gap-4'>
                {shown_products && shown_products.length > 0 ? (
                    shown_products.map((product: any) => (
                        <ProductItem key={product.id} {...product} />
                    ))
                ) : (
                    <p className='text-gray-600'>No products found.</p>
                )}
            </div>
        </motion.div>
    )
}

export default page