import { CogIcon, HomeIcon, Table, Wallet } from "lucide-react";

export const SidebarContent = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: true,
    },
    // {
    //   name: 'Beneficiaries',
    //   href: '/dashboard/beneficiaries',
    //   icon: User,
    //   current: false,
    // },
    {
      name: 'Transactions',
      href: '/dashboard/transactions',
      icon: Table,
      current: false,
    },
    {
      name: 'Wallet',
      href: '/dashboard/wallet',
      icon: Wallet,
    },
    // {
    //   name: 'Payments',
    //   href: '/dashboard/payments',
    //   icon: IndianRupee,
    //   current: false,
    // },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: CogIcon,
      current: false,
    },
  ]