import React from "react";

interface Props {
  children: React.ReactNode;
}

const OnboardingLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default OnboardingLayout;
