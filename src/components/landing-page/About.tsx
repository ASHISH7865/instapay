import { Statistics } from './Statistics'
import Image from 'next/image'

export const About = () => {
  return (
    <section id='about' className='container py-24 sm:py-32'>
      <div className='bg-muted/50 border rounded-lg py-12'>
        <div className='px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12'>
          <Image
            src={'/assets/pilot.png'}
            alt=''
            className='w-[300px] object-contain rounded-lg'
            width={300}
            height={300}
          />
          <div className='bg-green-0 flex flex-col justify-between'>
            <div className='pb-6'>
              <h2 className='text-3xl md:text-4xl font-bold'>
                <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
                  About{' '}
                </span>
                Company
              </h2>
              <p className='text-xl text-muted-foreground mt-4'>
                We are a team of passionate developers building the next generation of financial
                tools. Our mission is to make finance simple, accessible and secure for everyone. We
                are committed to building a platform that empowers people to take control of their
                finances and achieve their goals.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  )
}
