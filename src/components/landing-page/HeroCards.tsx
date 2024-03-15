import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ArrowRight, BarChart2, DollarSign, ShieldCheck } from 'lucide-react'
import { ThemeCustomizer } from '@/components/shared/theme-customizer'

const featureCards = [
  {
    title: 'Instant Transfers',
    description: 'Transfer money instantly to friends and family, anytime, anywhere.',
    icon: <ArrowRight className='w-8 h-8 text-primary' />,
  },
  {
    title: 'Secure Transactions',
    description: 'Rest easy with our robust security measures ensuring safe transactions.',
    icon: <ShieldCheck className='w-8 h-8 text-primary' />,
  },
  {
    title: 'Bill Splitting',
    description: 'Easily split bills with friends, making shared expenses hassle-free.',
    icon: <DollarSign className='w-8 h-8 text-primary' />,
  },
  {
    title: 'Budgeting Tools',
    description: 'Take control of your finances with intuitive budgeting tools at your fingertips.',
    icon: <BarChart2 className='w-8 h-8 text-primary' />,
  },
]

export const HeroCards = () => {
  return (
    <div className=''>
      <Carousel className='w-full max-w-xs'>
        <CarouselPrevious className='' />
        <CarouselNext className='' />
        <CarouselContent className=''>
          {featureCards.map((feature, index) => (
            <CarouselItem key={index} className='w-full h-full'>
              <Card className='w-full h-full'>
                <CardHeader>
                  <CardTitle>
                    <div className='flex items-center gap-2'>
                      {feature.icon}
                      <span>{feature.title}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className='mt-4 flex  w-[300px] items-center'>
        <p className='text-muted-foreground text-lg'>
          Customize your experience with our theme customizer.
        </p>
        <ThemeCustomizer />
      </div>
    </div>
  )
}
