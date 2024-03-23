import React from 'react'
import PaymentActionModal from '@/components/modal/payment-action-modal'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface PaymentCardProps {
  title: string
  description: string
  transactionLimit: number
  buttonText: string
}

const PaymentCard = ({ title, buttonText, description, transactionLimit }: PaymentCardProps) => {
  return (
    <Card className='w-[350px] min-h-[200px]'>
      <CardHeader>
        <CardTitle className='flex items-center '>{title}</CardTitle>
        <CardContent>
          <span className='text-sm font-bold'>
            Transaction limit: <span className='text-primary'>₹ {transactionLimit}</span>
          </span>
        </CardContent>
      </CardHeader>
      <CardFooter className='flex justify-center'>
        <PaymentActionModal
          title={title}
          description={description}
          buttonText={buttonText}
          transactionLimit={transactionLimit}
        />
      </CardFooter>
    </Card>
  )
}

export default PaymentCard
