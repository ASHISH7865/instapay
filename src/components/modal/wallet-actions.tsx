'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import {
  Settings,
  History,
  CreditCard,
  Shield,
  Bell,
  BarChart3,
  ArrowRight,
  Wallet,
  Fingerprint,
  Brain,
  TrendingUp,
  Target,
  Users,
  Zap,
  DollarSign,
  FileText,
  Coins,
  QrCode,
  Headphones
} from 'lucide-react'
import { useWalletContext } from '@/provider/wallet-provider'
import { useToast } from '../ui/use-toast'

const walletActions = [
  {
    id: 'analytics',
    title: 'AI Spending Insights',
    description: 'Get personalized financial advice',
    icon: Brain,
    color: 'purple',
    category: 'smart',
    premium: true
  },
  {
    id: 'invest',
    title: 'Smart Investments',
    description: 'Auto-invest spare change',
    icon: TrendingUp,
    color: 'green',
    category: 'smart',
    premium: true
  },
  {
    id: 'goals',
    title: 'Savings Goals',
    description: 'Set and track financial goals',
    icon: Target,
    color: 'blue',
    category: 'smart'
  },
  {
    id: 'history',
    title: 'Transaction History',
    description: 'View all your past transactions',
    icon: History,
    color: 'gray',
    category: 'basic',
    href: '/dashboard/transactions'
  },
  {
    id: 'cards',
    title: 'Payment Methods',
    description: 'Manage cards and accounts',
    icon: CreditCard,
    color: 'indigo',
    category: 'basic'
  },
  {
    id: 'security',
    title: 'Security Center',
    description: 'Biometric auth, 2FA, PIN',
    icon: Shield,
    color: 'red',
    category: 'security'
  },
  {
    id: 'biometric',
    title: 'Biometric Login',
    description: 'Face ID & Fingerprint',
    icon: Fingerprint,
    color: 'teal',
    category: 'security',
    toggle: true
  },
  {
    id: 'notifications',
    title: 'Smart Notifications',
    description: 'Real-time alerts & insights',
    icon: Bell,
    color: 'yellow',
    category: 'settings'
  },
  {
    id: 'contactless',
    title: 'Contactless Pay',
    description: 'NFC payments & QR codes',
    icon: QrCode,
    color: 'cyan',
    category: 'payments'
  },
  {
    id: 'crypto',
    title: 'Crypto Wallet',
    description: 'Buy, sell, and store crypto',
    icon: Coins,
    color: 'orange',
    category: 'crypto',
    premium: true
  },
  {
    id: 'statements',
    title: 'Smart Reports',
    description: 'AI-powered financial reports',
    icon: FileText,
    color: 'emerald',
    category: 'reports'
  },
  {
    id: 'family',
    title: 'Family Sharing',
    description: 'Share accounts with family',
    icon: Users,
    color: 'pink',
    category: 'social'
  },
  {
    id: 'support',
    title: '24/7 AI Support',
    description: 'Instant help anytime',
    icon: Headphones,
    color: 'violet',
    category: 'support'
  }
]

const categories = [
  { id: 'all', name: 'All Features', icon: Settings },
  { id: 'smart', name: 'AI Features', icon: Brain },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'payments', name: 'Payments', icon: CreditCard },
  { id: 'reports', name: 'Reports', icon: BarChart3 }
]

const WalletActionsModal = () => {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const { userWallet } = useWalletContext()
  const { toast } = useToast()

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      green: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      yellow: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      indigo: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      gray: 'bg-gray-50 dark:bg-gray-950/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
      emerald: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      red: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      teal: 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      cyan: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      pink: 'bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      violet: 'bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const filteredActions = selectedCategory === 'all'
    ? walletActions
    : walletActions.filter(action => action.category === selectedCategory)

  const handleActionClick = (action: typeof walletActions[0]) => {
    if (action.premium) {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to access this feature',
        variant: 'default',
      })
      return
    }

    if (action.href) {
      window.location.href = action.href
      return
    }

    // Handle specific actions
    switch (action.id) {
      case 'security':
        toast({
          title: 'Security Center',
          description: 'Opening security settings...',
        })
        break
      case 'notifications':
        toast({
          title: 'Notifications',
          description: 'Notification preferences updated',
        })
        break
      case 'statements':
        toast({
          title: 'Generating Report',
          description: 'Your financial report is being prepared...',
        })
        break
      default:
        toast({
          title: action.title,
          description: 'Feature coming soon!',
        })
    }
  }

  const handleBiometricToggle = (enabled: boolean) => {
    setBiometricEnabled(enabled)
    toast({
      title: enabled ? 'Biometric Authentication Enabled' : 'Biometric Authentication Disabled',
      description: enabled
        ? 'You can now use Face ID or Fingerprint to access your wallet'
        : 'Biometric authentication has been disabled',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start h-12 bg-white/50 dark:bg-gray-800/50 border-0 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
          <Settings className="h-4 w-4 mr-3" />
          More Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Wallet className="h-6 w-6" />
            </div>
            Wallet Actions & Settings
          </DialogTitle>
        </DialogHeader>

        {/* Wallet Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${Number(userWallet?.balance || 0).toLocaleString()}
                </p>
              </div>
                <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Wallet Type</p>
                    <Badge variant="secondary" className="mt-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  {userWallet?.type || 'Personal'}
                </Badge>
              </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Actions Grid */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
            <AnimatePresence mode="wait">
              {filteredActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
              >
                <Card
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg border ${getColorClasses(action.color)} ${
                        action.premium ? 'ring-2 ring-amber-400/50' : ''
                  }`}
                      onClick={() => !action.toggle && handleActionClick(action)}
                >
                  <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${getColorClasses(action.color)} border`}>
                        <Icon className="h-5 w-5" />
                      </div>
                            <div className="flex gap-1">
                              {action.premium && (
                                <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-300">
                                  Premium
                                </Badge>
                              )}
                                                             {action.toggle && (
                                 <Switch
                                   checked={action.id === 'biometric' ? biometricEnabled : false}
                                   onCheckedChange={action.id === 'biometric' ? handleBiometricToggle : undefined}
                                 />
                               )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                            {action.title}
                              {action.premium && <Zap className="h-3 w-3 text-amber-500" />}
                          </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                          {action.description}
                        </p>
                          </div>

                          {!action.toggle && (
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex-1" />
                              <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                          )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Settings Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t"
        >
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="font-medium text-sm">Transaction Notifications</p>
                <p className="text-xs text-muted-foreground">Get alerts for all transactions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
          </div>
              <Switch />
          </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletActionsModal
