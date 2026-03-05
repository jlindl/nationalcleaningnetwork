import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="bg-[#1E3A8A] text-white p-1.5 rounded-lg">
                                <Shield className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">
                                National<span className="text-[#3B82F6]">Cleaning</span>Network
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            The transparent, reliable directory for finding vetted cleaning professionals across the UK. Zero booking fees, direct communication.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                            </li>
                            <li>
                                <Link href="#directory" className="hover:text-white transition-colors">Browse Directory</Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Providers */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Cleaners</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/onboarding" className="hover:text-white transition-colors">List Your Business</Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-white transition-colors">Provider Dashboard</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} National Cleaning Network. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
