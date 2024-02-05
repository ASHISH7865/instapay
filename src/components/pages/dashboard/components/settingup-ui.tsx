"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import Spinner from "@/components/shared/spinner";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { loadingTextVariants } from "@/lib/animation";
import { updateUserOnboardingStatus } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

interface SettingUpUIProps {
  userInfo: any;
}

const SettingUpUI = ({ userInfo }: SettingUpUIProps) => {
  const controls = useAnimation();
  const [loadingText, setLoadingText] = useState("Setting up your InstaPay wallet");

  const changeText = async () => {
    const steps = [
      "Configuring additional information",
      "Configuring wallet information",
      "Finalizing setup",
      "Setting up completed!",
    ];

    for (let i = 0; i < 1; i++) {
      for (const step of steps) {
        await controls.start("animate");
        controls.start("initial");

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoadingText(step);
      }
    }

    // Once the setup is completed, you can navigate to the next screen or perform any desired action

    const result = await updateUserOnboardingStatus(userInfo.userId);
    if (result.user?.setupCompleted) setLoadingText("Onboarding completed!");
  };
  useEffect(() => {
    changeText();
  }, []);
  if (userInfo.setupCompleted) {
    redirect("/dashboard");
  }

  if (loadingText === "Onboarding completed!") {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center h-screen p-2">
      <div className="flex gap-4 items-center justify-center flex-col ">
        <Spinner />
        <motion.h1
          className="md:text-2xl font-bold mb-4 text-center"
          variants={loadingTextVariants}
          initial="initial"
          animate={controls}
        >
          {loadingText}
        </motion.h1>
      </div>
    </div>
  );
};

export default SettingUpUI;
