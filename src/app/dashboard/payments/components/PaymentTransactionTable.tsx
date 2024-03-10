import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Transactions = [
  {
    transactionId: '1',
    transactionType: 'send',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 1000,
    status: 'success',
  },
  {
    transactionId: '2',
    transactionType: 'receive',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 200,
    status: 'failed',
  },
  {
    transactionId: '3',
    transactionType: 'send',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 500,
    status: 'success',
  },
  {
    transactionId: '4',
    transactionType: 'receive',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 100,
    status: 'success',
  },
  {
    transactionId: '5',
    transactionType: 'send',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 1000,
    status: 'success',
  },
  {
    transactionId: '6',
    transactionType: 'receive',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 200,
    status: 'failed',
  },
  {
    transactionId: '7',
    transactionType: 'send',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 500,
    status: 'success',
  },
  {
    transactionId: '8',
    transactionType: 'receive',
    to: 'John Doe',
    from: 'Jane Doe',
    amount: 100,
    status: 'success',
  },
];

const PaymentTransactionTable = () => {
  return (
    <div className="mt-5">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="">Transaction ID</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Transactions.map(item => (
            <TableRow key={item.transactionId}>
              <TableCell className="font-medium">
                {item.transactionId}
              </TableCell>
              <TableCell>{item.transactionType}</TableCell>
              <TableCell>{item.from}</TableCell>
              <TableCell>{item.to}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>
                <Badge>{item.status}</Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button type="button" variant="secondary">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentTransactionTable;
