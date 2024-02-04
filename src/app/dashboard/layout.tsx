"use client";
import Sidebar from "@/components/pages/dashboard/components/sidebar";
import { ModeToggle } from "@/components/pages/landing-page/mode-toggle";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1   transition-colors duration-300 p-2  ">
        <div className=" bg-secondary rounded-md border h-[calc(100vh-16px)]">
          <div className="flex justify-between items-center p-4 ">
            <span className="font-bold">Dashboard</span>
            <ModeToggle />
          </div>
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
