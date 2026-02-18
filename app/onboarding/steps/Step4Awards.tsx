"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Step4Awards({ onBack, updateData, data, onSubmitFinal, isSubmitting }: any) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            awards: data.awards,
        },
    });

    const onSubmit = (values: any) => {
        updateData(values);
        onSubmitFinal(values.awards); // Trigger final submission
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Qualifications & Awards</h2>
            <p className="text-slate-500 text-sm mb-6">Optional: Add any certifications or awards to stand out.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
                    <textarea
                        {...register("awards")}
                        rows={5}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="e.g. COSHH Certified, NVQ Level 2 in Cleaning..."
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:from-sky-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isSubmitting ? (
                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        ) : null}
                        Submit Application
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
