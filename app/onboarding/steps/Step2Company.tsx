"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const companySchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyNumber: z.string().optional(),
    officeAddress: z.string().min(5, "Office address is required"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

import { StepProps } from "../../types/onboarding";

export default function Step2Company({ onNext, onBack, updateData, data }: StepProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            companyName: data.companyName,
            companyNumber: data.companyNumber,
            officeAddress: data.officeAddress,
        },
    });

    const onSubmit = (values: CompanyFormValues) => {
        updateData(values);
        if (onNext) onNext();
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Company Details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input
                        {...register("companyName")}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="Clean & Shine Ltd."
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Company Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        {...register("companyNumber")}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="12345678"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Office Address</label>
                    <textarea
                        {...register("officeAddress")}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="123 Business Park, London..."
                    />
                    {errors.officeAddress && <p className="text-red-500 text-xs mt-1">{errors.officeAddress.message}</p>}
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
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
