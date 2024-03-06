'use client';
import Sidebar from "@/components/shared/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { ThemeCustomizer } from "@/components/shared/theme-customizer";
import { useAuth } from "@clerk/nextjs";
import { checkUserExists } from "@/lib/actions/user.actions";
import React, { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userId } = useAuth();
  const [userInfoExists, setUserInfoExists] = React.useState(false);
  

  useEffect(()=> {
    if(userId) {
      checkUserExists(userId).then((res) => {
        setUserInfoExists(res.userExists);
      });
    }
  },[userId])

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 h-[calc(100vh-16px)] bg-primary-800 border-r border-primary-700 transition-colors duration-300">
        <Sidebar />
      </div>
      <div className="flex-1  transition-colors duration-300 p-2">
        <div className=" bg-transparent  h-[calc(100vh-20px)] rounded-md">
          <div className="flex justify-end items-center p-4">
            <ModeToggle />
            <ThemeCustomizer  />
          </div>
          <div className="relative  overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
