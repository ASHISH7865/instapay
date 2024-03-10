import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold text-center ">{title}</h1>
        <p className="text-lg text-center text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
