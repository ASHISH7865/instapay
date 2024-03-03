"use client";
import React, { useState, useEffect } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Wallet2 } from "lucide-react";
import WalletPinModal from "@/components/modal/wallet-pin-modal";
import AddMoney from "@/components/modal/add-money";
import { Badge } from "@/components/ui/badge";

const Wallet = () => {
  const INR_SYMBOL = "₹";
  const [balance, setBalance] = useState(1200.0);
  const [hideBalance, setHideBalance] = useState(true);

  const walletTransactions = [
    { transactionId: "1", type: "credit", amount: 1000, status: "success" },
    { transactionId: "2", type: "debit", amount: 200, status: "failed" },
    { transactionId: "3", type: "credit", amount: 500, status: "success" },
    { transactionId: "4", type: "debit", amount: 100, status: "success" },
    { transactionId: "5", type: "credit", amount: 1000, status: "success" },
    { transactionId: "6", type: "debit", amount: 200, status: "failed" },
    { transactionId: "7", type: "credit", amount: 500, status: "success" },
    { transactionId: "8", type: "debit", amount: 100, status: "success" },
  ]

  return (
    <div className="flex flex-col p-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/Wallet">Wallet</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-5 flex justify-between">
        <p className="text-2xl font-bold">Wallet Dashboard</p>
        <AddMoney />
      </div>
      <div className="flex gap-6">
        <div className="mt-5">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet2 size={24} />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {hideBalance ? "****" : `${INR_SYMBOL} ${balance}`}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <WalletPinModal />
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-5">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {walletTransactions.map((item) => (
                <TableRow key={item.transactionId}>
                <TableCell className="font-medium">{item.transactionId}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                    <Badge>Active</Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                    <Button variant="secondary">View</Button>
                    <Button variant="default">Delete</Button>
                </TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>

      </div>
    </div>
  );
};

export default Wallet;
