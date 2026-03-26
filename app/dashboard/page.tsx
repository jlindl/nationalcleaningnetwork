"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
    ShieldCheck, 
    User, 
    Building, 
    LogOut, 
    FileText, 
    Award, 
    MapPin, 
    LayoutDashboard, 
    Settings, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ChevronRight,
    Menu,
    X,
    Bell
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

type Tab = "overview" | "profile" | "verification" | "settings";

export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<CleanerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            setInsuranceVisible(data?.insurance_visible || false);
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

            await fetchProfile();
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
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                    <div className="w-20 h-20 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <User size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h2>
                    <p className="text-slate-600 mb-8">
                        We couldn't find your cleaner profile. Let's get you set up so you can start receiving clients.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <Link
                            href="/onboarding"
                            className="w-full py-3.5 px-4 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-200"
                        >
                            Start Onboarding
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full py-3.5 px-4 text-slate-500 font-bold hover:text-slate-800 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "profile", label: "Company Profile", icon: Building },
        { id: "verification", label: "Verification", icon: ShieldCheck },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-sky-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <span className="font-black text-xl tracking-tight text-[#1E3A8A]">NCN <span className="text-sky-600 font-medium">CLEAN</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as Tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all group/tab ${
                                    isActive 
                                    ? "bg-sky-50 text-sky-700 shadow-sm" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <Icon size={20} className={isActive ? "text-sky-600" : "opacity-60"} />
                                <span>{item.label}</span>
                                {item.id === "verification" && (
                                    <div className="ml-auto flex items-center">
                                        {profile.is_verified ? (
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        ) : profile.insurance_doc_url ? (
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                )}
                                {isActive && item.id !== "verification" && <motion.div layoutId="activePill" className="ml-auto w-1.5 h-1.5 bg-sky-600 rounded-full" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col"
                        >
                            <div className="p-6 flex justify-between items-center">
                                <span className="font-bold text-xl text-[#1E3A8A]">Dashboard</span>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 space-y-1 mt-4">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => { setActiveTab(item.id as Tab); setIsSidebarOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all ${
                                                isActive ? "bg-sky-50 text-sky-700" : "text-slate-500"
                                            }`}
                                        >
                                            <Icon size={20} className={isActive ? "text-sky-600" : "opacity-60"} />
                                            <span>{item.label}</span>
                                            {item.id === "verification" && (
                                                <div className="ml-auto">
                                                    {profile.is_verified ? (
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                    ) : profile.insurance_doc_url ? (
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                            <div className="p-6 border-t border-slate-100">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-600 font-bold p-2">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 capitalize hidden sm:block">{activeTab}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-none">{profile.first_name} {profile.last_name}</p>
                                <p className="text-xs text-slate-400 mt-1">Cleaner Account</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-100">
                                {profile.first_name[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Welcome Card */}
                                <section className="relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] rounded-[32px] p-8 md:p-12 text-white shadow-2xl">
                                    <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-20 pointer-events-none">
                                        <div className="absolute -top-12 -right-12 w-64 h-64 border-[32px] border-white/30 rounded-full" />
                                        <div className="absolute top-1/2 right-12 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
                                    </div>

                                    <div className="relative z-10">
                                        <p className="text-blue-200 font-bold tracking-widest uppercase text-xs mb-3">Welcome back</p>
                                        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                                            {profile.company_name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 text-blue-100">
                                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                                <MapPin size={16} />
                                                <span className="text-sm font-medium">{profile.base_location || "Location unset"}</span>
                                            </div>
                                            {profile.is_verified ? (
                                                <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-emerald-500/30 text-emerald-300">
                                                    <ShieldCheck size={16} />
                                                    <span className="text-sm font-bold">Verified Member</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-500/30 text-amber-300">
                                                    <Clock size={16} />
                                                    <span className="text-sm font-bold">Verification Pending</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-50 transition-all duration-300 group">
                                        <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Account Status</p>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                            {profile.is_verified ? "Fully Verified" : "Verification Pending"}
                                        </h3>
                                        <div className="mt-4 flex items-center gap-2 text-sky-600 font-bold text-sm cursor-pointer hover:gap-3 transition-all">
                                            Manage Account <ChevronRight size={16} />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group">
                                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <MapPin size={28} />
                                        </div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Service Coverage</p>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                            {profile.service_radius} Mile Radius
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium mt-1">Centered in {profile.base_location || "Location not set"}</p>
                                    </div>
                                </div>

                                {/* Next Steps / Alerts */}
                                {!profile.insurance_doc_url && (
                                    <section className="bg-sky-600 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <Award size={160} />
                                        </div>
                                        <div className="relative z-10 max-w-xl text-center md:text-left">
                                            <h3 className="text-2xl font-bold mb-2">Build Your Professional Trust</h3>
                                            <p className="text-sky-100 font-medium opacity-90">
                                                You've created a free profile! Now, upload your insurance documents to become a 
                                                <span className="font-bold text-white"> Verified Member</span> and double your visibility.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setActiveTab("verification")}
                                            className="relative z-10 bg-white text-sky-700 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-sky-50 transition-colors flex items-center gap-2"
                                        >
                                            Verify Now <ChevronRight size={18} />
                                        </button>
                                    </section>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="max-w-4xl space-y-8"
                            >
                                <section className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="flex-shrink-0">
                                            <div className="w-40 h-40 rounded-[32px] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                                                {profile.logo_url ? (
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${profile.logo_url}`}
                                                        alt="Logo"
                                                        className="w-full h-full object-contain p-4"
                                                    />
                                                ) : (
                                                    <Building size={48} className="text-slate-200" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900">{profile.company_name}</h3>
                                                <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">Primary Business Profile</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="space-y-1">
                                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Office Address</p>
                                                    <p className="font-bold text-slate-700">{profile.office_address}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Company Number</p>
                                                    <p className="font-bold text-slate-700">{profile.company_number || "N/A"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Contact Person</p>
                                                    <p className="font-bold text-slate-700">{profile.first_name} {profile.last_name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Phone Number</p>
                                                    <p className="font-bold text-slate-700">{profile.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-12 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                                                <CheckCircle2 size={20} className="text-sky-600" /> Services
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.service_types?.map(s => (
                                                    <span key={s} className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-100">{s}</span>
                                                ))}
                                                {profile.other_service && (
                                                    <span className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl text-sm font-bold border border-sky-100">{profile.other_service}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                                                <MapPin size={20} className="text-sky-600" /> Coverage
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <p className="text-sm font-bold text-slate-600">Based in <span className="text-slate-900">{profile.base_location}</span></p>
                                                <div className="h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                                    <div className="h-full bg-sky-600 rounded-full" style={{ width: '70%' }} />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight">Active radius: {profile.service_radius} miles</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "verification" && (
                            <motion.div
                                key="verification"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-3xl"
                            >
                                <section className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                                    <div className="p-8 md:p-10 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-sky-600 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-sky-100">
                                                <ShieldCheck size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900">Verification Center</h3>
                                                <p className="text-slate-500 font-medium">Get verified and stand out to customers.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {profile.is_verified ? (
                                                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-2xl font-black text-sm border-2 border-emerald-200">
                                                    <CheckCircle2 size={18} />
                                                    <span>VERIFIED MEMBER</span>
                                                </div>
                                            ) : profile.insurance_doc_url ? (
                                                <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-5 py-2.5 rounded-2xl font-black text-sm border-2 border-amber-200">
                                                    <Clock size={18} />
                                                    <span>UNDER REVIEW</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2.5 rounded-2xl font-black text-sm border-2 border-red-200">
                                                    <AlertCircle size={18} />
                                                    <span>NOT VERIFIED</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-10">
                                        {profile.insurance_doc_url ? (
                                            <div className="space-y-8">
                                                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[32px] flex items-start gap-6">
                                                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-emerald-900 mb-1">Documents Submitted</h4>
                                                        <p className="text-emerald-700/80 font-medium mb-4">
                                                            We've received your certificates and our team is currently reviewing them. 
                                                            You'll be notified via email once your status is updated.
                                                        </p>
                                                        <a
                                                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${profile.insurance_doc_url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-emerald-600 font-black hover:underline"
                                                        >
                                                            <FileText size={18} /> View Submitted Document
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Verification Details</p>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-500">Insurer</p>
                                                            <p className="font-black text-slate-800">{profile.insurer_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-500">Public Visibility</p>
                                                            <p className="font-black text-emerald-600">{profile.insurance_visible ? "Publicly Visible" : "Hidden"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleVerificationSubmit} className="space-y-8">
                                                {verifyError && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3">
                                                        <AlertCircle size={18} /> {verifyError}
                                                    </motion.div>
                                                )}

                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-black text-slate-700 uppercase tracking-tight">Insurer Name</label>
                                                        <input 
                                                            name="insurerName" 
                                                            required 
                                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 outline-none focus:border-sky-500 transition-all font-bold placeholder:text-slate-300" 
                                                            placeholder="Who is your provider?"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-black text-slate-700 uppercase tracking-tight">Public Liability Document</label>
                                                        <div className="relative group">
                                                            <input 
                                                                name="insuranceDoc" 
                                                                type="file" 
                                                                required
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-8 text-center transition-colors group-hover:border-sky-300 group-hover:bg-sky-50/30">
                                                                <div className="w-16 h-16 bg-white rounded-2xl mx-auto shadow-sm flex items-center justify-center text-slate-400 mb-4">
                                                                    <FileText size={24} />
                                                                </div>
                                                                <p className="font-black text-slate-700">Drop your file or click to browse</p>
                                                                <p className="text-sm text-slate-400 font-medium">PDF, JPG or PNG (Max 5MB)</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-4 bg-[#F1F5F9] p-6 rounded-[24px]">
                                                        <input 
                                                            id="insuranceVisible"
                                                            type="checkbox" 
                                                            checked={insuranceVisible}
                                                            onChange={(e) => setInsuranceVisible(e.target.checked)}
                                                            className="mt-1 w-5 h-5 rounded-lg text-sky-600 focus:ring-0 cursor-pointer"
                                                        />
                                                        <label htmlFor="insuranceVisible" className="cursor-pointer">
                                                            <p className="font-black text-slate-800">Make insurance visible on profile</p>
                                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Highly recommended. Showing your insurance documents increases initial trust by up to 80% based on our platform data.</p>
                                                        </label>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-black text-slate-700 uppercase tracking-tight">Awards / Certificates (Optional)</label>
                                                        <textarea 
                                                            name="awards" 
                                                            rows={3} 
                                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 outline-none focus:border-sky-500 transition-all font-bold placeholder:text-slate-300 resize-none" 
                                                            placeholder="List any professional accolades..."
                                                        />
                                                    </div>
                                                </div>

                                                <button 
                                                    type="submit" 
                                                    disabled={isVerifying}
                                                    className="w-full bg-[#1E3A8A] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-900/10 hover:bg-sky-700 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:transform-none flex justify-center items-center"
                                                >
                                                    {isVerifying && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />}
                                                    Submit Application
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "settings" && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-2xl"
                            >
                                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
                                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Settings size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Account Settings</h3>
                                    <p className="text-slate-500 font-medium mb-10">Advanced configuration and security options.</p>
                                    
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-sky-200 transition-colors">
                                            <div className="text-left">
                                                <p className="font-black text-slate-800">Email Notifications</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Active</p>
                                            </div>
                                            <div className="w-12 h-6 bg-sky-600 rounded-full flex items-center justify-end px-1">
                                                <div className="w-4 h-4 bg-white rounded-full" />
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-red-200 transition-colors opacity-50 cursor-not-allowed">
                                            <div className="text-left">
                                                <p className="font-black text-slate-800">Change Password</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight text-red-400">Locked</p>
                                            </div>
                                            <Settings size={18} className="text-slate-300" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
