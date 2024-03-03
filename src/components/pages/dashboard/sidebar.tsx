"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { HomeIcon, CalendarIcon, User, IndianRupee, CogIcon, Wallet } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const SidebarContent = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    current: true,
  },
  {
    name:"Beneficiaries",
    href:"/dashboard/beneficiaries",
    icon: User,
    current: false,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CalendarIcon,
    current: false,
  },
  {
    name:"Wallet",
    href:"/dashboard/wallet",
    icon: Wallet,
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: IndianRupee,
    current: false,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: CogIcon,
    current: false,
  },
];

const Sidebar = () => {
  const { user } = useUser();


  return (
    <div className=" h-screen w-64 relative">
      <div className="flex items-center justify-center p-5">
        <h1 className=" text-2xl">InstaPay</h1>
      </div>
      <nav className="mt-10 flex  flex-col items-start ml-10  ">
        {SidebarContent.map((item, index) => (
          <Link key={index} href={item.href} className="flex items-center gap-2 p-2 m-2 text-sm" >
            <item.icon className={`${item.current ? "text-primary" : ""}`} size={20} />
            <span className={`${item.current ? "text-primary" : ""}`}>{item.name}</span>
          </Link>
        ))}
      </nav>
   { user && 
     <div className="absolute bottom-0 w-full p-2 ">
        <div className="flex border p-2  items-center gap-2 border-primary rounded-md">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col ml-2">
            <span className="text-md font-bold">{user?.fullName}
            </span>
            <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Sidebar;
