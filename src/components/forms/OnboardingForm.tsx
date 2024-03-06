'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getUserInfo, onboardUser } from "@/lib/actions/onbaording.action";
import { OnboardingFormValuesType, onboardingSchema } from "@/lib/ZodShemas/onboardingSchema";
import { useToast } from "../ui/use-toast";
import { Form, FormField, FormLabel, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "../shared/spinner";
import { TermAndCondition } from "../modal/term-condition";
import { Label } from "../ui/label";



const defaultValues: OnboardingFormValuesType = {
  firstName: "",
  lastName: "",
  username: "",
  gender: "male",
  phoneNumbers: "",
  primaryEmailAddresses: "",
  addresses: {
    country: "",
    city: "",
    postalCode: "",
    stateOrProvince: "",
  },
}

const OnboardingForm = () => {
  const [userLoading, setUserLoading] = React.useState(false);
  const { userId } = useAuth()
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const { push } = useRouter();



  const form = useForm<OnboardingFormValuesType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: any) => {
    if (userId) {
      setUserLoading(true);
      const response = await onboardUser(userId, data);
      setUserLoading(false);
      if (response) {
        toast({
          title: "User Onboarded Successfully",
          variant: "default",

        })
        push("/dashboard");
      }
      else {
        toast({
          title: "User Onboarding Failed",
          description: "Please try again",
          variant: "destructive"
        })
      }
    }
    else {
      toast({
        title: "User Not Fount or you are not logged in",
        description: "Please login to continue",
        variant: "destructive"
      })
    }
  };

  useEffect(() => {
    if (user) form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      gender: "male",
      phoneNumbers: "",
      username: user.username || "",
      primaryEmailAddresses: user.primaryEmailAddress?.emailAddress || "",
      addresses: {
        country: "",
        city: "",
        postalCode: "",
        stateOrProvince: "",
      },
    })
  }, [user , form])

  if (!isLoaded) return <Spinner className="absolute top-[50%]" />;

 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1  gap-4 w-full md:w-[600px] my-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Fill in your personal details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>username</FormLabel>
                  <FormControl>
                    <Input placeholder="user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryEmailAddresses"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Email Id</FormLabel>
                  <FormControl>
                    <Input placeholder="email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup className="flex gap-2" value={field.value} defaultValue={field.value} onValueChange={field.onChange}  >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor='male'>male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">other</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addresses.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addresses.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addresses.stateOrProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addresses.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button variant={"secondary"} type="submit" className="w-[200px] m-auto ">
          {userLoading ? <Spinner className="w-6 h-6 text-primary" /> : "Submit"}
        </Button>
        <p className="text-center text-sm text-gray-500">By clicking the submit button, you agree to our <TermAndCondition /></p>
      </form>
    </Form>

  );
};

export default OnboardingForm;
