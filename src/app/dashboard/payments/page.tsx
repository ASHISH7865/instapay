import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Transactions = [
  {
    transactionId: "1",
    transactionType: "send",
    to: "John Doe",
    from: "Jane Doe",
    amount: 1000,
    status: "success",
  },
  {
    transactionId: "2",
    transactionType: "receive",
    to: "John Doe",
    from: "Jane Doe",
    amount: 200,
    status: "failed",
  },
  {
    transactionId: "3",
    transactionType: "send",
    to: "John Doe",
    from: "Jane Doe",
    amount: 500,
    status: "success",
  },
  {
    transactionId: "4",
    transactionType: "receive",
    to: "John Doe",
    from: "Jane Doe",
    amount: 100,
    status: "success",
  },
  {
    transactionId: "5",
    transactionType: "send",
    to: "John Doe",
    from: "Jane Doe",
    amount: 1000,
    status: "success",
  },
  {
    transactionId: "6",
    transactionType: "receive",
    to: "John Doe",
    from: "Jane Doe",
    amount: 200,
    status: "failed",
  },
  {
    transactionId: "7",
    transactionType: "send",
    to: "John Doe",
    from: "Jane Doe",
    amount: 500,
    status: "success",
  },
  {
    transactionId: "8",
    transactionType: "receive",
    to: "John Doe",
    from: "Jane Doe",
    amount: 100,
    status: "success",
  },
];

const Payments = () => {
  return (
    <div className="flex flex-col p-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/payments">Payment</BreadcrumbItem>
      </Breadcrumbs>
      <div>
        <p className="text-2xl font-bold"> Payment Dashboard</p>
      </div>
      <div className="flex gap-4 ">
        <PaymentCard
          title="Send Money"
          buttonText="Send Money"
          description="Send money to another wallet"
          transactionLimit="2,000"
        />
        <PaymentCard
          title="Request Money"
          buttonText="Request Money"
          description="Request money from another wallet"
          transactionLimit="5,000"
        />
        <PaymentCard
          title="Beneficiary Transfer"
          buttonText="Transfer Money"
          description="Transfer money to a beneficiary"
          transactionLimit="5,00,000"
        />
        <PaymentCard
          title="Request Money "
          buttonText="Request Money"
          description="Request money from a beneficiary"
          transactionLimit="1,00,000"
        />
      </div>
      <div className="mt-5">
        <p className="text-xl font-bold">Recent Transactions</p>
      </div>
      <div className="mt-5">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="">Transaction ID</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Transactions.map((item) => (
              <TableRow key={item.transactionId}>
                <TableCell className="font-medium">
                  {item.transactionId}
                </TableCell>
                <TableCell>{item.transactionType}</TableCell>
                <TableCell>{item.from}</TableCell>
                <TableCell>{item.to}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>
                  <Badge>{item.status}</Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button type="button" variant="secondary">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Payments;

interface PaymentCardProps {
  title: string;
  description: string;
  transactionLimit: string;
  buttonText: string;
}

const PaymentCard = ({
  title,
  buttonText,
  description,
  transactionLimit,
}: PaymentCardProps) => {
  return (
    <div className="mt-5">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center ">{title}</CardTitle>
          <CardDescription>
            {description}
            <div className="text-sm font-bold mt-5">
              Transaction limit:{" "}
              <span className="text-primary">₹ {transactionLimit}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button type="button" variant="secondary">
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
