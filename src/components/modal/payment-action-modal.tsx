import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import SendMoneyToWalletForm from '../forms/SendMoneyToWalletForm'

interface PaymentCardProps {
  title: string
  description: string
  buttonText: string
  transactionLimit: number
}

const PaymentActionModal = ({
  title,
  description,
  buttonText,
  transactionLimit,
}: PaymentCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className='h-[600px] w-[400px] '>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <SendMoneyToWalletForm transactionLimit={transactionLimit} />
      </DialogContent>
    </Dialog>
  )
}

export default PaymentActionModal
