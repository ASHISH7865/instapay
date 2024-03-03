import { BeneficiaryDefaultValuesTypes } from "@/components/forms/upsertBeneficiaryForm";

export type ModalOpenMode = 'create' | 'edit' | 'view';

export type ModalState = {
    isOpen: boolean;
    mode: ModalOpenMode;
    defaultValues:BeneficiaryDefaultValuesTypes;
};