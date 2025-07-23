
import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Users, Globe, Shield } from 'lucide-react'
import Link from 'next/link'

const achievements = [
    {
        icon: <Users className="h-6 w-6" />,
        value: "100K+",
        label: "Active Users"
    },
    {
        icon: <Globe className="h-6 w-6" />,
        value: "50+",
        label: "Countries"
    },
    {
        icon: <Shield className="h-6 w-6" />,
        value: "99.9%",
        label: "Uptime"
    },
    {
        icon: <Award className="h-6 w-6" />,
        value: "4.9/5",
        label: "User Rating"
    }
]

export const About = () => {
    return (
        <section className='container py-24 sm:py-32'>
            <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
                <div className='space-y-8'>
                    <div className='space-y-4'>
                        <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
                            Building the future of
                            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> digital finance</span>
                        </h2>
                        <p className='text-xl text-muted-foreground leading-relaxed'>
                            We&apos;re on a mission to democratize financial services and make money management accessible to everyone.
                            Our platform combines cutting-edge technology with user-centric design to create a banking experience
                            that&apos;s both powerful and simple.
                        </p>
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-xl font-semibold'>Why choose Instapay?</h3>
                        <ul className='space-y-3'>
                            <li className='flex items-center gap-3'>
                                <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                                <span className='text-muted-foreground'>Bank-level security with 256-bit encryption</span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <div className='w-2 h-2 bg-purple-600 rounded-full'></div>
                                <span className='text-muted-foreground'>Instant transfers with zero hidden fees</span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                                <span className='text-muted-foreground'>24/7 customer support in multiple languages</span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <div className='w-2 h-2 bg-orange-600 rounded-full'></div>
                                <span className='text-muted-foreground'>AI-powered insights for better financial decisions</span>
                            </li>
                        </ul>
                    </div>

                    <Button size="lg" className="group">
                        <Link href="/sign-up" className="flex items-center gap-2">
                            Join thousands of users
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className='relative'>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

                        {/* Achievement cards */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                            {achievement.icon}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {achievement.value}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {achievement.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Company info */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="font-semibold mb-3">Our Commitment</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                We believe everyone deserves access to modern financial tools. That&apos;s why we&apos;ve built Instapay
                                to be inclusive, secure, and easy to use. Join us in shaping the future of digital payments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
