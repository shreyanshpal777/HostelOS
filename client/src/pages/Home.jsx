import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AISection from "@/components/landing/AISection";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const HERO_IMAGE = "https://media.base44.com/images/public/6a3c206218b9ac32cd6c9546/c2d01106a_generated_2b56ae17.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      <HeroSection heroImage={HERO_IMAGE} />
      <FeaturesSection />
      <AISection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}