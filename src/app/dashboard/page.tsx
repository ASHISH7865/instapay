"use client";
import { useAuth , useUser } from "@clerk/nextjs";
 
export default function Dashboard() {
  const { isLoaded, userId, sessionId, getToken  } = useAuth();
  const { isLoaded : isUserLoaded, isSignedIn, user } = useUser();
 
  // In case the user signs out while on the page.
  if (!isLoaded || !userId || !isUserLoaded || !isSignedIn) {
    return null;
  }
 
  return (
    <div className="flex flex-col items-center justify-center ">
    </div>
  );
}