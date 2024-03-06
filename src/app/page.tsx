import { About } from "@/components/landing-page/About";
import { Cta } from "@/components/landing-page/Cta";
import { FAQ } from "@/components/landing-page/FAQ";
import { Features } from "@/components/landing-page/Features";
import { Footer } from "@/components/landing-page/Footer";
import { Hero } from "@/components/landing-page/Hero";
import { HowItWorks } from "@/components/landing-page/HowItWorks";
import { Navbar } from "@/components/landing-page/Navbar";
import { Newsletter } from "@/components/landing-page/Newsletter";
import { Pricing } from "@/components/landing-page/Pricing";
import { ScrollToTop } from "@/components/landing-page/ScrollToTop";
import { Services } from "@/components/landing-page/Services";
import { Sponsors } from "@/components/landing-page/Sponsors";
import { Team } from "@/components/landing-page/Team";
import { Testimonials } from "@/components/landing-page/Testimonials";
import { getUserInfo } from "@/lib/actions/onbaording.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }
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
