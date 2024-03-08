import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet2 } from "lucide-react";
import WalletPinModal from "@/components/modal/wallet-pin-modal";
import { useWalletContext } from "@/provider/wallet-provider";

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

const CurrencySymbols :Record<CurrencyCode , string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
}

const CheckBalance = () => {
 const {balance , userWallet} = useWalletContext();
 
  return (
    <div className="mt-5">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet2 size={24} />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {balance === undefined ? 
            "****" : userWallet && `${CurrencySymbols[userWallet?.currencyPreference as CurrencyCode]} ${balance}`}</div>
        </CardContent>
        <CardFooter className="flex justify-end">
         { balance === undefined &&
           <WalletPinModal />}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckBalance;
