import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

interface TestimonialProps {
    image: string
    name: string
    role: string
    company: string
    comment: string
    rating: number
}

const testimonials: TestimonialProps[] = [
    {
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        name: 'Sarah Chen',
        role: 'Product Manager',
        company: 'TechCorp',
        comment: 'Instapay has completely transformed how I handle money transfers. The instant notifications and security features give me peace of mind.',
        rating: 5
    },
    {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        name: 'David Rodriguez',
        role: 'Freelance Designer',
        company: 'Self-employed',
        comment: 'As someone who works with international clients, Instapay&apos;s global transfer feature is a game-changer. Fast, reliable, and cost-effective.',
        rating: 5
    },
    {
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        name: 'Emily Watson',
        role: 'Small Business Owner',
        company: 'Watson&apos;s Cafe',
        comment: 'The business features are incredible. I can track all transactions, manage team expenses, and get detailed analytics. Highly recommended!',
        rating: 5
    },
    {
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        name: 'Marcus Johnson',
        role: 'Student',
        company: 'University of Tech',
        comment: 'Perfect for splitting bills with roommates and managing my student budget. The app is intuitive and the customer support is amazing.',
        rating: 5
    },
    {
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        name: 'Lisa Park',
        role: 'Marketing Director',
        company: 'Growth Inc',
        comment: 'The security features are top-notch. I feel completely safe using Instapay for all my financial transactions.',
        rating: 5
    },
    {
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        name: 'Alex Thompson',
        role: 'Software Engineer',
        company: 'Innovate Labs',
        comment: 'Clean interface, fast performance, and excellent UX. This is how modern banking should feel.',
        rating: 5
    }
]

const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
    ))
}

export const Testimonials = () => {
    return (
        <section className='container py-24 sm:py-32'>
            <div className='text-center space-y-4 mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
                    Loved by
                    <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> thousands</span>
                    {' '}of users worldwide
                </h2>
                <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                    See what our community has to say about their experience with Instapay
                </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {testimonials.map(({ image, name, role, company, comment, rating }: TestimonialProps, index) => (
                    <Card key={index} className='group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:-translate-y-1'>
                        <CardHeader className='pb-4'>
                            <div className='flex items-start justify-between mb-4'>
                                <Avatar className='w-12 h-12'>
                                    <AvatarImage alt={name} src={image} />
                                    <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white'>
                                        {name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <Quote className='h-6 w-6 text-blue-500/20 group-hover:text-blue-500 transition-colors' />
                            </div>

                            <div className='flex items-center gap-1 mb-3'>
                                {renderStars(rating)}
                            </div>

                            <p className='text-muted-foreground text-sm leading-relaxed'>
                                &quot;{comment}&quot;
                            </p>
                        </CardHeader>

                        <CardContent className='pt-0'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='font-semibold text-sm'>{name}</p>
                                    <p className='text-xs text-muted-foreground'>{role} at {company}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Trust indicators */}
            <div className='mt-16 text-center'>
                <div className='inline-flex items-center gap-6 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-full'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        <span className='text-sm font-medium'>4.9/5 rating</span>
                    </div>
                    <div className='w-px h-4 bg-slate-300 dark:bg-slate-600'></div>
                    <span className='text-sm font-medium'>100K+ reviews</span>
                    <div className='w-px h-4 bg-slate-300 dark:bg-slate-600'></div>
                    <span className='text-sm font-medium'>Trusted by millions</span>
                </div>
            </div>
        </section>
    )
}
