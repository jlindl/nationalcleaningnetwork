"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Building, LogOut, FileText, Award, MapPin } from "lucide-react";
import Link from "next/link";

type CleanerProfile = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
    company_number: string | null;
    office_address: string;
    insurer_name: string;
    insurance_doc_url: string | null;
    insurance_visible: boolean;
    awards: string | null;
    service_types: string[] | null;
    other_service: string | null;
    base_location: string | null;
    service_radius: number | null;
    logo_url: string | null;
    is_verified: boolean;
};

export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<CleanerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Verification Form State
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [insuranceVisible, setInsuranceVisible] = useState(false);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from('cleaners')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Error fetching profile:", error);
        } else {
            setProfile(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsVerifying(true);
        setVerifyError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const insurerName = formData.get("insurerName") as string;
            const awards = formData.get("awards") as string;
            const file = formData.get("insuranceDoc") as File;

            if (!insurerName || !file || file.size === 0) {
                throw new Error("Please provide insurer name and document.");
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Upload File
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            // 2. Update Profile
            const { error: updateError } = await supabase
                .from('cleaners')
                .update({
                    insurer_name: insurerName,
                    insurance_doc_url: fileName,
                    awards: awards || null,
                    insurance_visible: insuranceVisible,
                })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            // 3. Refresh Profile Data
            await fetchProfile();

            // Allow form to reset or be unmounted naturally
        } catch (err: any) {
            console.error("Verification Error:", err);
            setVerifyError(err.message || "Failed to submit verification. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Check</h2>
                    <p className="text-slate-600 mb-6">
                        We could not retrieve your full cleaner profile. If you just signed up, wait a few moments or finish your onboarding.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <Link
                            href="/onboarding"
                            className="w-full py-2 px-4 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition"
                        >
                            Complete Setup
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 text-slate-500 font-medium hover:text-slate-800 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="bg-sky-500 p-1.5 rounded-lg text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">My Dashboard</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Premium Header / Cover Section */}
                <div className="relative bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] rounded-3xl p-8 mb-8 text-white overflow-hidden shadow-xl border border-blue-800">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 right-20 w-40 h-40 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Logo Container */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-xl p-2 flex-shrink-0 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm overflow-hidden">
                            {profile.logo_url ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${profile.logo_url}`}
                                    alt={`${profile.company_name} Logo`}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <Building className="w-12 h-12 text-slate-300" />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="text-center md:text-left flex-1 mt-2">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">
                                {profile.company_name || `${profile.first_name} ${profile.last_name}`}
                            </h1>
                            <p className="text-blue-100 text-lg mb-4 font-medium">
                                Welcome back, {profile.first_name}!
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="inline-flex items-center bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-sm">
                                    <MapPin className="w-4 h-4 mr-1.5 opacity-80" />
                                    {profile.base_location || "Location not set"}
                                </span>
                                {profile.is_verified && (
                                    <span className="inline-flex items-center bg-green-500/20 text-green-200 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border border-green-500/30 shadow-sm">
                                        <ShieldCheck className="w-4 h-4 mr-1.5" />
                                        Verified Member
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                {!profile.insurance_doc_url ? (
                    <div className="mb-8 p-6 rounded-xl border-l-4 shadow-sm bg-blue-50 border-sky-500 text-sky-900">
                        <h3 className="font-bold text-lg flex items-center space-x-2">
                            <span className="text-2xl">🎉</span>
                            <span>Congratulations you have created a free profile.</span>
                        </h3>
                        <p className="mt-1 text-sm opacity-90">
                            This will now be visible to other users.
                        </p>
                    </div>
                ) : (
                    <div className={`mb-8 p-6 rounded-xl border-l-4 shadow-sm ${profile.is_verified
                        ? "bg-green-50 border-green-500 text-green-800"
                        : "bg-amber-50 border-amber-500 text-amber-800"
                        }`}>
                        <h3 className="font-bold text-lg flex items-center space-x-2">
                            <ShieldCheck size={24} />
                            <span>Status: {profile.is_verified ? "Verified Member" : "Verification Pending"}</span>
                        </h3>
                        <p className="mt-1 text-sm opacity-90">
                            {profile.is_verified
                                ? "Your profile is fully verified and active. You are trusted by the network."
                                : "We are reviewing your insurance documents. This usually takes 24-48 hours."}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Verification Action Box (If not verified yet) */}
                    {!profile.insurance_doc_url && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-dashed border-sky-200 md:col-span-2">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-sky-50 p-3 rounded-xl text-sky-600 shadow-inner">
                                    <Award size={28} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Become a Verified Member</h2>
                            </div>
                            <p className="text-slate-600 mb-6 text-base">
                                In order to verify, you must upload your insurance documents and optionally upload any awards or certificates you have. A verified member will have their profile enhanced and highlighted to more potential customers.
                            </p>

                            <form className="space-y-5 max-w-3xl bg-slate-50/50 p-6 rounded-2xl border border-slate-100" onSubmit={handleVerificationSubmit}>
                                {verifyError && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium">
                                        {verifyError}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Insurer Name <span className="text-red-500">*</span></label>
                                    <input name="insurerName" required type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all shadow-sm" placeholder="e.g. Hiscox, Simply Business..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Insurance Certificate <span className="text-red-500">*</span></label>
                                    <div className="border border-slate-200 rounded-xl bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-500 transition-all">
                                        <input name="insuranceDoc" required type="file" accept="application/pdf,image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-xl p-4">
                                    <input
                                        id="insuranceVisible"
                                        type="checkbox"
                                        checked={insuranceVisible}
                                        onChange={(e) => setInsuranceVisible(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer flex-shrink-0"
                                    />
                                    <label htmlFor="insuranceVisible" className="text-sm text-sky-900 cursor-pointer">
                                        <span className="font-bold">I consent to potential clients viewing my insurance certificate.</span>
                                        <span className="block text-sky-700 mt-0.5">Ticking this will allow your certificate to be visible on your public profile, building trust with customers.</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Qualifications & Awards (Optional)</label>
                                    <textarea name="awards" rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all shadow-sm resize-none" placeholder="e.g. COSHH Certified, NVQ Level 2..." />
                                </div>

                                <button type="submit" disabled={isVerifying} className="w-full bg-[#1E3A8A] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#3B82F6] hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex justify-center items-center mt-2">
                                    {isVerifying ? (
                                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                                    ) : null}
                                    Submit for Verification
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Company Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shadow-inner">
                                <Building size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Company Details</h2>
                        </div>
                        <dl className="space-y-5">
                            <div>
                                <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name</dt>
                                <dd className="text-slate-800 font-medium text-lg">{profile.company_name}</dd>
                            </div>
                            {profile.company_number && (
                                <div>
                                    <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Company Number</dt>
                                    <dd className="text-slate-800 font-medium text-lg">{profile.company_number}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Office Address</dt>
                                <dd className="text-slate-800 font-medium text-lg">{profile.office_address}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Application Details (Only visible if they uploaded documents) */}
                    {profile.insurance_doc_url && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shadow-inner">
                                    <FileText size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Credential Info</h2>
                            </div>
                            <dl className="space-y-5">
                                <div>
                                    <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Insurer</dt>
                                    <dd className="text-slate-800 font-medium text-lg">{profile.insurer_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Insurance Document</dt>
                                    <dd className="text-slate-800 font-medium text-lg mt-1">
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${profile.insurance_doc_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg text-[#3B82F6] font-semibold transition-colors"
                                        >
                                            <FileText size={16} />
                                            <span>View Certificate</span>
                                        </a>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Qualifications & Awards</dt>
                                    <dd className="text-slate-800 font-medium text-lg">
                                        {profile.awards ? profile.awards : "None listed"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {/* Service & Location */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 md:col-span-2">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shadow-inner">
                                <MapPin size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Service Coverage</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Services Offered</dt>
                                <dd className="text-slate-800 font-medium">
                                    <div className="flex flex-wrap gap-2.5">
                                        {profile.service_types && profile.service_types.length > 0 ? (
                                            profile.service_types.map(s => (
                                                <span key={s} className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm">
                                                    {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic">None listed</span>
                                        )}
                                        {profile.other_service && (
                                            <span className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm">
                                                {profile.other_service}
                                            </span>
                                        )}
                                    </div>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Location & Radius</dt>
                                <dd className="text-slate-800 font-medium flex flex-col space-y-2">
                                    <div className="flex items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shadow-sm w-fit">
                                        <MapPin className="w-5 h-5 text-slate-400 mr-2" />
                                        <span>Based in <strong>{profile.base_location || "Not specified"}</strong></span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-500 ml-1">
                                        Covering up to <span className="text-[#3B82F6]">{profile.service_radius || 0} miles</span> radius
                                    </span>
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 md:col-span-2">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shadow-inner">
                                <User size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Personal Contact</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</dt>
                                <dd className="text-slate-800 font-semibold">{profile.first_name} {profile.last_name}</dd>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</dt>
                                <dd className="text-slate-800 font-semibold">{profile.email}</dd>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</dt>
                                <dd className="text-slate-800 font-semibold">{profile.phone}</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
