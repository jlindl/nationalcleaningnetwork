import Link from "next/link";
import { Shield, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6 group cursor-default">
                            <div className="bg-[#3B82F6] text-white p-2 rounded-xl">
                                <Shield className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-2xl text-white tracking-tight">
                                National<span className="text-blue-400">Cleaning</span>Network
                            </span>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
                            Transforming the cleaning industry by connecting independent professionals directly with local demand. No middlemen, no commissions, just growth.
                        </p>
                        <div className="flex space-x-4">
                            {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#3B82F6] hover:text-white transition-all duration-300 transform hover:scale-110">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-tight">For Providers</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/onboarding" className="hover:text-blue-400 transition-colors">Join the Network</Link></li>
                            <li><Link href="/login" className="hover:text-blue-400 transition-colors">Provider Dashboard</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Safety Guide</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} National Cleaning Network. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
