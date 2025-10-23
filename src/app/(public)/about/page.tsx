"use client";
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const page: React.FC = () => {
    return (
        <motion.main
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full max-w-6xl mx-auto px-4 py-12"
        >
            {/* Hero */}
            <motion.section variants={fadeUp} className="text-center mb-10">
                <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-2">
                    About Unitrade
                </motion.h1>
                <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto">
                    Unitrade is a student-first marketplace where campus communities swap, sell, and discover quality items safely and easily.
                </motion.p>
            </motion.section>

            {/* Mission / Vision / Values */}
            <motion.section variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div variants={fadeUp} className="bg-white rounded-lg p-6 shadow">
                    <h3 className="font-semibold mb-2">Our Mission</h3>
                    <p className="text-sm text-gray-700">
                        To empower students to exchange goods and resources within a trusted campus network, reducing waste and saving money.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white rounded-lg p-6 shadow">
                    <h3 className="font-semibold mb-2">Our Vision</h3>
                    <p className="text-sm text-gray-700">
                        A connected campus where every item finds a new home and every student can access what they need.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white rounded-lg p-6 shadow">
                    <h3 className="font-semibold mb-2">Our Values</h3>
                    <p className="text-sm text-gray-700">
                        Trust, simplicity, sustainability — we design features that keep transactions safe and fair for everyone.
                    </p>
                </motion.div>
            </motion.section>

            {/* How it works */}
            <motion.section variants={fadeUp} className="mb-12">
                <motion.h2 variants={fadeUp} className="text-xl font-semibold mb-4">How it works</motion.h2>
                <motion.ol variants={containerVariants} initial="hidden" animate="show" className="list-decimal list-inside space-y-3 text-gray-700">
                    {[
                        'Create an account and list your item with photos and details.',
                        'Browse or search campus listings and contact sellers securely.',
                        'Swap, buy, or sell — leave feedback to build trust in the community.',
                    ].map((step, i) => (
                        <motion.li key={i} variants={fadeUp} className="pl-1">
                            {step}
                        </motion.li>
                    ))}
                </motion.ol>
            </motion.section>

            {/* Team */}
            <motion.section variants={fadeUp} className="mb-12">
                <motion.h2 variants={fadeUp} className="text-xl font-semibold mb-4">Meet the team</motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }} variants={fadeUp} className="flex items-center gap-4 bg-white p-4 rounded shadow">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">A</div>
                        <div>
                            <div className="font-medium">Adonis (Founder)</div>
                            <div className="text-sm text-gray-600">Product & Growth</div>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }} variants={fadeUp} className="flex items-center gap-4 bg-white p-4 rounded shadow">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">M</div>
                        <div>
                            <div className="font-medium">Martha (Lead Dev)</div>
                            <div className="text-sm text-gray-600">Platform & Features</div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section variants={fadeUp} className="text-center">
                <motion.p variants={fadeUp} className="text-gray-700 mb-4">
                    Want to get involved or have questions? We’d love to hear from you.
                </motion.p>
                <motion.a
                    variants={fadeUp}
                    href="/contact"
                    whileHover={{ scale: 1.03 }}
                    className="inline-block px-5 py-3 bg-primary text-white rounded-md shadow hover:brightness-95"
                >
                    Contact Us
                </motion.a>
            </motion.section>
        </motion.main>
    );
};

export default page;