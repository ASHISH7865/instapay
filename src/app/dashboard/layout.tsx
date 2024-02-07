"use client";
import Sidebar from "@/components/pages/dashboard/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { ThemeCustomizer } from "@/components/shared/theme-customizer";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1  transition-colors duration-300 p-2  ">
        <div className=" bg-transparent  border h-[calc(100vh-16px)]">
          <div className="flex justify-end items-center p-4 ">
            <ModeToggle />
            <ThemeCustomizer  />
          </div>
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
