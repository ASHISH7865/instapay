export type TransactionName = "Wallet_Top_Up" | "Wallet_Transfer" | "Wallet_Withdrawal"; 
export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Data {
    amount: number;
    currentCurrency: string;
    transactionName: TransactionName;
    userId : string;

}

export interface CreateTransactionParams {
    userId : string;
    transactionName : TransactionName;
    trnxType : TransactionType;
    amount : number;
    senderId : string;
    receiverId : string;
    purpose : string;
    balanceBefore : number;
    balanceAfter : number;
    status : TransactionStatus;
    trnxSummary : string;
}
