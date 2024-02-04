"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { HomeIcon, CalendarIcon, User, IndianRupee, CogIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const SidebarContent = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    current: false,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: CalendarIcon,
    current: false,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: IndianRupee,
    current: false,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    current: false,
  },
];

const Sidebar = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <div className=" h-screen w-64 relative">
      <div className="flex items-center justify-center p-5">
        <h1 className=" text-2xl">InstaPay</h1>
      </div>
      <nav className="mt-10 flex  flex-col ">
        {SidebarContent.map((item, index) => (
          <Link key={index} href={item.href} className="flex items-center gap-4 p-2 m-2 text-sm ">
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-2 ">
        <div className="flex border p-2 rounded-md items-center gap-2 border-primary">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col ml-2">
            <span className="text-md font-bold">{user?.fullName}
            
            </span>
            <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
