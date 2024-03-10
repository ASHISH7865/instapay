import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface PaymentCardProps {
  title: string;
  description: string;
  buttonText: string;
  transactionLimit: string;
}

const PaymentActionModal = ({
  title,
  description,
  buttonText,
}: PaymentCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="h-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentActionModal;
