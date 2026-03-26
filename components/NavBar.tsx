"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, Menu, X } from "lucide-react";

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "glass-effect shadow-lg py-3"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Brand */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="bg-[#1E3A8A] text-white p-1.5 rounded-lg group-hover:bg-[#3B82F6] transition-colors">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`font-bold text-xl sm:text-2xl tracking-tight hidden sm:block transition-colors duration-300 ${scrolled ? 'text-[#0f172a]' : 'text-white'}`}>
                        National<span className={scrolled ? 'text-[#1E3A8A]' : 'text-blue-300'}>Cleaning</span>Network
                    </span>
                    <span className={`font-bold text-xl tracking-tight sm:hidden transition-colors duration-300 ${scrolled ? 'text-[#0f172a]' : 'text-white'}`}>
                        NCN
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#how-it-works" className={`text-sm font-semibold transition-all duration-300 relative group ${scrolled ? 'text-slate-600 hover:text-[#1E3A8A]' : 'text-slate-200 hover:text-white'}`}>
                        How it Works
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="#directory" className={`text-sm font-semibold transition-all duration-300 relative group ${scrolled ? 'text-slate-600 hover:text-[#1E3A8A]' : 'text-slate-200 hover:text-white'}`}>
                        Directory
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <div className={`h-4 w-px mx-0 transition-colors duration-300 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`}></div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className={`text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-slate-600 hover:text-[#0f172a]' : 'text-slate-200 hover:text-white'}`}>
                            Log In
                        </Link>
                        <Link
                            href="/onboarding"
                            className="bg-[#1E3A8A] hover:bg-[#3B82F6] text-white text-sm font-semibold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition-all transform hover:scale-105"
                        >
                            Join as a Provider
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`focus:outline-none transition-colors duration-300 ${scrolled ? 'text-slate-600 hover:text-[#0f172a]' : 'text-slate-200 hover:text-white'}`}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 py-4 px-4 flex flex-col space-y-4">
                    <Link
                        href="#how-it-works"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-slate-800 hover:text-[#1E3A8A]"
                    >
                        How it Works
                    </Link>
                    <Link
                        href="#directory"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-slate-800 hover:text-[#1E3A8A]"
                    >
                        Directory
                    </Link>
                    <hr className="border-slate-100" />
                    <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-slate-600 hover:text-[#0f172a]"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/onboarding"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center w-full bg-[#1E3A8A] text-white font-semibold py-3 rounded-xl shadow-sm"
                    >
                        Join as a Provider
                    </Link>
                </div>
            )}
        </nav>
    );
}
