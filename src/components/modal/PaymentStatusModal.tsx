import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import Lottie from 'lottie-react'
import Success from '@/LotteFiles/paymentSuccess.json'

interface PaymentSuccessModalProps {
  amount: number
  recieverName: string
  transactionId: string
  openModal: boolean
  setOpenModal: (value: boolean) => void
}

export const PaymentSuccessModal = ({
  amount,
  recieverName,
  transactionId,
  openModal,
  setOpenModal,
}: PaymentSuccessModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>open modal</Button>
      </DialogTrigger>
      <DialogContent className='  h-[600px] w-[400px]'>
        <div className='flex w-full justify-between items-center h-full flex-col mt-6'>
          <div className='flex items-center gap-2 flex-col'>
            <Lottie animationData={Success} className='w-1/3' />
            <p className='font-bold text-3xl'>Successful!</p>
            <p className='text-center text-sm mt-5 w-[80%] flex flex-col gap-2'>
            <span className=''>Amount:</span>
            <span className='text-3xl text-primary'>{amount}</span>
                <span className=''>Recipient Id:</span>
                <span className='text-md text-primary'>{recieverName}</span>
            </p>
          </div>

          <p className='text-center text-gray-500 text-sm mb-4 '>
            <span className='text-primary'>Transaction Id:</span> {transactionId}{' '}
          </p>
          {/* <div className='flex justify-between items-center gap-5'>
            <Button variant='outline' className='mt-5'>
              Done
            </Button>
            <Button variant='outline' className='mt-5'>
              Send Another
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
