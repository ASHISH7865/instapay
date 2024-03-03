import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const termsAndConditions = {
  title: "InstaPay E-Wallet Terms and Conditions",
  version: "1.0",
  effectiveDate: "February 17, 2024",
  content: [
    "By using InstaPay, you agree to the following terms and conditions.",
    "InstaPay is a digital wallet service provided by ASHISH for facilitating electronic transactions.",
    "InstaPay allows users to store funds digitally, send money to other users, and make purchases at participating merchants.",
    "Users must be at least 18 years old to use InstaPay.",
    "Users are responsible for maintaining the security of their InstaPay account credentials, including passwords and PINs.",
    "Users must not share their account credentials with anyone else.",
    "Users are responsible for all transactions made using their InstaPay account.",
    "InstaPay may collect and store personal information as outlined in the InstaPay Privacy Policy.",
    "InstaPay reserves the right to suspend or terminate accounts that violate these terms and conditions or engage in fraudulent activity.",
    "InstaPay may update these terms and conditions from time to time. Users will be notified of any changes.",
    "By continuing to use InstaPay after changes to the terms and conditions, users accept the updated terms.",
    "These terms and conditions are governed by the laws of insta   pay"
  ]
};

export function TermAndCondition() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-blue-600 cursor-pointer">Terms and Conditions</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{termsAndConditions.title}</DialogTitle>
          <DialogDescription>
            Please read the terms and conditions carefully before using our service.
          </DialogDescription>
        </DialogHeader>
        <span className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Version:</span>
          <span className="text-sm">{termsAndConditions.version}</span>
        </span>
        <ul className="flex flex-col space-y-2 mt-4 text-muted-foreground">   
          {termsAndConditions.content.map((item, index) => (
            <li key={index} className="text-sm">{index+1}.    {item}</li>
          ))}
        </ul>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
