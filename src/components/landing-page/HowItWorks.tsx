import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, CreditCard, Zap, CheckCircle } from 'lucide-react'

interface StepProps {
    step: number
    icon: JSX.Element
    title: string
    description: string
}

const steps: StepProps[] = [
    {
        step: 1,
        icon: <UserPlus className="h-6 w-6" />,
        title: 'Create Account',
        description: 'Sign up in under 2 minutes with just your email and phone number. No complicated forms.',
    },
    {
        step: 2,
        icon: <CreditCard className="h-6 w-6" />,
        title: 'Add Payment Method',
        description: 'Link your bank account or add a debit card. We use bank-level security to keep your data safe.',
    },
    {
        step: 3,
        icon: <Zap className="h-6 w-6" />,
        title: 'Start Sending Money',
        description: 'Send money instantly to anyone with just their phone number or email address.',
    },
    {
        step: 4,
        icon: <CheckCircle className="h-6 w-6" />,
        title: 'Track & Manage',
        description: 'Monitor your transactions, set budgets, and get insights into your spending habits.',
    },
]

export const HowItWorks = () => {
    return (
        <section className='container py-24 sm:py-32'>
            <div className='text-center space-y-4 mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
                    Get started in
                    <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> 4 simple steps</span>
                </h2>
                <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                    Setting up your Instapay account is quick and easy. Start sending money in minutes, not days.
                </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
                {steps.map(({ step, icon, title, description }: StepProps) => (
                    <Card key={step} className='group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative overflow-hidden'>
                        <CardHeader className='pb-4'>
                            <div className='flex items-center justify-between mb-4'>
                                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg'>
                                    {step}
                                </div>
                                <div className='w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform'>
                                    {icon}
                                </div>
                            </div>
                            <CardTitle className='text-lg font-semibold text-left'>{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground text-sm leading-relaxed'>
                                {description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Connection lines for desktop */}
            <div className='hidden lg:flex justify-center items-center relative mt-16 mx-auto w-full max-w-2xl'>
                <div className='w-1/2 h-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20'></div>
                <div className='w-1/2 h-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20'></div>
            </div>

            {/* Bottom CTA */}
            <div className='text-center mt-16'>
                <div className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow cursor-pointer'>
                    <span>Start your free account</span>
                    <CheckCircle className='h-4 w-4' />
                </div>
            </div>
        </section>
    )
}
