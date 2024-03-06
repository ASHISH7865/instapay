'use client';
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getUserWallet } from "@/lib/actions/wallet.actions";
import { Wallet } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import CreateWallet from "../modal/create-wallet";
import { useWalletContext } from "@/provider/wallet-provider";
import Spinner from "./spinner";

const CreateWalletOverlay = () => {
  const { userId } = useAuth();
  const { userWallet, setUserWallet } = useWalletContext();
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    if (userId) {
      setIsLoading(true); // Set loading state to true when fetching starts
      getUserWallet(userId)
        .then((res) => {
          if (res?.wallet) {
            setUserWallet(res.wallet);
          }
        })
        .catch((err) => {
          console.log("Error in getting user wallet", err);
        })
        .finally(() => {
          setIsLoading(false); // Set loading state to false when fetching finishes
        });
    }
  }, [userId , setUserWallet]);

  // Show loading indicator while fetching
  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center backdrop-blur-md">
       <Spinner />
       <p className="ml-2">Loading</p>
      </div>
    );
  }

  // Show create wallet if user does not have a wallet
  return !userWallet && (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center backdrop-blur-md">
      <CreateWallet />
    </div>
  );
};

export default CreateWalletOverlay;
