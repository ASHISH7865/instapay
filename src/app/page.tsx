'use client'
import { About } from "@/components/pages/landing-page/About";
import { Cta } from "@/components/pages/landing-page/Cta";
import { FAQ } from "@/components/pages/landing-page/FAQ";
import { Features } from "@/components/pages/landing-page/Features";
import { Footer } from "@/components/pages/landing-page/Footer";
import { Hero } from "@/components/pages/landing-page/Hero";
import { HowItWorks } from "@/components/pages/landing-page/HowItWorks";
import { Navbar } from "@/components/pages/landing-page/Navbar";
import { Newsletter } from "@/components/pages/landing-page/Newsletter";
import { Pricing } from "@/components/pages/landing-page/Pricing";
import { ScrollToTop } from "@/components/pages/landing-page/ScrollToTop";
import { Services } from "@/components/pages/landing-page/Services";
import { Sponsors } from "@/components/pages/landing-page/Sponsors";
import { Team } from "@/components/pages/landing-page/Team";
import { Testimonials } from "@/components/pages/landing-page/Testimonials";


export default function Home() {
  return (
    <main className="">
     <Navbar />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
