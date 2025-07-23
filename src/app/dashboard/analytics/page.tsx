'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard, { StatsGrid } from '@/components/shared/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Sparkles,
  Brain,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download
} from 'lucide-react'

// Mock data
const analyticsData = {
  overview: {
    totalSpent: 12847.50,
    totalIncome: 18500.00,
    savingsRate: 31.2,
    monthlyChange: 12.5
  },
  categories: [
    { name: 'Food & Dining', amount: 2847.50, percentage: 22.1, color: 'emerald', trend: 'up' },
    { name: 'Transportation', amount: 1950.00, percentage: 15.2, color: 'blue', trend: 'down' },
    { name: 'Shopping', amount: 3200.75, percentage: 24.9, color: 'purple', trend: 'up' },
    { name: 'Entertainment', amount: 1450.25, percentage: 11.3, color: 'orange', trend: 'neutral' },
    { name: 'Bills & Utilities', amount: 2100.00, percentage: 16.3, color: 'red', trend: 'down' },
    { name: 'Healthcare', amount: 1299.00, percentage: 10.1, color: 'green', trend: 'up' }
  ],
  insights: [
    {
      type: 'warning',
      title: 'High Spending Alert',
      description: 'Your shopping expenses increased by 34% this month',
      action: 'Set spending limit',
      priority: 'high'
    },
    {
      type: 'success',
      title: 'Savings Goal Progress',
      description: 'You\'re 78% closer to your $5,000 emergency fund goal',
      action: 'View progress',
      priority: 'medium'
    },
    {
      type: 'info',
      title: 'Smart Recommendation',
      description: 'Switch to our premium card for 2% cashback on dining',
      action: 'Learn more',
      priority: 'low'
    }
  ],
  trends: {
    spending: [
      { month: 'Jan', amount: 11200 },
      { month: 'Feb', amount: 10800 },
      { month: 'Mar', amount: 12100 },
      { month: 'Apr', amount: 11900 },
      { month: 'May', amount: 13200 },
      { month: 'Jun', amount: 12847 }
    ],
    income: [
      { month: 'Jan', amount: 18000 },
      { month: 'Feb', amount: 18500 },
      { month: 'Mar', amount: 17800 },
      { month: 'Apr', amount: 19200 },
      { month: 'May', amount: 18700 },
      { month: 'Jun', amount: 18500 }
    ]
  }
}

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle
      case 'success': return CheckCircle
      case 'info': return Sparkles
      default: return AlertCircle
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'orange'
      case 'success': return 'emerald'
      case 'info': return 'blue'
      default: return 'blue'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Analytics"
        description="AI-powered insights into your financial habits"
        icon={BarChart3}
        badge="AI Powered"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* AI Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border border-purple-200/50 dark:border-purple-800/50 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Financial Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Based on your spending patterns, here are personalized recommendations
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-300/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <StatsGrid columns={4}>
        <StatsCard
          title="Total Spent"
          value={`$${analyticsData.overview.totalSpent.toLocaleString()}`}
          change={-8.2}
          trend="down"
          changeLabel="vs last month"
          icon={DollarSign}
          color="red"
        />
        <StatsCard
          title="Total Income"
          value={`$${analyticsData.overview.totalIncome.toLocaleString()}`}
          change={5.7}
          trend="up"
          changeLabel="vs last month"
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Savings Rate"
          value={`${analyticsData.overview.savingsRate}%`}
          change={2.1}
          trend="up"
          changeLabel="vs last month"
          icon={Target}
          color="blue"
        />
        <StatsCard
          title="Monthly Change"
          value={`${analyticsData.overview.monthlyChange > 0 ? '+' : ''}${analyticsData.overview.monthlyChange}%`}
          change={analyticsData.overview.monthlyChange}
          trend={analyticsData.overview.monthlyChange > 0 ? 'up' : 'down'}
          changeLabel="spending trend"
          icon={BarChart3}
          color={analyticsData.overview.monthlyChange > 0 ? 'orange' : 'emerald'}
          badge="AI"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Categories */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Spending by Category
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 6 months
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${category.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {category.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-red-500" />}
                      {category.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-emerald-500" />}
                      <span className={`${category.trend === 'up' ? 'text-red-500' : category.trend === 'down' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        {category.trend === 'neutral' ? 'No change' : `${category.trend === 'up' ? '+' : '-'}${Math.random() * 10 + 1 | 0}%`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type)
                const color = getInsightColor(insight.type)

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                        <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs text-primary hover:text-primary/80">
                          {insight.action} →
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>

          {/* Savings Goal */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Savings Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Emergency Fund</span>
                  <span className="text-sm font-medium">$3,900 / $5,000</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>78% complete</span>
                  <span>$1,100 remaining</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-200/30">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    On track to reach goal by December 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends Chart Placeholder */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Spending Trends
            </CardTitle>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="3m">3M</TabsTrigger>
                <TabsTrigger value="6m">6M</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Interactive Chart</p>
              <p className="text-sm text-muted-foreground">Chart component will be integrated here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPage
