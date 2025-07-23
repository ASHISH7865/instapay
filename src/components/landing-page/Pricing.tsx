import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Check, Star, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

enum PopularPlanType {
    NO = 0,
    YES = 1,
}

interface PricingProps {
    title: string
    popular: PopularPlanType
    price: number
    description: string
    buttonText: string
    benefitList: string[]
    icon: JSX.Element
    color: string
}

const pricingList: PricingProps[] = [
    {
        title: 'Free',
        popular: 0,
        price: 0,
        description: 'Perfect for getting started with digital payments',
        buttonText: 'Get Started Free',
        icon: <Zap className="h-6 w-6" />,
        color: 'text-blue-600',
        benefitList: [
            'Unlimited domestic transfers',
            'Basic security features',
            'Mobile app access',
            'Email support',
            'Transaction history',
            'Basic analytics',
        ],
    },
    {
        title: 'Premium',
        popular: 1,
        price: 9,
        description: 'Best for individuals who want advanced features',
        buttonText: 'Start Free Trial',
        icon: <Star className="h-6 w-6" />,
        color: 'text-purple-600',
        benefitList: [
            'Everything in Free',
            'International transfers',
            'Priority customer support',
            'Advanced security features',
            'Virtual cards',
            'Investment options',
            'Budget tracking tools',
            'Real-time notifications',
        ],
    },
    {
        title: 'Business',
        popular: 0,
        price: 29,
        description: 'Perfect for teams and growing businesses',
        buttonText: 'Contact Sales',
        icon: <Crown className="h-6 w-6" />,
        color: 'text-orange-600',
        benefitList: [
            'Everything in Premium',
            'Team expense management',
            'Bulk payment capabilities',
            'Advanced analytics & reporting',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            'Multi-currency support',
        ],
    },
]

export const Pricing = () => {
    return (
        <section id='pricing' className='container py-24 sm:py-32'>
            <div className='text-center space-y-4 mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
                    Simple, transparent
                    <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> pricing</span>
                </h2>
                <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                    Choose the plan that&apos;s right for you. All plans include our core security features and 24/7 support.
                </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                {pricingList.map((pricing: PricingProps) => (
                    <Card
                        key={pricing.title}
                        className={`group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:-translate-y-1 ${pricing.popular === PopularPlanType.YES
                                ? 'ring-2 ring-purple-500/20 shadow-purple-500/10'
                                : ''
                            }`}
                    >
                        <CardHeader className='text-center pb-6'>
                            <div className='flex items-center justify-center mb-4'>
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center ${pricing.color}`}>
                                    {pricing.icon}
                                </div>
                            </div>

                            <CardTitle className='flex items-center justify-center gap-2'>
                                {pricing.title}
                                {pricing.popular === PopularPlanType.YES ? (
                                    <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0'>
                                        Most Popular
                                    </Badge>
                                ) : null}
                            </CardTitle>

                            <div className='space-y-2'>
                                <div className='flex items-baseline justify-center gap-1'>
                                    <span className='text-4xl font-bold'>${pricing.price}</span>
                                    <span className='text-muted-foreground'>/month</span>
                                </div>
                                {pricing.price === 0 && (
                                    <div className='text-sm text-green-600 dark:text-green-400 font-medium'>
                                        Forever free
                                    </div>
                                )}
                            </div>

                            <CardDescription className='text-base'>{pricing.description}</CardDescription>
                        </CardHeader>

                        <CardContent className='pb-6'>
                            <Button
                                className={`w-full group ${pricing.popular === PopularPlanType.YES
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                        : ''
                                    }`}
                            >
                                <Link href="/sign-up" className="flex items-center gap-2">
                                    {pricing.buttonText}
                                </Link>
                            </Button>
                        </CardContent>

                        <CardFooter className='pt-0'>
                            <div className='space-y-3 w-full'>
                                {pricing.benefitList.map((benefit: string) => (
                                    <div key={benefit} className='flex items-start gap-3'>
                                        <Check className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                                        <span className='text-sm text-muted-foreground'>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Additional info */}
            <div className='text-center mt-16'>
                <div className='bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 max-w-4xl mx-auto'>
                    <h3 className='text-xl font-semibold mb-4'>All plans include</h3>
                    <div className='grid md:grid-cols-3 gap-6 text-sm'>
                        <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span>256-bit encryption</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span>24/7 customer support</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span>Mobile app access</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span>Fraud protection</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span>Transaction monitoring</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-green-500' />
                            <span>No setup fees</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
