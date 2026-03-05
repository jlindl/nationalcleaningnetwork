"use client";

import { useEffect, useRef } from "react";
import { Search, ListChecks, CalendarCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        icon: Search,
        title: "1. Search Local",
        description: "Enter your postcode or city to instantly see a list of verified cleaners operating in your specific area.",
        color: "bg-blue-50 text-[#1E3A8A]"
    },
    {
        icon: ListChecks,
        title: "2. Compare Profiles",
        description: "Review transparent profiles, checking their service types, verified insurance details, and company information.",
        color: "bg-sky-50 text-[#3B82F6]"
    },
    {
        icon: CalendarCheck,
        title: "3. Contact & Book",
        description: "Get in touch directly using their listed contact details. No middleman fees, just straightforward connections.",
        color: "bg-indigo-50 text-indigo-600"
    }
];

export default function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.from(headerRef.current?.children as unknown as HTMLElement[], {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            // Cards animation
            gsap.from(cardsRef.current?.children as unknown as HTMLElement[], {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 85%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="py-24 bg-white relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-[#3B82F6] font-semibold tracking-wide uppercase text-sm mb-3">
                        Simple Process
                    </h2>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-6">
                        How the Network Works
                    </h3>
                    <p className="text-lg text-slate-600">
                        We've built a frictionless platform that connects you directly with professional cleaners. No hidden fees or complicated booking systems.
                    </p>
                </div>

                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative mb-24"
                >
                    {/* Connecting UI Line (Hidden on mobile) */}
                    <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500 ${step.color}`}>
                                <step.icon className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-bold text-[#0f172a] mb-3">{step.title}</h4>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Additional Lifestyle Image & CTA feature */}
                <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100 flex flex-col lg:flex-row items-center gap-12 mt-12">
                    <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 relative group">
                        <img
                            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
                            alt="Happy Customer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h4 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-4">
                            Ready to find your cleaner?
                        </h4>
                        <p className="text-slate-600 mb-8 max-w-md">
                            Browse through thousands of verified profiles, read genuine reviews, and contact cleaners directly today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#directory" className="bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-[#3B82F6] hover:shadow-lg transition-all text-center">
                                Browse Cleaners
                            </a>
                            <a href="/login" className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all text-center">
                                Log In
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
