"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Form, FormField, FormLabel, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Spinner from "../shared/spinner";
import { TermAndCondition } from "../modal/term-condition";
import { CreateWalletType, createWalletSchema } from "@/lib/ZodShemas/createWalletSchema";
import { createUserWallet } from "@/lib/actions/wallet.actions";

interface CreateWalletFormProps {
    close: () => void;
    }

const CreateWalletForm = ({close} : CreateWalletFormProps) => {
  const [walletLoading, setWalletLoading] = React.useState(false);
  const { userId } = useAuth();
  const { toast } = useToast();
  const { push } = useRouter();

  const form = useForm<CreateWalletType>({
    resolver: zodResolver(createWalletSchema),
    defaultValues: {
        governmentId: "",
        walletName: "",
        walletPin: "",
        walletType: "personal",
        walletCurrency: "INR",
    }
  });

  const onSubmit = async (data: CreateWalletType) => {
    if (userId) {
        setWalletLoading(true);
      const response = await createUserWallet(userId, data);
      setWalletLoading(false);
      if (response?.status === "success") {
        toast({
          title: "Create Wallet Success",
          variant: "default",
        });
        close();
      } else {
        toast({
          title: "Create Wallet Failed",
          description: response?.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "User Not Fount or you are not logged in",
        description: "Please login to continue",
        variant: "destructive",
      });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1  gap-4 w-full  my-10">
        <FormField
          control={form.control}
          name="walletName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Name</FormLabel>
              <FormControl>
                <Input placeholder="enter wallet name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="governmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid government issued id</FormLabel>
              <FormControl>
                <Input placeholder="enter id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
              control={form.control}
              name="walletType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose your wallet type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue>{field.value}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">personal</SelectItem>
                        <SelectItem value="business">business</SelectItem>
                        <SelectItem value="testing">testing</SelectItem>
                        <SelectItem value="other">other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="walletCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose your wallet type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue>{field.value}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="other">other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <FormField
            control={form.control}
            name="walletPin"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Wallet Pin</FormLabel>
                <FormControl>
                    <Input autoComplete="new-password" maxLength={6} minLength={6} type="password" placeholder="enter wallet pin" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />


        <Button variant={"secondary"} type="submit" className="w-[200px] m-auto ">
          {walletLoading ? <Spinner className="w-6 h-6 text-primary" /> : "Submit"}
        </Button>
        <p className="text-center text-sm text-gray-500">
          By clicking the submit button, you agree to our <TermAndCondition />
        </p>
      </form>
    </Form>
  );
};

export default CreateWalletForm;
