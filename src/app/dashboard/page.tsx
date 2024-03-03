"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumb";
import { useAuth, useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();

  // In case the user signs out while on the page.
  if (!isLoaded || !userId || !isUserLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}


