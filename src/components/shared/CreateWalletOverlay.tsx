'use client';
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getUserWallet } from "@/lib/actions/wallet.actions";
import { Wallet } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import CreateWallet from "../modal/create-wallet";

const CreateWalletOverlay = () => {
  const { userId } = useAuth();
  const [userWallet, setUserWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (userId) {
      getUserWallet(userId).then((res) => {
        if (res) {
          setUserWallet(res);
        }
      });
    }
  }, [userId]);

  return !userWallet ? (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center backdrop-blur-md">
      <CreateWallet />
    </div>
  ) : null;
};

export default CreateWalletOverlay;
