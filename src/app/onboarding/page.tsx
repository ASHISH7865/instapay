'use client';
import React, { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { useAuth } from "@clerk/nextjs";
import { getUserInfo } from "@/lib/actions/onbaording.action";
import Spinner from "@/components/shared/spinner";
import { useRouter } from "next/navigation";

const Onboarding = () => {
  const { userId, isLoaded } = useAuth();
  const [userInfoExist, setUserInfoExist] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserInfo(userId).then((res) => {
        if (res) {
          setUserInfoExist(true);
        } else {
          setUserInfoExist(false);
        }
        setLoading(false);
      });
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    if (!loading && userInfoExist) {
      router.push("/dashboard");
    }
  }, [loading, userInfoExist, router]);

  if (loading) {
    return <Spinner />;
  }

  return (
    !userInfoExist && <div className="flex flex-col items-center justify-center w-[80%]">
      <PageHeader
        title="Setting up your account"
        description="Just a few more steps to get started"
      />
      <OnboardingForm />
    </div>
  );
};

export default Onboarding;
