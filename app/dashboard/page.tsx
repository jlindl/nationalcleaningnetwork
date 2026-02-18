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
    awards: string | null;
    service_types: string[] | null;
    other_service: string | null;
    base_location: string | null;
    service_radius: number | null;
    is_verified: boolean;
};

export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<CleanerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
            } else {
                setProfile(data);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Profile Not Found</h2>
                    <p className="text-slate-600">We couldn't find your cleaner profile.</p>
                    <Link href="/onboarding" className="mt-4 inline-block text-sky-600 hover:underline">Complete Setup</Link>
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome, {profile.first_name}!
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Manage your profile and view your network status.
                    </p>
                </div>

                {/* Verification Status */}
                <div className={`mb-8 p-6 rounded-xl border-l-4 shadow-sm ${profile.is_verified
                        ? "bg-green-50 border-green-500 text-green-800"
                        : "bg-amber-50 border-amber-500 text-amber-800"
                    }`}>
                    <h3 className="font-bold text-lg flex items-center space-x-2">
                        <ShieldCheck size={24} />
                        <span>Status: {profile.is_verified ? "Verified Professional" : "Verification Pending"}</span>
                    </h3>
                    <p className="mt-1 text-sm opacity-90">
                        {profile.is_verified
                            ? "Your profile is active and visible to clients."
                            : "We are reviewing your insurance documents. This usually takes 24-48 hours."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                <Building size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Company Details</h2>
                        </div>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Company Name</dt>
                                <dd className="text-slate-900 font-medium">{profile.company_name}</dd>
                            </div>
                            {profile.company_number && (
                                <div>
                                    <dt className="text-sm font-medium text-slate-500">Company Number</dt>
                                    <dd className="text-slate-900 font-medium">{profile.company_number}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Office Address</dt>
                                <dd className="text-slate-900 font-medium">{profile.office_address}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Application Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                <FileText size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Application Info</h2>
                        </div>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Insurer</dt>
                                <dd className="text-slate-900 font-medium">{profile.insurer_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Insurance Document</dt>
                                <dd className="text-slate-900 font-medium">
                                    {profile.insurance_doc_url ? (
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${profile.insurance_doc_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-600 hover:underline flex items-center space-x-1"
                                        >
                                            <span>View Document</span>
                                            <FileText size={14} />
                                        </a>
                                    ) : (
                                        <span className="text-slate-400 italic">Not uploaded</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Qualifications & Awards</dt>
                                <dd className="text-slate-900 font-medium">
                                    {profile.awards ? profile.awards : "None listed"}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Service & Location */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                <MapPin size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Service Coverage</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 mb-1">Services Offered</dt>
                                <dd className="text-slate-900 font-medium">
                                    <div className="flex flex-wrap gap-2">
                                        {profile.service_types && profile.service_types.length > 0 ? (
                                            profile.service_types.map(s => (
                                                <span key={s} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 border border-slate-200">
                                                    {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400">None listed</span>
                                        )}
                                        {profile.other_service && (
                                            <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 border border-slate-200">
                                                {profile.other_service}
                                            </span>
                                        )}
                                    </div>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 mb-1">Location & Radius</dt>
                                <dd className="text-slate-900 font-medium flex flex-col">
                                    <span>Based in: {profile.base_location || "Not specified"}</span>
                                    <span className="text-sm text-slate-500">Covering {profile.service_radius || 0} miles radius</span>
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                <User size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Personal Contact</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                                <dd className="text-slate-900 font-medium">{profile.first_name} {profile.last_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Email</dt>
                                <dd className="text-slate-900 font-medium">{profile.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500">Phone</dt>
                                <dd className="text-slate-900 font-medium">{profile.phone}</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
