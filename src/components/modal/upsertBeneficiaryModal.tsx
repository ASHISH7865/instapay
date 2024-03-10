'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { ModalOpenMode } from '@/types/modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UpsertBeneficiaryForm, {
  BeneficiaryDefaultValuesTypes,
} from '../forms/upsertBeneficiaryForm';

interface upsertBeneficiaryModalProps {
  open: boolean;
  onClose: () => void;
  defaultValue: BeneficiaryDefaultValuesTypes;
  mode: ModalOpenMode;
}

const UpsertBeneficiaryModal = ({
  open,
  onClose,
  mode,
  defaultValue,
}: upsertBeneficiaryModalProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="capitalize">{mode} Beneficiary</DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Add a new beneficiary'
                : 'Edit beneficiary details'}
            </DialogDescription>
          </DialogHeader>
          <UpsertBeneficiaryForm
            mode={mode}
            onClose={onClose}
            defaultValue={defaultValue}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpsertBeneficiaryModal;
