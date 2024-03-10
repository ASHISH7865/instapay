"use client";
import React, { useEffect } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import AddMoneyModal from "@/components/modal/add-money";
import CreateWalletOverlay from "@/components/shared/CreateWalletOverlay";
import CheckBalance from "./components/CheckBalance";
import TransactionsTable from "./components/WalletTransactionsTable";
import { Transaction } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { getWalletDepositTransactions } from "@/lib/actions/transactions.actions";

const Wallet = () => {

  const { userId } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getWalletDepositTransactions(userId).then((res) => {
        setTransactions(res.transactions!);
        setLoading(false);
      });
    }
  }, [userId]);

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
      <TransactionsTable transactionHeading="Deposit Transactions" transactions={transactions} loading={loading} />
    </div>
  );
};

export default Wallet;
