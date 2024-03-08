"use server"
import { redirect } from 'next/navigation';
import Stripe from "stripe";
import prisma from '../prisma';
import { CreateTransactionParams, Data } from '@/types/transaction.types';


export async function checkoutWalletMoney(data : Data) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const amount = Number(data.amountToBeAdded) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items:[
        {
             price_data : {
                currency : data.currentCurrency.toLowerCase(),
                unit_amount : amount,
                product_data : {
                    name : data.transactionName
                }
             },
                quantity : 1
        }
    ],
    metadata:{
        transactionName : data.transactionName,
        userId : data.userId,
        balanceBefore : data.balanceBefore,
        currentCurrency : data.currentCurrency,
        credits : data.amountToBeAdded
    },
    mode : "payment",
    success_url : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/wallet?success=true`,
    cancel_url : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/wallet?cancel=true`
  })
  redirect(session.url!);
} 


export async function createTransactions( transaction : CreateTransactionParams){
  // check if the user exists
  // check if the user has a wallet
    // create a transaction
    // create a transaction history
    // update the wallet balance

    // step-1 
    const user = await prisma.userInfo.findUnique({
        where:{
            userId: transaction.userId
        }
    });

    if (!user) {
        return {
            status: "error",
            message: "User not found",
        }
    }

    // step-2
    const wallet = await prisma.wallet.findUnique({
        where:{
            userId: transaction.userId
        }
    });

    if (!wallet) {
        return {
            status: "error",
            message: "Wallet not found",
        }
    }

    // step-3
    const newTransaction = await prisma.wallet.update({
      where:{
        userId: transaction.userId
      },
      data :{
        transactions:{
          create:{
            trnxType:transaction.trnxType,
            purpose:  transaction.purpose,
            senderId:transaction.senderId,
            recipientId:transaction.receiverId,
            amount:transaction.amount,
            balanceBefore:wallet.balance,
            balanceAfter:wallet.balance + transaction.amount,
            status : transaction.status,
            trnxSummary:transaction.trnxSummary,
          }
        }
      }
    })

    // step-4
    if (newTransaction) {
      const updatedWallet = await prisma.wallet.update({
        where:{
          userId: transaction.userId
        },
        data:{
          balance:{
            increment: transaction.amount
          }
        }
      })
      return {
        status: "success",
        message: "Transaction created successfully",
        data: updatedWallet
      }
    }
    
}
