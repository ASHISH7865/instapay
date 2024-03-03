import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import SeperateInput from '../forms/SeperateInputForm'

const WalletPinModal = () => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary">
          Check Balance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Enter Wallet Pin
          </DialogTitle>
        </DialogHeader>
        <SeperateInput numberOfInput={4} />
      </DialogContent>
    </Dialog>
  )
}

export default WalletPinModal