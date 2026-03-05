"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { OnboardingData } from "../types/onboarding";
import Step1Contact from "./steps/Step1Contact";
import StepService from "./steps/StepService";
import Step2Company from "./steps/Step2Company";
import Step3Logo from "./steps/Step3Logo";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<Partial<OnboardingData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from LocalStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("ncn-onboarding-data");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setData(parsed);
                } catch (e) {
                    console.error("Failed to parse saved onboarding data", e);
                }
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (typeof window !== "undefined" && Object.keys(data).length > 0) {
            // Exclude File object before saving
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { logoFile, ...rest } = data;
            localStorage.setItem("ncn-onboarding-data", JSON.stringify(rest));
        }
    }, [data]);

    const updateData = async (fields: Partial<OnboardingData>) => {
        const newData = { ...data, ...fields };
        setData(newData);

        // Save progress to Supabase periodically
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { logoFile, ...safeData } = newData;

            if (!newData.leadId) {
                const { data: leadData, error } = await supabase
                    .from('onboarding_leads')
                    .insert({
                        first_name: newData.firstName,
                        last_name: newData.lastName,
                        email: newData.email,
                        phone: newData.phone,
                        current_step: currentStep,
                        form_data: safeData
                    })
                    .select('id')
                    .single();

                if (leadData?.id) {
                    setData(prev => ({ ...prev, leadId: leadData.id }));
                }
                if (error) console.error("Supabase insert lead error:", error);
            } else {
                const { error } = await supabase
                    .from('onboarding_leads')
                    .update({
                        first_name: newData.firstName,
                        last_name: newData.lastName,
                        email: newData.email,
                        phone: newData.phone,
                        current_step: currentStep,
                        updated_at: new Date().toISOString(),
                        form_data: safeData
                    })
                    .eq('id', newData.leadId);

                if (error) console.error("Supabase update lead error:", error);
            }
        } catch (e) {
            console.error("Failed to save progress", e);
        }
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        // Merge final data (React state lags slightly behind the final update call)
        // Data is passed from Step3Logo via updateData before this fires.
        const finalData = { ...data };

        try {
            if (!finalData.email || !finalData.password) {
                throw new Error("Missing email or password");
            }

            console.log("Submitting Onboarding Data:", finalData);

            let uploadedFileName = null;
            // 1. Upload Logo BEFORE Sign Up
            if (finalData.logoFile) {
                console.log("Logo found, attempting upload:", finalData.logoFile.name);

                const fileExt = finalData.logoFile.name.split(".").pop();
                const prefixId = finalData.leadId || crypto.randomUUID();
                uploadedFileName = `${prefixId}-${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("logos")
                    .upload(uploadedFileName, finalData.logoFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Logo Upload Failed:", uploadError);
                    uploadedFileName = null; // Do not save invalid url
                } else {
                    console.log("Logo Upload Success:", uploadData);
                }
            } else {
                console.log("No logo to upload.");
            }

            // 2. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: finalData.email,
                password: finalData.password,
                options: {
                    data: {
                        firstName: finalData.firstName,
                        lastName: finalData.lastName,
                        phone: finalData.phone,
                        companyName: finalData.companyName,
                        companyNumber: finalData.companyNumber,
                        officeAddress: finalData.officeAddress,
                        serviceTypes: finalData.serviceTypes,
                        otherService: finalData.otherService,
                        baseLocation: finalData.baseLocation,
                        serviceRadius: finalData.serviceRadius,
                        logoUrl: uploadedFileName, // Save logo to metadata
                    },
                },
            });

            if (authError) {
                console.error("SignUp Error:", authError);
                throw authError;
            }

            console.log("SignUp Success:", authData);

            if (authData.user) {
                // Mark onboarding lead as completed
                if (finalData.leadId) {
                    await supabase
                        .from('onboarding_leads')
                        .update({ is_completed: true, current_step: 3 })
                        .eq('id', finalData.leadId);
                }

                // Clear local storage
                localStorage.removeItem("ncn-onboarding-data");

                // 3. Success Redirect
                router.push("/onboarding/success");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <Step1Contact key="step1" onNext={nextStep} updateData={updateData} data={data} />;
            case 1:
                return <StepService key="stepService" onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
            case 2:
                // Combine Company + Logo for step 3
                return <Step2Company key="step2" onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
            case 3:
                return <Step3Logo
                    key="step3"
                    onBack={prevStep}
                    updateData={updateData}
                    data={data}
                    onSubmitFinal={handleFinalSubmit}
                    isSubmitting={isSubmitting}
                />;
            default:
                return <div>Error: Unknown Step</div>;
        }
    };

    const STEP_TITLES = [
        "Contact Details",
        "Services & Location",
        "Company Details",
        "Brand Identity"
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                <h2 className="text-center text-3xl font-extrabold text-slate-900">
                    Join the Network
                </h2>
                <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-sky-600 uppercase tracking-widest">
                        Step {currentStep + 1} of {STEP_TITLES.length}
                    </p>
                    <h3 className="text-lg font-medium text-slate-900 mt-1">
                        {STEP_TITLES[currentStep]}
                    </h3>
                </div>
                {/* Progress Bar */}
                <div className="mt-4 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-sky-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / STEP_TITLES.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>

            {/* Reset Button for Dev/Testing */}
            <div className="text-center mt-8">
                <button
                    onClick={() => {
                        if (confirm("Are you sure you want to clear your progress and start over?")) {
                            localStorage.removeItem("ncn-onboarding-data");
                            setData({});
                            setCurrentStep(0);
                            setError(null);
                        }
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                    Reset & Start Over
                </button>
            </div>
        </div>
    );
}
