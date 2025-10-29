"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { redirect } from "next/navigation";
import Input from "../components/Input";

const bg =
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop&q=80";

const page = () => {
    const [formData, setFormData] = React.useState({
        email: "",
        password: ""
    })
    const { loginAdmin, loading } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle admin login logic here
        const result = await loginAdmin(
            formData.email,
            formData.password
        );
        if (result) {
            redirect('/admin/');
        }
    }
    return (
        <motion.div

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen relative flex items-center justify-center bg-center "
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Dark overlay */}
            <motion.div

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

            {/* Decorative shapes */}

            {/* Card */}
            <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/95   rounded-xl shadow-xl border border-white/10 overflow-hidden">
                    <div className="px-8 py-10">
                        <header className="text-center mb-6">
                            <h1 className="text-2xl sm:text-3xl font-semibold">Admin Login</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Sign in to manage the marketplace
                            </p>
                        </header>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div

                                className='w-full  flex items-center justify-center '
                            >
                                <Input

                                    label="Email"
                                    name="email"
                                    key={0}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    type="email"
                                    value={formData.email}
                                />
                            </div>

                            <div
                                className='w-full flex items-center justify-center '
                            >
                                <Input
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    name="password"
                                    type="password"
                                    label="Password"
                                />
                            </div>



                            <button
                                disabled={loading}

                                type="submit"
                                className="mt-2 w-full disabled:bg-primary/20 inline-flex items-center justify-center px-4 py-3 bg-primary text-white rounded-md font-medium shadow hover:brightness-95 transition"
                            >
                                {loading ? "Loading..." : "Sign in"}
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