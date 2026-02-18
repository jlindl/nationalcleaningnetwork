"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image Placeholder - Replace with actual image */}
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/Hero_bg.png"
                    alt="National Cleaning Network Hero"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
            </div>

            <div className="container relative z-20 px-4 md:px-6 mx-auto">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
                            <ShieldCheck className="text-sky-400" size={16} />
                            <span className="text-sky-300 text-sm font-semibold tracking-wide uppercase">
                                Trusted by 10,000+ Cleaners
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                            Find Trusted Cleaners
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                                In Your Local Area
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                            The National Cleaning Network is the free source for finding credible, insured cleaners or growing your cleaning business. Professional, verified, and free to use.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(249, 115, 22, 0.5)" }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300"
                            >
                                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span>Find a Cleaner</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
                            >
                                <span>Join as a Cleaner</span>
                            </motion.button>
                        </div>

                        <div className="mt-12 flex items-center space-x-8 text-sm text-slate-400 font-medium">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span>100% Free Service</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span>Verified Professionals</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1 h-1 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
}
