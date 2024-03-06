'use client';
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getUserWallet } from "@/lib/actions/wallet.actions";
import { Wallet } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import CreateWallet from "../modal/create-wallet";
import Spinner from "./spinner";

const CreateWalletOverlay = () => {
  const { userId } = useAuth();
  const [userWallet, setUserWallet] = useState<Wallet | null>(null);
  const [laoding , setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (userId) {
      getUserWallet(userId).then((res) => {
        if (res?.wallet) {
          setUserWallet(res.wallet);
          setLoading(false);
        }
      }).catch((err) => {
        console.log("Error in getting user wallet", err);
        setLoading(false);
      });
    }
  }, [userId]);

  if(laoding) return <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center backdrop-blur-md">
 <Spinner /> 
 <p className="ml-2">Getting User Wallet</p>
</div>

  return !userWallet && !laoding ? (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center backdrop-blur-md">
      <CreateWallet />
    </div>
  ) : null;
};

export default CreateWalletOverlay;
