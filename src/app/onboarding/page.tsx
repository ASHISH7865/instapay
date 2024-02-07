"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { updateUserOnboardingStatus, checkUserExists, createUserInfo } from "@/lib/actions/user.actions";
import Spinner from "@/components/shared/spinner";
import { loadingTextVariants } from "@/lib/animation";
import SettingUpUI from "@/components/pages/dashboard/settingup-ui";


interface IUserInfo {
  id: number;
  userId: string;
  username: string;
  email: string;
  balance: number;
  setupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Onboarding = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [creatingUserLoading, setCreatingUserLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  const createUserInfoIfNotExists = async () => {
    if (!user) return;

    const { id, primaryEmailAddress, username } = user;
    const { emailAddress } = primaryEmailAddress || {};

    try {
      const result = await checkUserExists(id);

      if (result.userExists) {
        setUserInfo(result?.user);
      } else if (emailAddress && username) {
        setCreatingUserLoading(true);
        const createdUser = await createUserInfo({
          email: emailAddress,
          userId: id,
          username,
        });

        setUserInfo(createdUser.user);
      }
    } catch (error) {
      // Handle errors here
    } finally {
      setCreatingUserLoading(false);
    }
  };



  useEffect(() => {
    if (isLoaded && isSignedIn) {
      createUserInfoIfNotExists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, userInfo?.setupCompleted]);

  return (
    <div>
      {!isLoaded || !isSignedIn || !userInfo ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : creatingUserLoading ? (
        <div className="flex flex-col justify-center gap-4 items-center h-screen">
          <Spinner />
          <motion.span
            variants={loadingTextVariants}
            animate="animate"
            initial="initial"
            className="text-2xl font-bold mb-4"
          >
            Setting up your account
          </motion.span>
        </div>
      ) : userInfo && <SettingUpUI userInfo={userInfo}  /> }
    </div>
  );
};

export default Onboarding;
