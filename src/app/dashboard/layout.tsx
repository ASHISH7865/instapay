'use client';
import Sidebar from '@/components/shared/sidebar';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { ThemeCustomizer } from '@/components/shared/theme-customizer';
import { useAuth } from '@clerk/nextjs';
import { checkUserExists } from '@/lib/actions/user.actions';
import React, { useEffect } from 'react';
import { useWalletContext } from '@/provider/wallet-provider';
import CreateWalletOverlay from '@/components/shared/CreateWalletOverlay';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userId } = useAuth();
  const { userWallet } = useWalletContext();

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 h-[calc(100vh-16px)] bg-primary-800 border-r border-primary-700 transition-colors duration-300">
        <Sidebar />
      </div>
      <div className="flex-1  transition-colors duration-300 p-2">
        <div className=" bg-transparent  rounded-md">
          <div className="relative h-[calc(100vh-16px)]  overflow-auto   dark:bg-dot-white/[0.1] bg-dot-black/[0.2] ">
            {userWallet ? children : <CreateWalletOverlay />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
