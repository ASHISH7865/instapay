"use client";
import React, { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { useAuth } from "@clerk/nextjs";
import { getUserInfo } from "@/lib/actions/onbaording.action";
import Spinner from "@/components/shared/spinner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";




const Onboarding = () => {
  const { userId, isLoaded } = useAuth();
  const [userInfoExist, setUserInfoExist] = React.useState(true);
  const [laoding, setLoading] = React.useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserInfo(userId).then((res) => {
        if (res) {
          setUserInfoExist(true);
        }
        else {
          setUserInfoExist(false);
        }
        setLoading(false);
      }
      )
    }
  }, [isLoaded, userId])

  if (laoding) {
    return <Spinner />
  }

  return (
    !userInfoExist ? <div className="flex flex-col items-center justify-center w-[80%]  ">
      <PageHeader title="Setting up your account" description="Just a few more steps to get started" />
      <OnboardingForm />
    </div> : <div className="absolute flex flex-col gap-10 top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
      <span className="text-2xl font-bold text-center">
        You are already onboarded
      </span>
      <Button variant={"secondary"} onClick={() => router.push("/dashboard")}>
        Go to dashboard
      </Button>
    </div>
  );
};

export default Onboarding;
