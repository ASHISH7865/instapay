import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import CreateWalletForm from '../forms/CreateWalletForm'

const CreateWallet = () => {
  const [open, setOpen] = React.useState(false)
  const onOpenChange = () => setOpen(!open)
  const close = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type='button' variant='default'>
          Create Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Enter Details</DialogTitle>
          <DialogDescription>Fill in your wallet details</DialogDescription>
        </DialogHeader>
        <CreateWalletForm close={close} />
      </DialogContent>
    </Dialog>
  )
}

export default CreateWallet
