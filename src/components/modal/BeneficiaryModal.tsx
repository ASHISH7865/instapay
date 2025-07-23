'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BeneficiaryForm from '@/components/forms/BeneficiaryForm'
import { CreateBeneficiaryData } from '@/hooks/useBeneficiaries'

interface BeneficiaryModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateBeneficiaryData) => Promise<void>
  beneficiary?: CreateBeneficiaryData
  mode?: 'create' | 'edit'
}

const BeneficiaryModal = ({
  open,
  onClose,
  onSubmit,
  beneficiary,
  mode = 'create'
}: BeneficiaryModalProps) => {
  const handleSubmit = async (data: CreateBeneficiaryData) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="capitalize text-xl font-bold">
            {mode === 'create' ? 'Add New Beneficiary' : 'Edit Beneficiary'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add someone to your beneficiaries list for quick and easy money transfers.'
              : 'Update beneficiary information and preferences.'
            }
          </DialogDescription>
        </DialogHeader>

        <BeneficiaryForm
          beneficiary={beneficiary}
          onSubmit={handleSubmit}
          onCancel={onClose}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}

export default BeneficiaryModal
