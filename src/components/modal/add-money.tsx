import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const AddMoney = () => {
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button type="button" variant="secondary">
       Add Money
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
            Add Money to Wallet
        </DialogTitle>
      </DialogHeader>
        <Input type="number" placeholder="Enter Amount" />
        <Button type="button" variant="secondary" className="mt-4">
            Add Money
        </Button>
    </DialogContent>
  </Dialog>
  )
}

export default AddMoney