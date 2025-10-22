"use client";
import React from "react";
import { motion } from "framer-motion";

const Slider: React.FC = () => {
    const bg = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop&q=80";

    const container = {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.12, duration: 0.6 } },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="h-full group min-h-120 w-full rounded relative overflow-hidden"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 transition-all duration-300 bg-black/60  group-hover:bg-black/75"
            />

            {/* Content */}
            <motion.div
                variants={fadeUp}
                className="relative z-10 flex min-h-120 w-full flex-col items-center justify-center text-center text-white px-6"
            >
                <motion.h1
                    variants={fadeUp}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
                    transition={{ type: "spring", stiffness: 120 }}
                >
                    Welcome to Unitrade
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    className="text-sm max-w-60 sm:max-w-80 sm:text-base md:text-lg mb-6 opacity-90"
                >
                    your campus marketplace for safe deals and easy exchanges.
                </motion.p>

                <motion.a
                    variants={fadeUp}
                    href="/products"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-block bg-white text-gray-900 px-5 py-3 rounded-md font-semibold shadow hover:opacity-95 transition"
                >
                    Explore more
                </motion.a>
            </motion.div>
        </motion.div>
    );
};

export default Slider;