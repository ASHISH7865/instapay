"use client";
import React, { useState, useEffect } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddMoney from "@/components/modal/add-money";
import { Badge } from "@/components/ui/badge";
import CreateWalletOverlay from "@/components/shared/CreateWalletOverlay";
import CheckBalance from "./components/CheckBalance";
import { WalletContextProvider } from "@/provider/wallet-provider";

const Wallet = () => {

  const walletTransactions = [
    { transactionId: "1", type: "credit", amount: 1000, status: "success" },
    { transactionId: "2", type: "debit", amount: 200, status: "failed" },
    { transactionId: "3", type: "credit", amount: 500, status: "success" },
    { transactionId: "4", type: "debit", amount: 100, status: "success" },
    { transactionId: "5", type: "credit", amount: 1000, status: "success" },
    { transactionId: "6", type: "debit", amount: 200, status: "failed" },
    { transactionId: "7", type: "credit", amount: 500, status: "success" },
    { transactionId: "8", type: "debit", amount: 100, status: "success" },
  ];

  return (
    <div className="flex flex-col p-4 relative">
     <WalletContextProvider>
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/Wallet">Wallet</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-5 flex justify-between">
        <p className="text-2xl font-bold">Wallet Dashboard</p>
        <AddMoney />
      </div>
      <div className="flex gap-6">
       <CheckBalance />
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
      <CreateWalletOverlay />
      </WalletContextProvider>
    </div>
  );
};

export default Wallet;
