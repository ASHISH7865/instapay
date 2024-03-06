import { CurrencyCode } from "@/app/dashboard/wallet/components/CheckBalance";
import { Wallet } from "@prisma/client";
import React, { createContext, useMemo } from "react";

type WalletContextType = {
  balance: number | undefined;
  setBalance: React.Dispatch<React.SetStateAction<number | undefined>>;
  userWallet: Wallet | null;
  setUserWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = React.useState<number | undefined>(undefined);
  const [userWallet, setUserWallet] = React.useState<Wallet | null>(null);

  const contextValues = useMemo(
    () => ({
      balance,
      setBalance,
      userWallet,
      setUserWallet,
    }),
    [balance, setBalance, userWallet, setUserWallet]
  );

  return <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>;
};
