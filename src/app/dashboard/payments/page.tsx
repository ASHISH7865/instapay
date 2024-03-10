import React from 'react';
import CreateWalletOverlay from '@/components/shared/CreateWalletOverlay';
import PaymentCard from './components/PaymentCard';
import {
  Section,
  SectionContent,
  SectionTitle,
} from '@/components/shared/Section';
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb';
import PaymentTransactionTable from './components/PaymentTransactionTable';

const Payments = () => {
  return (
    <div className=" relative">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/payments">Payment</BreadcrumbItem>
      </Breadcrumbs>
      <div>
        <p className="text-2xl font-bold"> Payment Dashboard</p>
      </div>
      <div className="flex flex-row items-center justify-center gap-2 flex-wrap mt-10">
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
          title="Request Money"
          buttonText="Request Money"
          description="Request money from a beneficiary"
          transactionLimit="1,00,000"
        />
      </div>
    </div>
  );
};

export default Payments;
