"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { StepProps } from "../../types/onboarding";
import { MapPin, Briefcase } from "lucide-react";

const serviceOptions = [
    "Residential Cleaning",
    "Commercial / Office Cleaning",
    "End of Tenancy Cleaning",
    "Carpet Cleaning",
    "Window Cleaning",
    "Gutter Cleaning",
    "Oven Cleaning",
    "Deep Cleaning",
];

const serviceSchema = z.object({
    serviceTypes: z.array(z.string()).min(1, "Select at least one service"),
    otherService: z.string().optional(),
    baseLocation: z.string().min(2, "Location is required (e.g., City or Postcode)"),
    serviceRadius: z.number().min(1, "Radius must be at least 1 mile").max(100, "Maximum radius is 100 miles"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function StepService({ onNext, onBack, updateData, data }: StepProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            serviceTypes: data.serviceTypes || [],
            otherService: data.otherService || "",
            baseLocation: data.baseLocation || "",
            serviceRadius: data.serviceRadius || 10,
        },
    });

    const selectedServices = watch("serviceTypes");

    const toggleService = (service: string) => {
        const current = selectedServices || [];
        if (current.includes(service)) {
            setValue("serviceTypes", current.filter((s) => s !== service));
        } else {
            setValue("serviceTypes", [...current, service]);
        }
    };

    const onSubmit = (values: ServiceFormValues) => {
        updateData(values);
        onNext();
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Services & Location</h2>
            <p className="text-slate-500 mb-6 text-sm">Tell us what you do and where you work.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Services Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Briefcase size={18} className="text-sky-500" />
                        Cleaning Services Offered
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {serviceOptions.map((service) => {
                            const isSelected = selectedServices?.includes(service);
                            return (
                                <motion.button
                                    key={service}
                                    type="button"
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleService(service)}
                                    className={`relative text-left px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all flex items-center justify-between group ${isSelected
                                        ? "bg-sky-50 border-sky-500 text-sky-700 shadow-md"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-sky-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <span className="truncate pr-2">{service}</span>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex-shrink-0"
                                        >
                                            <div className="bg-sky-500 rounded-full p-0.5">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                    {errors.serviceTypes && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"
                        >
                            ⚠️ {errors.serviceTypes.message}
                        </motion.p>
                    )}
                </div>

                {/* Other Service */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Other Services (Optional)</label>
                    <input
                        {...register("otherService")}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all shadow-sm"
                        placeholder="e.g. Pressure Washing"
                    />
                </div>

                <div className="border-t border-slate-100 pt-6"></div>

                {/* Location Section */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-sky-500" />
                        Service Area
                    </label>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">Base Location (City or Postcode)</label>
                            <input
                                {...register("baseLocation")}
                                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 outline-none transition-all shadow-sm ${errors.baseLocation
                                    ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                                    : "border-slate-300 focus:ring-sky-500 focus:border-sky-500"
                                    }`}
                                placeholder="e.g. Manchester, M1"
                            />
                            {errors.baseLocation && (
                                <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                                    {errors.baseLocation.message}
                                </p>
                            )}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <label className="flex justify-between items-center mb-4">
                                <span className="text-xs font-semibold text-slate-600">Service Radius</span>
                                <span className="text-sky-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-sky-100 text-sm">
                                    {watch("serviceRadius")} miles
                                </span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                {...register("serviceRadius", { valueAsNumber: true })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                            />
                            <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-400 mt-2 font-medium">
                                <span>1 mile</span>
                                <span>50 miles</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="w-2/3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-[1.02]"
                    >
                        Next Step
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
