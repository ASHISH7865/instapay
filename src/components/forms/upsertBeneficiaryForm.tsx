"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ModalOpenMode } from "@/types/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { User, getAllUserInfo } from "@/lib/actions/user.actions";
import Spinner from "../shared/spinner";
import { useAuth } from "@clerk/nextjs";
import {createBeneficiary , updateBeneficiary} from "@/lib/actions/beneficiary.actions";

export type BeneficiaryDefaultValuesTypes = {
  userId: string;
};

const BeneficiarySchema = z.object({
  userId: z.string({ required_error: "User is required" }),
});

interface UpsertBeneficiaryFormProps {
  mode: ModalOpenMode;
  defaultValue: BeneficiaryDefaultValuesTypes;
  onClose?: () => void;
}

const UpsertBeneficiaryForm = ({ mode , onClose }: UpsertBeneficiaryFormProps) => {
  const { userId: currentLoggedInUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<BeneficiaryDefaultValuesTypes>({
    resolver: zodResolver(BeneficiarySchema),
  });

  const onSubmit = (data: BeneficiaryDefaultValuesTypes) => {
    if (mode === "create") {
      setSubmitting(true);
      if (!currentLoggedInUser) return;
      createBeneficiary({userId: currentLoggedInUser, beneficiaryId: data.userId})
        .then((data) => {
          // Close the modal
          onClose && onClose();
          form.reset();
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          setSubmitting(false);
        });
    } 
};

  useEffect(() => {
    setLoading(true);
    // Fetch all users and remove the current logged in user from the list
    getAllUserInfo()
      .then((data) => {
        setUsers(data.data.filter((user) => user.userId !== currentLoggedInUser));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [currentLoggedInUser]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select User</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose user to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.userId}>
                        {user.username}
                        <span className="text-muted-foreground"> - {user.email}</span>
                      </SelectItem>
                    ))}
                    {loading && (
                      <div className="flex justify-center items-center">
                        <Spinner />
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary" className="w-full">
          {mode === "create" ? submitting ? "Creating..." : "Create Beneficiary" : submitting ? "Updating..." : "Update Beneficiary"}
        </Button>
      </form>
    </Form>
  );
};

export default UpsertBeneficiaryForm;