"use client";

import { useEffect, useRef } from "react";
import { Star, MapPin, CheckCircle2, Building, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const mockCleaners = [
    {
        name: "Pristine Spaces Ltd",
        location: "London, UK",
        rating: 4.9,
        reviews: 128,
        services: ["Commercial", "Deep Clean"],
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80",
        verified: true
    },
    {
        name: "EcoShine Cleaning",
        location: "Manchester, UK",
        rating: 5.0,
        reviews: 84,
        services: ["Residential", "End of Tenancy"],
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&q=80",
        verified: true
    },
    {
        name: "Apex Facility Services",
        location: "Birmingham, UK",
        rating: 4.8,
        reviews: 215,
        services: ["Office", "Window Cleaning"],
        image: "https://images.unsplash.com/photo-1628177142898-93e46e6d63bc?w=300&q=80",
        verified: true
    }
];

export default function DirectoryPreview() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: gsap.Context;

        // Small timeout to ensure DOM is fully painted before GSAP calculates positions
        const timer = setTimeout(() => {
            if (!sectionRef.current || !gridRef.current) return;

            const elements = Array.from(gridRef.current.children);
            if (elements.length === 0) return;

            ctx = gsap.context(() => {
                gsap.from(elements, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        // toggleActions: "play none none reverse" // Optional: makes it play every time they scroll up/down
                    }
                });
            }, sectionRef);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="directory"
            className="py-24 bg-slate-50 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-[#1E3A8A] font-semibold tracking-wide uppercase text-sm mb-3">
                            Directory Preview
                        </h2>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4">
                            Meet verified professionals
                        </h3>
                        <p className="text-lg text-slate-600">
                            Our network consists of vetted, insured cleaners ready to handle residential and commercial spaces.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center text-[#3B82F6] font-semibold hover:text-[#1E3A8A] transition-colors group"
                    >
                        View Full Directory
                        <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                >
                    {mockCleaners.map((cleaner, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src={cleaner.image} alt={cleaner.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-[#0f172a] group-hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                                        {cleaner.name}
                                        {cleaner.verified && (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-50" />
                                        )}
                                    </h4>
                                    <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                        {cleaner.location}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-sm font-medium">
                                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    <span>{cleaner.rating}</span>
                                </div>
                                <span className="text-slate-400">({cleaner.reviews} reviews)</span>
                            </div>

                            <div className="mb-8 flex flex-wrap gap-2">
                                {cleaner.services.map((service, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <button className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#1E3A8A] bg-blue-50 hover:bg-[#1E3A8A] hover:text-white transition-colors flex items-center justify-center">
                                    <Building className="w-4 h-4 mr-2" />
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center bg-blue-50 p-8 rounded-3xl border border-blue-100/50">
                    <h4 className="text-2xl font-bold text-[#0f172a] mb-3">Don't see your area?</h4>
                    <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                        We are constantly expanding our network. Use our search tool to find newly registered professionals near you, or sign up today to be the first cleaner in your local network!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/login" className="bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-semibold shadow-sm hover:bg-[#3B82F6] hover:shadow-md transition-all">
                            Search Directory
                        </Link>
                        <Link href="/onboarding" className="bg-white text-[#1E3A8A] border border-[#1E3A8A]/20 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                            List Your Services
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
