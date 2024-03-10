export type TransactionName =
  | 'Wallet_Top_Up'
  | 'Wallet_Transfer'
  | 'Wallet_Withdrawal';
export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type TransactionPurpose =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'TRANSFER'
  | 'REVERSAL';

export interface Data {
  balanceBefore: number;
  amountToBeAdded: number;
  currentCurrency: string;
  transactionName: TransactionName;
  userId: string;
}

export interface CreateTransactionParams {
  userId: string;
  transactionName: TransactionName;
  trnxType: TransactionType;
  amount: number;
  senderId: string;
  receiverId: string;
  purpose: TransactionPurpose;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  trnxSummary: string;
}
