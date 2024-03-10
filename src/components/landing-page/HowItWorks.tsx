import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, ShieldCheck, Award } from 'lucide-react';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <IndianRupee />,
    title: 'Instant Transfers',
    description:
      'Transfer money instantly to friends and family, anytime, anywhere with our fast and secure transaction system.',
  },
  {
    icon: <Users />,
    title: 'Community Collaboration',
    description:
      'Join our vibrant community! Easily split bills with friends, making shared expenses hassle-free.',
  },
  {
    icon: <ShieldCheck />,
    title: 'Secure Transactions',
    description:
      'Rest easy with our robust security measures ensuring safe transactions and protecting your financial data.',
  },
  {
    icon: <Award />,
    title: 'Rewards and Gamification',
    description:
      'Enjoy gamified features and rewards! Earn points for transactions and redeem exciting rewards from our partners.',
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{' '}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{' '}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Experience the convenience and features of Instapay with our simple
        step-by-step guide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
