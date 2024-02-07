import AllBeneficiary from "@/components/pages/dashboard/beneficiary/all-beneficiary";
import { ThemeCustomizer } from "@/components/shared/theme-customizer";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import React from "react";

const Beneficiary = () => {
  return (
    <div className="p-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/beneficiaries">Beneficiaries</BreadcrumbItem>
      </Breadcrumbs>
      <p className="text-2xl font-bold"> Beneficiaries Dashboard</p>
      <div className="mt-5">
        <AllBeneficiary />
      </div>
    </div>
  );
};

export default Beneficiary;
