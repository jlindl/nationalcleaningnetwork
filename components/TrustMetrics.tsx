"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, CalendarCheck, Home } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
    {
        icon: ShieldCheck,
        value: "5,000+",
        label: "Verified Cleaners",
        description: "Fully vetted, insured, and background checked."
    },
    {
        icon: CalendarCheck,
        value: "2M+",
        label: "Hours Cleaned",
        description: "Trusted by households and businesses nationwide."
    },
    {
        icon: Home,
        value: "100%",
        label: "Satisfaction",
        description: "Direct communication ensures you get exactly what you need."
    }
];

export default function TrustMetrics() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(metricsRef.current?.children as unknown as HTMLElement[], {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-16 bg-white border-y border-slate-100 relative"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={metricsRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
                >
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A] mb-4">
                                <metric.icon className="w-6 h-6" />
                            </div>
                            <div className="text-4xl font-extrabold text-[#0f172a] mb-2">
                                {metric.value}
                            </div>
                            <div className="text-lg font-bold text-[#3B82F6] mb-2">
                                {metric.label}
                            </div>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
