"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Users } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ForCleaners() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(contentRef.current?.children as unknown as HTMLElement[], {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-24 bg-slate-950 relative overflow-hidden text-white"
        >
            {/* Subtle Texture/Gradient Overlay Array */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">

                {/* Text Content */}
                <div ref={contentRef} className="w-full lg:w-1/2">
                    <div className="inline-flex items-center space-x-2 bg-blue-400/10 px-4 py-2 rounded-full font-bold text-sm mb-8 border border-blue-400/20 backdrop-blur-md">
                        <TrendingUp size={16} className="text-blue-400" />
                        <span className="text-blue-100 uppercase tracking-widest text-[10px]">Grow Your Business</span>
                    </div>

                    <h2 className="text-4xl sm:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                        Free advertising for <span className="text-blue-400">cleaners.</span>
                    </h2>

                    <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                        List your services at no cost and get discovered by local customers. No subscription fees, no lead generation charges. You keep 100% of what you earn.
                    </p>

                    <ul className="space-y-6 mb-12">
                        {[
                            { icon: ShieldCheck, text: "Build trust with a verified public profile." },
                            { icon: Users, text: "Connect directly with clients in your postcode." },
                            { icon: ArrowRight, text: "Setup takes less than 3 minutes." }
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center group">
                                <div className="mr-5 p-3 bg-white/5 rounded-2xl group-hover:bg-blue-600/20 transition-colors duration-300 border border-white/10">
                                    <item.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="font-semibold text-lg text-slate-200 group-hover:text-white transition-colors">{item.text}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/onboarding"
                        className="inline-flex items-center bg-[#3B82F6] text-white font-bold py-5 px-10 rounded-2xl shadow-2xl hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 group"
                    >
                        List Your Services Free
                        <ArrowRight className="ml-3 w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Dashboard / Analytics Mockup */}
                <div className="w-full lg:w-1/2 relative group">
                    <div className="w-full aspect-[4/3] glass-card border border-white/10 rounded-[40px] p-8 shadow-2xl relative z-10 overflow-hidden">
                        
                        {/* Mockup Header */}
                        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80" alt="Professional Cleaner Profile" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg mb-0.5">Sarah Jenkins</div>
                                    <div className="text-sky-200 text-xs">Premium Member</div>
                                </div>
                            </div>
                            <div className="bg-sky-400 text-[#1E3A8A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Verified
                            </div>
                        </div>

                        {/* Mockup Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/10 transition-colors duration-500">
                                <div className="text-sky-200 text-sm mb-1">Profile Views</div>
                                <div className="text-3xl font-bold text-white mb-2">1,284</div>
                                <div className="text-xs text-green-400 flex items-center bg-green-400/10 w-max px-2 py-1 rounded-md">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +12.5% this month
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/10 transition-colors duration-500 delay-100">
                                <div className="text-sky-200 text-sm mb-1">Search Rank</div>
                                <div className="text-3xl font-bold text-white mb-2">#3</div>
                                <div className="text-xs text-sky-200 bg-white/5 w-max px-2 py-1 rounded-md">In your local area</div>
                            </div>
                        </div>

                        {/* Chart mock */}
                        <div className="h-32 w-full flex items-end justify-between gap-2 px-2 border-t border-white/10 mt-auto pt-6">
                            {[40, 60, 45, 80, 55, 90, 75].map((height, i) => (
                                <div
                                    key={i}
                                    className="w-full bg-gradient-to-t from-sky-400/20 to-sky-400 rounded-t-sm transition-all duration-700 delay-[${i * 100}ms] group-hover:opacity-100 opacity-70"
                                    style={{ height: `${height}%` }}
                                ></div>
                            ))}
                        </div>

                        {/* Interactive overlay sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    </div>

                    {/* Floating Success Indicator */}
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 border border-slate-100 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-300">
                        <div className="flex -space-x-3">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+50</div>
                        </div>
                        <div>
                            <p className="text-[#0f172a] font-bold text-sm">New bookings</p>
                            <p className="text-slate-500 text-xs text-right">This week</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
