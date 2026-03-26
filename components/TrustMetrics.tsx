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
        label: "Businesses Joined",
        description: "Independent cleaners and companies nationwide."
    },
    {
        icon: CalendarCheck,
        value: "50,000+",
        label: "Monthly Searches",
        description: "Potential clients looking for services in your area."
    },
    {
        icon: Home,
        value: "£0 Fees",
        label: "Commission Free",
        description: "You keep 100% of your earnings. No hidden charges."
    }
];

export default function TrustMetrics() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = metricsRef.current?.children as unknown as HTMLElement[];
            
            gsap.from(items, {
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

            // Count animation
            const valueElements = sectionRef.current?.querySelectorAll(".metric-value");
            valueElements?.forEach((el) => {
                const target = parseInt(el.getAttribute("data-target") || "0");
                const obj = { value: 0 };
                gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                    },
                    onUpdate: () => {
                        el.textContent = Math.floor(obj.value).toLocaleString() + (el.getAttribute("data-suffix") || "");
                    }
                });
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
                        <div key={index} className="flex flex-col items-center group p-8 rounded-3xl transition-all duration-500 hover:bg-slate-50 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-slate-100">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1E3A8A] mb-6 group-hover:scale-110 group-hover:bg-[#1E3A8A] group-hover:text-white transition-all duration-500 shadow-sm">
                                <metric.icon className="w-7 h-7" />
                            </div>
                            <div 
                                className="metric-value text-4xl sm:text-5xl font-extrabold text-[#0f172a] mb-2 tracking-tight"
                                data-target={metric.value.replace(/[^0-9]/g, "")}
                                data-suffix={metric.value.replace(/[0-9,]/g, "")}
                            >
                                0
                            </div>
                            <div className="text-lg font-bold text-[#3B82F6] mb-3">
                                {metric.label}
                            </div>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
