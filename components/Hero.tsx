"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Search, Building2, TrendingUp } from "lucide-react";

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text entrance animation
            gsap.from(textRef.current?.children as unknown as HTMLElement[], {
                y: 60,
                opacity: 0,
                duration: 1.4,
                stagger: 0.2,
                fontKerning: "none",
                ease: "power4.out",
                delay: 0.3
            });

            // Parallax background on scroll
            if (bgRef.current) {
                gsap.to(bgRef.current, {
                    yPercent: 20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-slate-900"
        >
            {/* Animated Background Image */}
            <div
                ref={bgRef}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/Hero_bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Dark overlay to ensure text legibility with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/40 z-10 pointer-events-none"></div>

            <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center" ref={textRef}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                    Get More Cleaning Jobs. <span className="text-[#3B82F6] relative inline-block">
                        No Commissions.
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6] to-[#3B82F6]/0 rounded-full opacity-70"></div>
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed mx-auto">
                    Join the UK's fastest-growing network for independent cleaners and companies. Build your presence, get discovered by local clients, and keep 100% of what you earn.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl mx-auto">
                    <Link
                        href="/onboarding"
                        className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg group relative overflow-hidden"
                    >
                        {/* Shine effect overlay */}
                        <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                        <Building2 className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                        <span className="relative z-10">Join the Network</span>
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="flex-1 bg-white hover:bg-slate-50 text-[#0f172a] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 border border-transparent hover:border-blue-100 transition-all duration-300 flex items-center justify-center text-lg group relative overflow-hidden"
                    >
                        {/* Subtle background swipe effect */}
                        <div className="absolute inset-0 w-full h-full bg-slate-100 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-0 pointer-events-none" />
                        <Search className="w-5 h-5 mr-3 text-[#3B82F6] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 relative z-10" />
                        <span className="relative z-10">How it Works</span>
                    </Link>
                </div>

                {/* Floating Glass Feature Card */}
                <div className="mt-16 glass-card p-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl animate-bounce-slow">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="text-white font-bold text-sm">Recently Joined</div>
                        <div className="text-slate-300 text-xs">Pristine Cleans Ltd (London)</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
