export type ModalOpenMode = 'create' | 'edit' | 'view'

export interface ModalState {
  isOpen: boolean
  mode: ModalOpenMode
  defaultValues: null
}
