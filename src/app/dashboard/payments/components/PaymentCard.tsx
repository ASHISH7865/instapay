import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentCardProps {
  title: string;
  description: string;
  transactionLimit: string;
  buttonText: string;
}

const PaymentCard = ({ title, buttonText, description, transactionLimit }: PaymentCardProps) => {
  return (
 
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center ">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardContent>
            <span className="text-sm font-bold mt-5">
              Transaction limit: <span className="text-primary">₹ {transactionLimit}</span>
            </span>
          </CardContent>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button type="button" variant="secondary">
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
  );
};


export default PaymentCard;