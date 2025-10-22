"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
const ContactPage: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | "success" | "error">(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setError(null);

        try {
            // replace /api/contact with your real endpoint
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Failed to send message");
            }

            setStatus("success");
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (err: any) {
            setStatus("error");
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.main
        
        className="w-full  mx-auto px-4 py-12">
            <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4">Contact Us</motion.h1>
            <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            
            className="text-gray-600 mb-8">
                Have a question or need help? Send us a message and we'll get back to you as soon as possible.
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <motion.section
                
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                className="bg-white border rounded-lg p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Subject (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={6}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Your message..."
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow hover:opacity-95 disabled:opacity-60"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                            {status === "success" && (
                                <span className="text-sm text-green-600">Message sent. We'll reply soon.</span>
                            )}
                            {status === "error" && (
                                <span className="text-sm text-red-600">{error || "Failed to send message."}</span>
                            )}
                        </div>
                    </form>
                </motion.section>

                {/* Contact details */}
                <aside className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white border rounded-lg p-6 shadow-sm"
                    >   <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                        <p className="text-gray-700">Unitrade — Campus Marketplace</p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li>
                                <strong>Address:</strong> 123 University Ave, City
                            </li>
                            <li>
                                <strong>Phone:</strong> +1 (555) 123-4567
                            </li>
                            <li>
                                <strong>Email:</strong> support@unitrade.example
                            </li>
                            <li>
                                <strong>Hours:</strong> Mon — Fri, 9:00 AM — 6:00 PM
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white border rounded-lg p-0 overflow-hidden shadow-sm"
                    >
                        {/* simple responsive placeholder map */}
                        <iframe
                            title="Unitrade location"
                            src="https://www.google.com/maps?q=university&output=embed"
                            className="w-full h-56 border-0"
                            loading="lazy"
                        />
                    </motion.div>

                    <div className="text-sm text-gray-500">
                        Prefer social? Reach out to us on our social channels and we'll respond quickly.
                    </div>
                </aside>
            </div>
        </motion.main>
    );
};

export default ContactPage;