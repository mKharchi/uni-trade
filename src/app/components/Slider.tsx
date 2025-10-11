"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slides = [
        {
            id: 1,
            title: "Summer Collection 2024",
            subtitle: "Up to 50% OFF",
            description: "Discover the latest trends in fashion",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
            cta: "Shop Now",
            bgGradient: "from-orange-500 to-pink-500"
        },
        {
            id: 2,
            title: "Electronics Sale",
            subtitle: "Latest Tech Deals",
            description: "Upgrade your gadgets today",
            image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop",
            cta: "Explore",
            bgGradient: "from-blue-500 to-purple-500"
        },
        {
            id: 3,
            title: "Home & Lifestyle",
            subtitle: "New Arrivals",
            description: "Transform your living space",
            image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=400&fit=crop",
            cta: "Discover",
            bgGradient: "from-green-500 to-teal-500"
        }
    ];

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="min-h-full w-full rounded relative overflow-hidden group"
        >   {/* Slides Container */}
            <div
                className="flex min-h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="min-w-full min-h-full relative"
                    >
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-70`}></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-center items-start p-8 md:px-16 lg:px-24 text-white">
                            <h3 className="text-sm md:text-base font-medium mb-2 opacity-90">
                                {slide.subtitle}
                            </h3>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                {slide.title}
                            </h2>
                            <p className="text-base md:text-lg mb-6 opacity-90">
                                {slide.description}
                            </p>
                            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                                {slide.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${currentSlide === index
                                ? 'bg-white'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default Slider;