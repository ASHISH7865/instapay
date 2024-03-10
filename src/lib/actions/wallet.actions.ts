'use server';
import prisma from '@/lib/prisma';
import { CreateWalletType } from '../ZodShemas/createWalletSchema';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

const SALT = 10;

export interface Wallet {
  id: string;
  balance: number;
  walletPasswordType: string;
  walletPin: string;
  currencyPreference: string;
  usagePreference: string;
  createdAt: Date;
  updatedAt: Date;
  transactionLimit: number;
  userId: string;
}

export async function createUserWallet(userId: string, data: CreateWalletType) {
  // steps to create a wallet
  // check if user already has a wallet
  // if user has a wallet, return the wallet
  // if user does not have a wallet, create a wallet for the user
  try {
    const userInfo = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!userInfo) {
      return {
        status: 'error',
        message: 'User not found',
      };
    }

    const walletExist = await prisma.wallet.findUnique({
      where: {
        userId: userId,
      },
    });

    if (walletExist) {
      return {
        status: 'error',
        message: 'Wallet already exist',
        wallet: walletExist,
      };
    } else {
      const hashedPin = await bcrypt.hash(data.walletPin, SALT);

      const newWallet = await prisma.userInfo.update({
        where: {
          userId: userId,
        },
        data: {
          wallet: {
            create: {
              walletUniqueName: userInfo?.username + data.walletName,
              balance: 0,
              walletPasswordType: data.walletType,
              walletPin: hashedPin,
              currencyPreference: data.walletCurrency,
              usagePreference: 'personal',
              transactionLimit: 5000,
            },
          },
        },
      });

      revalidatePath('/dashboard/wallet');
      return {
        status: 'success',
        message: 'Wallet created successfully',
        wallet: newWallet,
      };
    }
  } catch (err: any) {
    console.log('Error in creating wallet', err);
  }
}

export async function getUserWallet(userId: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: userId,
      },
    });

    return {
      status: 'success',
      message: 'Wallet found',
      wallet: wallet,
    };
  } catch (err: any) {}
}

export async function checkWalletBalance(userId: string, pin: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!wallet) {
      return {
        status: 'error',
        message: 'Wallet not found',
      };
    }

    const match = await bcrypt.compare(pin, wallet.walletPin);
    if (!match) {
      return {
        status: 'error',
        message: 'Invalid wallet pin',
      };
    }

    return {
      status: 'success',
      message: 'Wallet balance found',
      balance: wallet.balance,
      currency: wallet.currencyPreference,
    };
  } catch (err: any) {
    console.log('Error in checking wallet balance', err);
  }
}
