/* eslint-disable camelcase */
import { createTransactions } from '@/lib/actions/transactions.actions';
import { CreateTransactionParams } from '@/types/transaction.types';
import { NextResponse } from 'next/server';
import stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get('stripe-signature') as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: 'Webhook error', error: err });
  }

  // Get the ID and type
  const eventType = event.type;

  // CREATE
  if (eventType === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object;

    const transaction: CreateTransactionParams = {
      userId: metadata?.userId || '',
      transactionName: 'Wallet_Top_Up',
      trnxType: 'CREDIT',
      amount: amount_total ? amount_total / 100 : 0,
      senderId: id, // stripe session id
      receiverId: metadata?.userId || '', // buyer id
      purpose: 'DEPOSIT',
      balanceBefore: Number(metadata?.balanceBefore) || 0,
      balanceAfter:
        Number(metadata?.balanceBefore) + Number(metadata?.credits) || 0,
      status: 'COMPLETED',
      trnxSummary: 'Wallet Top Up Successful',
    };

    const newTransaction = await createTransactions(transaction);

    return NextResponse.json({ message: 'OK', transaction: newTransaction });
  }

  return new Response('', { status: 200 });
}
