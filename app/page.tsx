"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <Hero />

      {/* Short value prop section to fill some space for scrolling effect */}
      <section className="py-24 px-4 md:px-6 container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose National Cleaning Network?</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            We connect homeowners and businesses with top-rated cleaning professionals.
            Our platform is completely free to use, ensuring you find the best match for your needs without any hidden fees.
          </p>
        </div>
      </section>
    </main>
  );
}
