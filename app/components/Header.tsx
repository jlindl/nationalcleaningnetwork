"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck, User, LogIn } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-slate-200 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-sky-500 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={24} />
            </div>
            <span
              className={cn(
                "text-xl font-bold tracking-tight transition-colors duration-300",
                isScrolled ? "text-slate-900" : "text-white"
              )}
            >
              NationalCleaning<span className="text-sky-500">Network</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Find a Cleaner", "For Cleaners", "About Us", "Contact"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className={cn(
                    "text-sm font-medium transition-colors duration-300 relative group",
                    isScrolled
                      ? "text-slate-600 hover:text-sky-600"
                      : "text-slate-200 hover:text-white"
                  )}
                >
                  {item}
                  <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-colors",
                isScrolled
                  ? "text-slate-600 hover:text-sky-600"
                  : "text-slate-200 hover:text-white"
              )}
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-orange-500/25 hover:-translate-y-0.5"
            >
              Join Network
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-md transition-colors",
              isScrolled ? "text-slate-900" : "text-white"
            )}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {["Find a Cleaner", "For Cleaners", "About Us", "Contact"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-slate-600 font-medium hover:text-sky-600 py-2 border-b border-slate-100 last:border-0"
                  >
                    {item}
                  </Link>
                )
              )}
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center space-x-2 border border-slate-200 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-orange-500/25 transition-all duration-300"
                >
                  Join Network
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
