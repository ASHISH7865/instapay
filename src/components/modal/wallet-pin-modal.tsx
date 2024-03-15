import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import SeperateInput from '../forms/SeperateInputForm'

const WalletPinModal = () => {
  const [open, setOpen] = React.useState(false)
  const onOpenChange = () => setOpen(!open)
  const close = () => setOpen(false)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type='button' variant='secondary'>
          Check Balance
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Enter Wallet Pin</DialogTitle>
        </DialogHeader>
        <SeperateInput close={close} numberOfInput={6} />
      </DialogContent>
    </Dialog>
  )
}

export default WalletPinModal
