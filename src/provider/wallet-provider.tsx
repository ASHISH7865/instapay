import { CurrencyCode } from "@/app/dashboard/wallet/components/CheckBalance";
import React, { createContext, useMemo } from "react";

type WalletContextType = {
  balance: number | undefined;
  setBalance: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentCurrency: CurrencyCode;
  setCurrentCurrency: React.Dispatch<React.SetStateAction<CurrencyCode>>;
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
  const [currentCurrency, setCurrentCurrency] = React.useState<CurrencyCode>("INR");

  const contextValues = useMemo(
    () => ({
      balance,
      setBalance,
      currentCurrency,
      setCurrentCurrency,
    }),
    [balance, setBalance, currentCurrency, setCurrentCurrency]
  );

  return <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>;
};
