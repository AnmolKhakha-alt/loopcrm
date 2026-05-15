import { HeroSection } from "@/components/landing/hero"
import { SocialProofSection } from "@/components/landing/stats"
import { FeaturesSection } from "@/components/landing/features"
import { HowItWorksSection } from "@/components/landing/steps"
import { PricingSection } from "@/components/landing/pricing"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { FAQSection } from "@/components/landing/faq"
import { CTASection } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <HeroSection />
      <div id="stats">
        <SocialProofSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <div id="faq">
        <FAQSection />
      </div>
      <CTASection />
      <Footer />
    </main>
  )
}