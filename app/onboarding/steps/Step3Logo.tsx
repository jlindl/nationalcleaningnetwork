"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { StepProps } from "../../types/onboarding";

export default function Step3Logo({ onBack, updateData, data, onSubmitFinal, isSubmitting }: StepProps) {
    const { handleSubmit } = useForm();
    const [file, setFile] = useState<File | null>(data.logoFile || null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        data.logoFile ? URL.createObjectURL(data.logoFile) : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("File is too large. Max size is 5MB.");
                return;
            }
            if (!selectedFile.type.startsWith("image/")) {
                alert("Please upload an image file (PNG, JPG).");
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const onSubmit = () => {
        // Logo is optional, but if provided, we save it
        updateData({ logoFile: file });
        if (onSubmitFinal) {
            onSubmitFinal();
        }
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Company Logo</h2>
            <p className="text-slate-500 text-sm mb-6">Optional: Upload your company logo to make your profile stand out to clients.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Logo (Max 5MB)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-sky-500 transition-colors bg-slate-50 relative overflow-hidden group">
                        <div className="space-y-2 text-center relative z-10 w-full">
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-white shadow-md mb-2">
                                        <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm text-green-600 font-medium flex items-center justify-center space-x-1">
                                        <CheckCircle2 size={16} />
                                        <span>Logo Ready</span>
                                    </span>
                                </div>
                            ) : (
                                <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-sky-500 transition-colors" />
                            )}

                            <div className="flex text-sm text-slate-600 justify-center mt-2">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500 px-3 py-1 shadow-sm border border-slate-200"
                                >
                                    <span>{file ? "Change Logo" : "Upload a file"}</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            {!file && <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>}
                        </div>
                    </div>
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
                        Complete Sign Up
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
