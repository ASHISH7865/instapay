import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface FAQProps {
    question: string
    answer: string
    value: string
}

const FAQList: FAQProps[] = [
    {
        question: 'How secure is Instapay?',
        answer: 'Instapay uses bank-level 256-bit encryption and is SOC 2 Type II certified. We implement multi-factor authentication, real-time fraud detection, and secure your data with the same standards used by major banks.',
        value: 'item-1',
    },
    {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees! We believe in complete transparency. You&apos;re paying upfront. Most transfers are free, and we clearly display any applicable fees before you confirm.',
        value: 'item-2',
    },
    {
        question: 'How fast are money transfers?',
        answer: 'Most transfers are instant! Domestic transfers typically complete within seconds, while international transfers usually take 1-2 business days depending on the destination country and banking hours.',
        value: 'item-3',
    },
    {
        question: 'What countries do you support?',
        answer: 'We currently support transfers to over 50 countries worldwide. Our network is constantly expanding, and we&apos;re adding new countries regularly. Check our app for the most up-to-date list.',
        value: 'item-4',
    },
    {
        question: 'Can I use Instapay for business?',
        answer: 'Yes! We offer business accounts with additional features like team expense management, detailed analytics, and bulk payment capabilities. Perfect for freelancers, small businesses, and growing companies.',
        value: 'item-5',
    },
    {
        question: 'What if I have an issue with a transfer?',
        answer: 'Our 24/7 customer support team is here to help! You can reach us through live chat, email, or phone. Most issues are resolved within hours, and we provide full transaction protection.',
        value: 'item-6',
    },
    {
        question: 'Is my personal information safe?',
        answer: 'Absolutely. We follow strict data protection regulations and never share your personal information with third parties without your explicit consent. Your privacy and security are our top priorities.',
        value: 'item-7',
    },
    {
        question: 'How do I get started with Instapay?',
        answer: 'Getting started is easy! Simply download our app, create an account in under 2 minutes, add your payment method, and you&apos;re ready to send money instantly. No complicated setup required.',
        value: 'item-8',
    },
]

export const FAQ = () => {
    return (
        <section id='faq' className='container py-24 sm:py-32'>
            <div className='text-center space-y-4 mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
                    Frequently Asked
                    <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'> Questions</span>
                </h2>
                <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                    Everything you need to know about Instapay. Can&apos;t find the answer you&apos;re looking for?
                    Please reach out to our friendly support team.
                </p>
            </div>

            <div className='max-w-3xl mx-auto'>
                <Accordion type='single' collapsible className='w-full space-y-4'>
                    {FAQList.map(({ question, answer, value }: FAQProps) => (
                        <AccordionItem key={value} value={value} className='border rounded-lg px-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'>
                            <AccordionTrigger className='text-left hover:no-underline py-6'>
                                <span className='font-semibold text-lg'>{question}</span>
                            </AccordionTrigger>
                            <AccordionContent className='pb-6'>
                                <p className='text-muted-foreground leading-relaxed'>{answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Contact CTA */}
            <div className='text-center mt-16'>
                <div className='bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 max-w-2xl mx-auto'>
                    <h3 className='text-xl font-semibold mb-4'>Still have questions?</h3>
                    <p className='text-muted-foreground mb-6'>
                        Our support team is here to help you 24/7. Get in touch and we&apos;ll get back to you as soon as possible.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Button className='group'>
                            <Link href='#' className='flex items-center gap-2'>
                                <Mail className='h-4 w-4' />
                                Email Support
                            </Link>
                        </Button>
                        <Button variant='outline' className='group'>
                            <Link href='#' className='flex items-center gap-2'>
                                <MessageCircle className='h-4 w-4' />
                                Live Chat
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
