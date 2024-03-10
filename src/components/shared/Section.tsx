import { cn } from '@/lib/utils';
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
}

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-5 relative', className)} {...props} />
));

Section.displayName = 'Section';

const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-xl font-bold', className)} {...props} />
));

SectionTitle.displayName = 'SectionTitle';

const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-5', className)} {...props} />
));

SectionContent.displayName = 'SectionContent';

export { Section, SectionTitle, SectionContent };
