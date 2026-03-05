import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import TrustMetrics from "@/components/TrustMetrics";
import HowItWorks from "@/components/HowItWorks";
import DirectoryPreview from "@/components/DirectoryPreview";
import ForCleaners from "@/components/ForCleaners";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <NavBar />
      <Hero />
      <TrustMetrics />
      <HowItWorks />
      <DirectoryPreview />
      <ForCleaners />
      <Footer />
    </main>
  );
}
