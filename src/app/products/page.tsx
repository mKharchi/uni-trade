"use client";
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../ProductsContext';
import ProductItem from '../components/ProductItem';

import { ChevronDown, X, Search, RotateCcw, Filter } from 'lucide-react'

const FilterSidebar = ({
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    handlePriceChange,
    handleCategoryToggle,
    handleClearFilters,
    handleSortChange,
    isDrawer = false,
    onClose,
}: any) => {
    const [expandedSections, setExpandedSections] = React.useState({
        price: false,
        category: false,
        sort: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const hasActiveFilters = filters.category.length > 0 ||
        filters.price_range.min !== 0 ||
        filters.price_range.max !== 1000;

    return (
        <motion.div
            initial={{ opacity: 0, x: isDrawer ? -20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`mx-auto ${isDrawer ? "w-80 h-full" : "w-80"} bg-white rounded-xl shadow-lg border border-gray-100 p-6`}
        >
            {/* Drawer close button */}
            {isDrawer && (
                <button onClick={onClose} className="absolute  right-4 p-2 rounded-md hover:bg-gray-100">
                    <X size={18} />
                </button>
            )}

            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>Filters</h2>
                {hasActiveFilters && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClearFilters}
                        className='text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 pr-8 px-2 py-1 rounded'
                    >
                        <RotateCcw size={14} />
                        Reset
                    </motion.button>
                )}
            </div>

            {/* Search Bar */}
            <div className='mb-6'>
                <div className='relative'>
                    <Search size={18} className='absolute left-3 top-3 text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search products...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2.5  border-gray-200 rounded-lg focus:outline-none border  focus:border-transparent transition'
                    />
                </div>
            </div>

            <div className='h-px bg-gray-100 mb-6'></div>

            {/* Price Range Section */}
            <div className='mb-6'>
                <button
                    onClick={() => toggleSection('price')}
                    className='flex items-center justify-between w-full mb-4 font-semibold text-gray-900 hover:text-primary transition'
                >
                    <span>Price Range</span>
                    <motion.div
                        animate={{ rotate: expandedSections.price ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={18} />
                    </motion.div>
                </button>

                <motion.div
                    initial={false}
                    animate={{ height: expandedSections.price ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className='overflow-hidden'
                >
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Min: <span className='text-primary font-bold'>${filters.price_range.min}</span>
                            </label>
                            <input
                                type='range'
                                min={0}
                                max={filters.price_range.max}
                                value={filters.price_range.min}
                                onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Max: <span className='text-primary font-bold'>${filters.price_range.max}</span>
                            </label>
                            <input
                                type='range'
                                min={filters.price_range.min}
                                max={1000}
                                value={filters.price_range.max}
                                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary'
                            />
                        </div>

                        <div className='flex gap-2 pt-2'>
                            <input
                                type='number'
                                min={0}
                                max={filters.price_range.max}
                                value={filters.price_range.min}
                                onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                                className='flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none '
                            />
                            <input
                                type='number'
                                min={filters.price_range.min}
                                max={1000}
                                value={filters.price_range.max}
                                onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 1000)}
                                className='flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none '
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className='h-px bg-gray-100 mb-6'></div>

            {/* Category Section */}
            <div className='mb-6'>
                <button
                    onClick={() => toggleSection('category')}
                    className='flex items-center justify-between w-full mb-4 font-semibold text-gray-900 hover:text-primary transition'
                >
                    <span>Category</span>
                    <motion.div
                        animate={{ rotate: expandedSections.category ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={18} />
                    </motion.div>
                </button>

                <motion.div
                    initial={false}
                    animate={{ height: expandedSections.category ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className='overflow-hidden'
                >
                    <div className='space-y-2'>
                        {["electronics", "fashion", "home_appliances", "books", "toys"].map(category => (
                            <motion.label
                                key={category}
                                whileHover={{ x: 4 }}
                                className='flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition group'
                            >
                                <input
                                    type='checkbox'
                                    checked={filters.category.includes(category)}
                                    onChange={() => handleCategoryToggle(category)}
                                    className='w-4 h-4 rounded border-gray-300 text-primary focus:ring-blue-500 cursor-pointer'
                                />
                                <span className='text-sm text-gray-700 group-hover:text-gray-900 capitalize'>
                                    {category.replace(/_/g, ' ')}
                                </span>
                                {filters.category.includes(category) && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className='ml-auto'
                                    >
                                        <X size={14} className='text-primary' />
                                    </motion.div>
                                )}
                            </motion.label>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className='h-px bg-gray-100 mb-6'></div>

            {/* Sort Section */}
            <div>
                <button
                    onClick={() => toggleSection('sort')}
                    className='flex items-center justify-between w-full mb-4 font-semibold text-gray-900 hover:text-primary transition'
                >
                    <span>Sort By</span>
                    <motion.div
                        animate={{ rotate: expandedSections.sort ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={18} />
                    </motion.div>
                </button>

                <motion.div
                    initial={false}
                    animate={{ height: expandedSections.sort ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className='overflow-hidden'
                >
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none  text-sm'
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price_low_to_high">Price: Low to High</option>
                        <option value="price_high_to_low">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="oldest">Oldest Arrivals</option>
                    </select>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Page = () => {
    const { products } = useProducts();
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [shown_products, setShown_products] = React.useState<any[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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

    // prevent body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isDrawerOpen]);

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
    }, [products, filters, searchTerm]);

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
            className='w-full flex relative  sm:min-h-screen items-start justify-center   gap-8 '
        >
            {/* Mobile filter button */}
            <div className="w-full absolute top-0 z-10 flex items-center justify-between px-2 lg:hidden">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="
                     
                    flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow text-sm"
                >
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Desktop sidebar (hidden on small screens) */}
            <div className="hidden lg:block">
                <FilterSidebar
                    handleClearFilters={handleClearFilters}
                    handleSortChange={handleSortChange}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    handlePriceChange={handlePriceChange}
                    handleCategoryToggle={handleCategoryToggle}
                />
            </div>

            {/* Products grid */}
            <div className='w-full mt-12 lg:mt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4'>
                {shown_products && shown_products.length > 0 ? (
                    shown_products.map((product: any) => (
                        <ProductItem key={product.id} {...product} />
                    ))
                ) : (
                    <p className='text-gray-600'>No products found.</p>
                )}
            </div>

            {/* Drawer + backdrop for mobile */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setIsDrawerOpen(false)}
                        />
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed left-0 top-0 z-50 h-full"
                        >
                            <FilterSidebar
                                isDrawer
                                onClose={() => setIsDrawerOpen(false)}
                                handleClearFilters={handleClearFilters}
                                handleSortChange={handleSortChange}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filters={filters}
                                setFilters={setFilters}
                                handlePriceChange={handlePriceChange}
                                handleCategoryToggle={handleCategoryToggle}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Page