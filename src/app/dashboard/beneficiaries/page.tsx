import React from "react";
import AllBeneficiary from "@/components/pages/dashboard/beneficiary/all-beneficiary";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import { getBeneficiariesByUserId } from "@/lib/actions/beneficiary.actions";
import { auth, ClerkLoading } from "@clerk/nextjs";
import Spinner from "@/components/shared/spinner";

const Beneficiary = async () => {
  const { userId } = auth();
  const beneficiaries = userId && (await getBeneficiariesByUserId(userId));
  return (
    <div className="p-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/beneficiaries">Beneficiaries</BreadcrumbItem>
      </Breadcrumbs>
      <p className="text-2xl font-bold"> Beneficiaries Dashboard</p>
      <div className="mt-5">
        {!beneficiaries ? (
          <ClerkLoading>
            <Spinner />
          </ClerkLoading>
        ) : ( 
          <AllBeneficiary beneficiaries={beneficiaries.data} />
        )}
      </div>
    </div>
  );
};

export default Beneficiary;
