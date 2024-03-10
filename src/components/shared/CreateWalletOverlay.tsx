'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { getUserWallet } from '@/lib/actions/wallet.actions';
import { Wallet } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';
import CreateWallet from '../modal/create-wallet';
import { useWalletContext } from '@/provider/wallet-provider';
import Spinner from './spinner';

const CreateWalletOverlay = () => {
  const { userId } = useAuth();
  const { userWallet, setUserWallet } = useWalletContext();
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    if (userId) {
      setIsLoading(true); // Set loading state to true when fetching starts
      getUserWallet(userId)
        .then(res => {
          if (res?.wallet) {
            setUserWallet(res.wallet);
          }
        })
        .catch(err => {
          console.log('Error in getting user wallet', err);
        })
        .finally(() => {
          setIsLoading(false); // Set loading state to false when fetching finishes
        });
    }
  }, [userId, setUserWallet]);

  // Show loading indicator while fetching
  if (isLoading) {
    return (
      <div className="absolute top-[50%] left-[50%] transform  -translate-x-1/2 -translate-y-1/2 ">
        <Spinner />
      </div>
    );
  }

  // Show create wallet if user does not have a wallet
  return (
    !userWallet && (
      <div className="h-full w-full flex-col   relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <p className="text-2xl sm:text-4xl text-center font-bold relative  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Create a wallet to get started
        </p>
        <CreateWallet />
      </div>
    )
  );
};

export default CreateWalletOverlay;
