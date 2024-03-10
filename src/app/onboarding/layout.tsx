import React from 'react';

interface Props {
  children: React.ReactNode;
}

const OnboardingLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full mt-20">
      {children}
    </div>
  );
};

export default OnboardingLayout;
