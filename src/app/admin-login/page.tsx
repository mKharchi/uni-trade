"use client";
import React from "react";
import { motion } from "framer-motion";

const bg =
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop&q=80";

const page = () => {
    return (
        <motion.div
            
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen relative flex items-center justify-center bg-center bg-cover"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Dark overlay */}
            <motion.div
            
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 , delay: 0.2 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

            {/* Decorative shapes */}
           
            {/* Card */}
            <motion.main initial={{ opacity: 0 , y: 20 }} animate={{ opacity: 1 , y: 0 }} transition={{ duration: 0.8 , delay: 0.2 }} className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/95 dark:bg-slate-900/75 dark:text-white rounded-xl shadow-xl border border-white/10 overflow-hidden">
                    <div className="px-8 py-10">
                        <header className="text-center mb-6">
                            <h1 className="text-2xl sm:text-3xl font-semibold">Admin Login</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Sign in to manage the marketplace
                            </p>
                        </header>

                        <form
                            method="post"
                            className="flex flex-col gap-4"
                            aria-label="Admin login form"
                        >
                            <div>
                                <label htmlFor="username" className="text-sm font-medium sr-only">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="Username"
                                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-700"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-700"
                                />
                            </div>

                            

                            <button
                                type="submit"
                                className="mt-2 w-full inline-flex items-center justify-center px-4 py-3 bg-primary text-white rounded-md font-medium shadow hover:brightness-95 transition"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-700/40 text-center text-xs text-gray-500 dark:text-gray-400">
                        By signing in you agree to the admin terms.
                    </div>
                </div>
            </motion.main>
        </motion.div>
    );
};

export default page;