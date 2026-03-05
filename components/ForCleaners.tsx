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
            className="py-24 bg-[#1E3A8A] relative overflow-hidden text-white"
        >
            {/* Subtle Texture/Gradient Overlay Array */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#3B82F6]/20 to-transparent pointer-events-none" />
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">

                {/* Text Content */}
                <div ref={contentRef} className="w-full lg:w-1/2">
                    <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full font-medium text-sm mb-6 border border-white/20 backdrop-blur-sm">
                        <TrendingUp size={16} className="text-sky-300" />
                        <span className="text-sky-50">Grow Your Business</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                        Free advertising for cleaners <span className="text-sky-300">nationwide.</span>
                    </h2>

                    <p className="text-lg text-blue-100 mb-8 max-w-xl leading-relaxed">
                        List your services at no cost and get discovered by local customers. No subscription fees, no lead generation charges. You keep 100% of what you earn.
                    </p>

                    <ul className="space-y-4 mb-10">
                        {[
                            { icon: ShieldCheck, text: "Build trust with a verified public profile." },
                            { icon: Users, text: "Connect directly with clients in your postcode." },
                            { icon: ArrowRight, text: "Setup takes less than 3 minutes." }
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center text-blue-50">
                                <div className="mr-4 p-2 bg-white/10 rounded-lg">
                                    <item.icon className="w-5 h-5 text-sky-300" />
                                </div>
                                <span className="font-medium text-lg">{item.text}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/onboarding"
                        className="inline-flex items-center bg-white text-[#1E3A8A] font-bold py-4 px-8 rounded-xl shadow-xl hover:bg-sky-50 transition-all transform hover:scale-105"
                    >
                        List Your Services (Free)
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                {/* Dashboard / Analytics Mockup */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="w-full aspect-[4/3] bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative z-10 overflow-hidden group">

                        {/* Mockup Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
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
