import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { TestCategories } from "@/components/landing/TestCategories";
import { ParentDashboardPreview } from "@/components/landing/ParentDashboardPreview";
import { StudentGamificationSection } from "@/components/landing/StudentGamificationSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <TestCategories />
      <ParentDashboardPreview />
      <StudentGamificationSection />
      <SocialProofSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
};

export default Index;
