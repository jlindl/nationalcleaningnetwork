import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OnboardingSuccess() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h1>
                <p className="text-slate-600 mb-8">
                    We've sent a verification email to your inbox. Please click the link to verify your account and access your dashboard.
                </p>
                <Link
                    href="/"
                    className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
