'use server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import prisma from '../prisma'
import { CreateTransactionParams, Data } from '@/types/transaction.types'
import { revalidatePath } from 'next/cache'

export async function checkoutWalletMoney(data: Data) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const amount = Number(data.amountToBeAdded) * 100

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: data.currentCurrency.toLowerCase(),
          unit_amount: amount,
          product_data: {
            name: data.transactionName,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      transactionName: data.transactionName,
      userId: data.userId,
      balanceBefore: data.balanceBefore,
      currentCurrency: data.currentCurrency,
      credits: data.amountToBeAdded,
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/wallet?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/wallet?cancel=true`,
  })
  redirect(session.url!)
}

export async function createTransactions(transaction: CreateTransactionParams) {
 
  // step-3
  const newTransaction = await prisma.wallet.update({
    where: {
      userId: transaction.userId,
    },
    data: {
      transactions: {
        create: {
          trnxType: transaction.trnxType,
          purpose: transaction.purpose,
          senderId: transaction.senderId,
          recipientId: transaction.receiverId,
          amount: transaction.amount,
          balanceBefore: transaction.balanceBefore,
          balanceAfter: transaction.balanceAfter,
          status: transaction.status,
          trnxSummary: transaction.trnxSummary,
        },
      },
    },
    include: {
      transactions: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  // step-4
  return {
    status: 'success',
    message: 'Transaction created successfully',
    data: newTransaction,
  }
}

export async function getWalletDepositTransactions(userId: string) {
  const transactions = await prisma.wallet.findUnique({
    where: {
      userId,
    },
    select: {
      transactions: {
        where: {
          purpose: 'DEPOSIT',
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
  return {
    transactions: transactions?.transactions,
  }
}

export async function getAllTransactionsByUserId(userId: string) {
  const transactions = await prisma.wallet.findUnique({
    where: {
      userId,
    },
    select: {
      transactions: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
  return {
    transactions: transactions?.transactions,
  }
}

export async function depositMoneyToWallet(from: string, to: string, amount: number) {
  //here from is the stripe session id and to is the user id

  const wallet = await prisma.wallet.findUnique({
    where: {
      userId: to,
    },
  })

  if (!wallet) {
    return {
      status: 'error',
      message: 'Wallet not found',
    }
  }

  const updatedWallet = await prisma.wallet.update({
    where: {
      userId: to,
    },
    data: {
      balance: {
        increment: amount,
      },
    },
  })

  await createTransactions({
    transactionName: 'Wallet_Top_Up',
    userId: to,
    trnxType: 'CREDIT',
    purpose: 'DEPOSIT',
    senderId: `Stripe Bank`,
    receiverId: to,
    amount: amount,
    status: 'COMPLETED',
    balanceBefore: wallet.balance,
    balanceAfter: updatedWallet.balance,
    trnxSummary: 'Wallet top up successful',
  })

  return {
    status: 'success',
    message: 'Wallet deposit successful',
  }
}

export async function moneyTransfer(from: string, to: string, amount: number) {
  const sender = await prisma.wallet.findUnique({
    where: {
      userId: from,
    },
  })

  const receiver = await prisma.wallet.findUnique({
    where: {
      userId: to,
    },
  })

  if (!sender) {
    return {
      status: 'error',
      message: 'Sender not found',
    }
  }

  if (!receiver) {
    return {
      status: 'error',
      message: 'Receiver not found',
    }
  }

  if (sender.balance < amount) {
    await createTransactions({
      transactionName: 'Wallet_Transfer',
      userId: from,
      trnxType: 'DEBIT',
      purpose: 'TRANSFER',
      senderId: from,
      receiverId: to,
      amount: amount,
      status: 'FAILED',
      balanceBefore: sender.balance,
      balanceAfter: sender.balance,
      trnxSummary: 'Money transfer to ' + to + ' failed due to insufficient balance',
    })

    return {
      status: 'error',
      message: 'Insufficient balance for transfer',
    }
  }

  const updatedSender = await prisma.wallet.update({
    where: {
      userId: from,
    },
    data: {
      balance: {
        decrement: amount,
      },
    },
  })

  const updatedReceiver = await prisma.wallet.update({
    where: {
      userId: to,
    },
    data: {
      balance: {
        increment: amount,
      },
    },
  })

  const senderTransaction = await createTransactions({
    transactionName: 'Wallet_Transfer',
    userId: from,
    trnxType: 'DEBIT',
    purpose: 'TRANSFER',
    senderId: from,
    receiverId: to,
    amount: amount,
    status: 'COMPLETED',
    balanceBefore: sender.balance,
    balanceAfter: updatedSender.balance,
    trnxSummary: 'Money transfer to ' + to + ' successful',
  })

  await createTransactions({
    transactionName: 'Wallet_Transfer',
    userId: to,
    trnxType: 'CREDIT',
    purpose: 'TRANSFER',
    senderId: from,
    receiverId: to,
    amount: amount,
    status: 'COMPLETED',
    balanceBefore: receiver.balance,
    balanceAfter: updatedReceiver.balance,
    trnxSummary: 'Money received from ' + from + ' successful',
  })

  revalidatePath('/dashboard')
  return {
    status: 'success',
    message: 'Money transferred successfully',
    data: {
      amount: amount,
      senderId: from,
      receiverId: to,
      transactionID: senderTransaction.data?.transactions[0].id,
    },
  }
}
