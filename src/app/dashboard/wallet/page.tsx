"use client";
import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import AddMoneyModal from "@/components/modal/add-money";
import CreateWalletOverlay from "@/components/shared/CreateWalletOverlay";
import CheckBalance from "./components/CheckBalance";
import WalletTransactionsTable from "./components/WalletTransactionsTable";

const Wallet = () => {

  return (
    <div className="flex flex-col p-4 relative">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/Wallet">Wallet</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-5 flex justify-between">
        <p className="text-2xl font-bold">Wallet Dashboard</p>
        <AddMoneyModal />
      </div>
      <div className="flex gap-6">
       <CheckBalance />
      </div>
      <WalletTransactionsTable />
      <CreateWalletOverlay />
    </div>
  );
};

export default Wallet;
