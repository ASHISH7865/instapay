import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import StripeCheckout from '@/app/dashboard/wallet/components/StripeCheckout'

const AddMoneyModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type='button' variant='default'>
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
        </DialogHeader>
        <StripeCheckout />
      </DialogContent>
    </Dialog>
  )
}

export default AddMoneyModal
