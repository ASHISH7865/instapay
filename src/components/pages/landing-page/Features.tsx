import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineInsights } from "react-icons/md";

interface FeatureProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const features: FeatureProps[] = [
  {
    title: "Instant Money Transfers",
    description:
      "Transfer money instantly to friends and family with our fast and secure transaction system.",
    icon: <FaMoneyBillTransfer size={50} />,
  },
  {
    title: "Intuitive User Interface",
    description:
      "Enjoy a user-friendly interface designed to make managing your e-wallet effortless.",
    icon: <CgWebsite  size={50} />,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Gain valuable insights into your spending habits and financial patterns with our AI-powered analytics.",
    icon: <MdOutlineInsights size={50} />,
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Secure Transactions",
  "Rewards & Gamification",
  "Community Collaboration",
  "Bill Splitting",
  "Budgeting Tools",
];

export const Features = () => {
  return (
    <section id="features" className="container py-50 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, icon }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-primary">{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <div className="flex justify-center items-center">
                {icon}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
