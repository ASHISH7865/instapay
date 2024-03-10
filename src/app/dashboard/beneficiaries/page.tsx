import React from 'react';
import AllBeneficiary from '@/app/dashboard/beneficiaries/components/all-beneficiary';
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb';
import { getBeneficiariesByUserId } from '@/lib/actions/beneficiary.actions';
import { auth, ClerkLoading } from '@clerk/nextjs';
import Spinner from '@/components/shared/spinner';
import CreateWalletOverlay from '@/components/shared/CreateWalletOverlay';

const Beneficiary = async () => {
  return (
    <div className="p-4 relative">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/beneficiaries">
          Beneficiaries
        </BreadcrumbItem>
      </Breadcrumbs>
      <p className="text-2xl font-bold"> Beneficiaries Dashboard</p>
      <div className="mt-5">{/* <AllBeneficiary beneficiaries={{}} /> */}</div>
    </div>
  );
};

export default Beneficiary;
