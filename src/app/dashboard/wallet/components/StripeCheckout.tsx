import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { checkoutWalletMoney } from "@/lib/actions/transactions.actions";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Data } from "@/types/transaction.types";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useWalletContext } from "@/provider/wallet-provider";

type AddMoneyFormValuesType = {
  amount: number;
};

const StripeCheckout = () => {
  const { toast } = useToast();
  const { userWallet } = useWalletContext();
  const methods = useForm<AddMoneyFormValuesType>({
    defaultValues: {
      amount: 0,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    // check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Transaction Completed",
        variant: "default",
        className: "bg-green-500",
      });
    }

    if (query.get("canceled")) {
      toast({
        title: "Transaction Canceled",
        variant: "default",
        className: "bg-red-500",
      });
    }
  }, []);

  const handleCheckout = async (formData: AddMoneyFormValuesType) => {
    const data: Data = {
      amountToBeAdded: formData.amount,
      currentCurrency: userWallet?.currencyPreference!,
      transactionName: "Wallet_Top_Up",
      userId: userWallet?.userId!,
      balanceBefore: userWallet?.balance!,
    };
    await checkoutWalletMoney(data);
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={methods.handleSubmit((data) => handleCheckout(data))}>
      <Controller
        name="amount"
        control={methods.control}
        rules={{ required: "Amount is required" }}
        render={({ field }) => (
          <>
            <Input
              max={1000} // max amount to be added
              type="number"
              {...field}
            />
            {methods.formState.errors.amount && <p className="text-red-500">{methods.formState.errors.amount.message}</p>}
          </>
        )}
      />
      <Button type="submit" variant="secondary">
        Add Money
      </Button>
    </form>
  );
};

export default StripeCheckout;
