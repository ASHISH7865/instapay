import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ModalOpenMode } from '@/types/modal';

interface AddBeneficiaryProps {
  open: boolean;
  onClose: () => void;
  defaultValue : object;
  mode: ModalOpenMode;
}

const AddBeneficiary = ({ open, onClose , mode ,defaultValue}: AddBeneficiaryProps) => {
  console.log(defaultValue)
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='capitalize'>{mode} Beneficiary</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Add a new beneficiary" : "Edit beneficiary details"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
          

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default AddBeneficiary