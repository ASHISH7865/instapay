import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWalletDepositTransactions } from "@/lib/actions/transactions.actions";
import { useAuth } from "@clerk/nextjs";
import { Transaction } from "@prisma/client";
import Spinner from "@/components/shared/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Table_Header = ["ID", "Type", "Amount Added", "Status", "Purpose", "Date of Transaction", "Balance Before", "Balance After"];

const WalletTransactionsTable = () => {
  const { userId } = useAuth();

  const [walletTransactions, setWalletTransactions] = useState<Transaction[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // initial page
  const itemsPerPage = 5;

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getWalletDepositTransactions(userId).then((res) => {
        setWalletTransactions(res.transactions);
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-5">
        <Spinner />
        <p>Transactions are loading...</p>
      </div>
    );
  }

  if(!walletTransactions) {
    return (
      <div className="flex flex-col items-center justify-center mt-5">
        <p>No transactions found</p>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(walletTransactions?.length! / itemsPerPage!)) {
      return;
    }
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, walletTransactions?.length || 0);
  const paginatedTransactions = walletTransactions?.slice(startIndex, endIndex);
  const numberOfPages = Math.ceil(walletTransactions?.length! / itemsPerPage!);

  return (
    <div className="mt-5">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {Table_Header.map((item) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions?.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>
                <Badge variant={"secondary"} color={transaction.trnxType === "CREDIT" ? "green" : "red"}>
                  {transaction.trnxType}
                </Badge>
              </TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>
                <Badge variant={"secondary"} color={transaction.status === "COMPLETED" ? "green" : "red"}>
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>{transaction.purpose}</TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
              <TableCell>{transaction.balanceBefore}</TableCell>
              <TableCell>{transaction.balanceAfter}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {numberOfPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent className="cursor-pointer">
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}>Previous</PaginationPrevious>
              </PaginationItem>
              {Array.from({ length: numberOfPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)}>Next</PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default WalletTransactionsTable;
