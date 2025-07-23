import {
    LayoutDashboard,
    Wallet,
    CreditCard,
    ArrowLeftRight,
    BarChart3,
    Users,
    Settings,
    HeadphonesIcon,
    Shield,
    Zap,
    TrendingUp,
    PieChart,
    Receipt
} from "lucide-react";

export const SidebarContent = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        current: false,
        description: 'Overview & insights'
    },
    {
        name: 'Wallet',
        href: '/dashboard/wallet',
        icon: Wallet,
        current: false,
        description: 'Manage your funds'
    },
    {
        name: 'Payments',
        href: '/dashboard/payments',
        icon: CreditCard,
        current: false,
        description: 'Send & receive money'
    },
    {
        name: 'Transactions',
        href: '/dashboard/transactions',
        icon: ArrowLeftRight,
        current: false,
        description: 'Transaction history'
    },
    {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        current: false,
        description: 'AI-powered insights',
        badge: 'AI'
    },
    {
        name: 'Beneficiaries',
        href: '/dashboard/beneficiaries',
        icon: Users,
        current: false,
        description: 'Saved recipients'
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        current: false,
        description: 'Account preferences'
    },
    {
        name: 'Support',
        href: '/dashboard/support',
        icon: HeadphonesIcon,
        current: false,
        description: 'Help & assistance'
    },
];

// Secondary navigation items for quick actions
export const QuickActions = [
    {
        name: 'Add Money',
        href: '/dashboard/wallet',
        icon: Zap,
        color: 'emerald',
        description: 'Top up your wallet'
    },
    {
        name: 'Send Money',
        href: '/dashboard/payments',
        icon: ArrowLeftRight,
        color: 'blue',
        description: 'Transfer funds'
    },
    {
        name: 'Security',
        href: '/dashboard/settings',
        icon: Shield,
        color: 'purple',
        description: 'Account safety'
    },
    {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: TrendingUp,
        color: 'orange',
        description: 'View insights'
    }
];

// Premium features for upgrade prompts
export const PremiumFeatures = [
    {
        name: 'Advanced Analytics',
        icon: PieChart,
        description: 'AI-powered spending insights'
    },
    {
        name: 'Priority Support',
        icon: HeadphonesIcon,
        description: '24/7 premium assistance'
    },
    {
        name: 'Custom Reports',
        icon: Receipt,
        description: 'Detailed financial reports'
    }
];
