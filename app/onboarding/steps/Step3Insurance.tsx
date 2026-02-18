"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useState } from "react";

// Initial schema for text fields
const insuranceSchema = z.object({
    insurerName: z.string().min(2, "Insurer name is required"),
});

type InsuranceFormValues = z.infer<typeof insuranceSchema>;

import { StepProps } from "../../types/onboarding";

export default function Step3Insurance({ onNext, onBack, updateData, data }: StepProps) {
    const [file, setFile] = useState<File | null>(data.insuranceDocFile || null);
    const [fileError, setFileError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InsuranceFormValues>({
        resolver: zodResolver(insuranceSchema),
        defaultValues: {
            insurerName: data.insurerName,
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setFileError("File size must be less than 5MB");
                setFile(null);
            } else {
                setFileError(null);
                setFile(selectedFile);
            }
        }
    };

    const onSubmit = (values: InsuranceFormValues) => {
        if (!file && !data.insuranceDocFile) {
            setFileError("Please upload your insurance document");
            return;
        }
        updateData({ ...values, insuranceDocFile: file });
        onNext();
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Insurance Details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Insurer</label>
                    <input
                        {...register("insurerName")}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="AXA, Zurich, etc."
                    />
                    {errors.insurerName && <p className="text-red-500 text-xs mt-1">{errors.insurerName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Upload Insurance Document (PDF/Image)</label>

                    {!file ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Click or drag to upload</p>
                            <p className="text-xs text-slate-400 mt-1">Max 5MB</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-sky-50 border border-sky-100 rounded-lg">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <Upload className="w-5 h-5 text-sky-500 flex-shrink-0" />
                                <span className="text-sm text-slate-700 truncate font-medium">{file.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
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
                        className="w-2/3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-[1.02]"
                    >
                        Next Step
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
