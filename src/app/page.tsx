import { About } from '@/components/landing-page/About'
import { Cta } from '@/components/landing-page/Cta'
import { FAQ } from '@/components/landing-page/FAQ'
import { Features } from '@/components/landing-page/Features'
import { Footer } from '@/components/landing-page/Footer'
import { Hero } from '@/components/landing-page/Hero'
import { HowItWorks } from '@/components/landing-page/HowItWorks'
import { Navbar } from '@/components/landing-page/Navbar'
import { Pricing } from '@/components/landing-page/Pricing'
import { ScrollToTop } from '@/components/landing-page/ScrollToTop'
import { Security } from '@/components/landing-page/Security'
import { Testimonials } from '@/components/landing-page/Testimonials'
import { TrustIndicators } from '@/components/landing-page/TrustIndicators'
import { MobileShowcase } from '@/components/landing-page/MobileShowcase'
import { Comparison } from '@/components/landing-page/Comparison'
import { FloatingCTA } from '@/components/landing-page/FloatingCTA'
import { NotificationBanner } from '@/components/landing-page/NotificationBanner'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

// Separate component for authentication check to optimize loading
function AuthCheck() {
  const { userId } = auth()

  if (userId) {
    redirect('/dashboard')
  }

  return null
}

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/30'>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      <NotificationBanner />
      <Navbar />
      <Hero />
      <TrustIndicators />
      <Features />
      <HowItWorks />
      <Security />
      <MobileShowcase />
      <Comparison />
      <About />
      <Testimonials />
      <Pricing />
      <Cta />
      <FAQ />
      <Footer />
      <ScrollToTop />
      <FloatingCTA />
    </main>
  )
}
