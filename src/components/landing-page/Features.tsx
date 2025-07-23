import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Smartphone, TrendingUp, Users, CreditCard } from 'lucide-react'

interface FeatureProps {
    title: string
    description: string
    icon: JSX.Element
    color: string
}

const features: FeatureProps[] = [
    {
        title: 'Instant Transfers',
        description: 'Send money to anyone, anywhere in seconds. No waiting, no delays.',
        icon: <Zap className="h-6 w-6" />,
        color: 'text-blue-600'
    },
    {
        title: 'Bank-Level Security',
        description: '256-bit encryption and biometric authentication keep your money safe.',
        icon: <Shield className="h-6 w-6" />,
        color: 'text-green-600'
    },
    {
        title: 'Smart Analytics',
        description: 'Track spending patterns and get insights to improve your financial health.',
        icon: <TrendingUp className="h-6 w-6" />,
        color: 'text-purple-600'
    },
    {
        title: 'Global Payments',
        description: 'Send money internationally with competitive exchange rates.',
        icon: <Users className="h-6 w-6" />,
        color: 'text-orange-600'
    },
    {
        title: 'Mobile-First Design',
        description: 'Optimized for your smartphone with intuitive, touch-friendly interface.',
        icon: <Smartphone className="h-6 w-6" />,
        color: 'text-indigo-600'
    },
    {
        title: 'Virtual Cards',
        description: 'Create virtual cards for online shopping with enhanced security.',
        icon: <CreditCard className="h-6 w-6" />,
        color: 'text-pink-600'
    },
]

const highlights = [
    'Zero hidden fees',
    '24/7 customer support',
    'Real-time notifications',
    'Budget tracking',
    'Bill reminders',
    'Investment options'
]

export const Features = () => {
    return (
        <section id='features' className='container py-24 sm:py-32'>
            <div className='text-center space-y-4 mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
                    Everything you need for
                    <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> modern banking</span>
                </h2>
                <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                    Built for the digital age with features that make managing your money simple, secure, and smart.
                </p>
            </div>

            {/* Feature highlights */}
            <div className='flex flex-wrap justify-center gap-3 mb-16'>
                {highlights.map((highlight: string) => (
                    <Badge key={highlight} variant='secondary' className='text-sm px-4 py-2'>
                        {highlight}
                    </Badge>
                ))}
            </div>

            {/* Main features grid */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {features.map(({ title, description, icon, color }: FeatureProps) => (
                    <Card key={title} className='group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:-translate-y-1'>
                        <CardHeader className='pb-4'>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform ${color}`}>
                                {icon}
                            </div>
                            <CardTitle className='text-lg font-semibold mt-4'>{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground text-sm leading-relaxed mb-4'>
                                {description}
                            </p>
                            <div className='flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all'>
                                Learn more
                                <ArrowRight className='h-4 w-4' />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className='text-center mt-16'>
                <div className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow'>
                    <span>Ready to get started?</span>
                    <ArrowRight className='h-4 w-4' />
                </div>
            </div>
        </section>
    )
}
