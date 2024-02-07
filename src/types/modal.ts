export type ModalOpenMode = 'create' | 'edit' | 'view';

export type ModalState = {
    isOpen: boolean;
    mode: ModalOpenMode;
    data: object;
};