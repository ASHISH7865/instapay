'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  HeadphonesIcon,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Video,
  Send,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Download,
  Zap,
  Shield,
  CreditCard,
  Smartphone,
  Users,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Plus
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

// Mock data
const supportData = {
  stats: {
    avgResponseTime: '2 hours',
    resolutionRate: '98%',
    customerSatisfaction: '4.8/5',
    availableAgents: 12
  },
  tickets: [
    {
      id: 'TKT-001',
      subject: 'Unable to add payment method',
      status: 'open',
      priority: 'high',
      created: '2024-01-15T10:30:00Z',
      lastUpdate: '2024-01-15T14:20:00Z',
      category: 'payments'
    },
    {
      id: 'TKT-002',
      subject: 'Transaction not showing in history',
      status: 'pending',
      priority: 'medium',
      created: '2024-01-14T16:45:00Z',
      lastUpdate: '2024-01-15T09:15:00Z',
      category: 'transactions'
    },
    {
      id: 'TKT-003',
      subject: 'Account verification issue',
      status: 'resolved',
      priority: 'low',
      created: '2024-01-12T11:20:00Z',
      lastUpdate: '2024-01-13T13:30:00Z',
      category: 'account'
    }
  ],
  faq: [
    {
      category: 'Getting Started',
      icon: Zap,
      color: 'emerald',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click the "Sign Up" button on our homepage and follow the step-by-step registration process. You\'ll need to provide your email, create a password, and verify your identity.'
        },
        {
          question: 'What documents do I need for verification?',
          answer: 'For account verification, you\'ll need a government-issued photo ID (driver\'s license, passport, or state ID) and proof of address (utility bill or bank statement from the last 3 months).'
        },
        {
          question: 'How long does verification take?',
          answer: 'Account verification typically takes 1-2 business days. You\'ll receive an email notification once your account is verified and ready to use.'
        }
      ]
    },
    {
      category: 'Payments & Transfers',
      icon: CreditCard,
      color: 'blue',
      questions: [
        {
          question: 'How do I send money to someone?',
          answer: 'To send money, go to the Payments section, enter the recipient\'s email or phone number, specify the amount, and confirm the transaction. The recipient will receive the funds instantly.'
        },
        {
          question: 'What are the transfer limits?',
          answer: 'Daily transfer limits vary by account type: Basic accounts have a $2,500 daily limit, Premium accounts have a $10,000 limit, and Business accounts have a $50,000 limit.'
        },
        {
          question: 'Are there any fees for transfers?',
          answer: 'Transfers between InstaPay users are free. External bank transfers have a small fee of $0.25 for standard transfers (1-3 business days) or $1.50 for instant transfers.'
        }
      ]
    },
    {
      category: 'Security',
      icon: Shield,
      color: 'red',
      questions: [
        {
          question: 'How secure is my money?',
          answer: 'Your funds are protected by bank-level security, including 256-bit SSL encryption, two-factor authentication, and FDIC insurance up to $250,000.'
        },
        {
          question: 'What should I do if I suspect fraud?',
          answer: 'If you notice any suspicious activity, immediately contact our support team at (555) 123-4567 or use the "Report Fraud" button in your account settings. We\'ll investigate and protect your account.'
        },
        {
          question: 'How do I enable two-factor authentication?',
          answer: 'Go to Settings > Security > Two-Factor Authentication. You can enable 2FA using SMS, authenticator apps, or biometric authentication for enhanced security.'
        }
      ]
    },
    {
      category: 'Mobile App',
      icon: Smartphone,
      color: 'purple',
      questions: [
        {
          question: 'Is there a mobile app available?',
          answer: 'Yes! The InstaPay mobile app is available for both iOS and Android devices. Download it from the App Store or Google Play Store for convenient access to your account.'
        },
        {
          question: 'Can I use biometric login on mobile?',
          answer: 'Yes, our mobile app supports fingerprint and face recognition login for supported devices. Enable this feature in the app\'s security settings.'
        },
        {
          question: 'Do I need internet for all features?',
          answer: 'Most features require an internet connection, but you can view your recent transaction history and account balance offline once the app has synced.'
        }
      ]
    }
  ],
  articles: [
    {
      id: '1',
      title: 'Getting Started with InstaPay: Complete Guide',
      category: 'Getting Started',
      readTime: '5 min',
      views: 1250,
      helpful: 89,
      icon: BookOpen
    },
    {
      id: '2',
      title: 'Understanding Transaction Fees and Limits',
      category: 'Payments',
      readTime: '3 min',
      views: 890,
      helpful: 76,
      icon: CreditCard
    },
    {
      id: '3',
      title: 'Setting Up Two-Factor Authentication',
      category: 'Security',
      readTime: '4 min',
      views: 654,
      helpful: 92,
      icon: Shield
    },
    {
      id: '4',
      title: 'Mobile App Features and Tips',
      category: 'Mobile',
      readTime: '6 min',
      views: 432,
      helpful: 85,
      icon: Smartphone
    }
  ]
}

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('help')
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqItems, setOpenFaqItems] = useState<string[]>([])
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  })

  const toggleFaqItem = (id: string) => {
    setOpenFaqItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-700 dark:text-red-300'
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      case 'resolved': return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 dark:text-red-300'
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      case 'low': return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    }
  }

  const filteredArticles = supportData.articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Help & Support"
        description="Get help with your account, find answers, and contact our support team"
        icon={HeadphonesIcon}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
            <Button size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
          </div>
        }
      />

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">{supportData.stats.avgResponseTime}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold text-foreground">{supportData.stats.resolutionRate}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-foreground">{supportData.stats.customerSatisfaction}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Agents</p>
                <p className="text-2xl font-bold text-foreground">{supportData.stats.availableAgents}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Help Center</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">My Tickets</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
        </TabsList>

        {/* Help Center Tab */}
        <TabsContent value="help" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article, index) => {
                const Icon = article.icon
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{article.category}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.readTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {article.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {article.helpful}% helpful
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Video className="h-6 w-6" />
                    <span>Video Tutorials</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Download Guides</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <MessageCircle className="h-6 w-6" />
                    <span>Community Forum</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {supportData.faq.map((category, categoryIndex) => {
              const Icon = category.icon
              return (
                <Card key={categoryIndex} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-${category.color}-500/20 rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 text-${category.color}-600 dark:text-${category.color}-400`} />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {category.questions.map((item, itemIndex) => {
                      const itemId = `${categoryIndex}-${itemIndex}`
                      const isOpen = openFaqItems.includes(itemId)

                      return (
                        <Collapsible key={itemIndex} open={isOpen} onOpenChange={() => toggleFaqItem(itemId)}>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-4 h-auto text-left hover:bg-white/50 dark:hover:bg-slate-800/50"
                            >
                              <span className="font-medium">{item.question}</span>
                              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs">
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Not helpful
                              </Button>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* New Ticket Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Support Tickets</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {supportData.tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created: {new Date(ticket.created).toLocaleDateString()}</span>
                            <span>Last update: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                            <span className="capitalize">Category: {ticket.category}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Contact Methods */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Live Chat</h4>
                    <p className="text-sm text-muted-foreground">Available 24/7 • Avg response: 2 min</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Phone Support</h4>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567 • Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-muted-foreground">support@instapay.com • Response within 4 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Briefly describe your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="payments">Payments & Transfers</SelectItem>
                        <SelectItem value="security">Security Concerns</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SupportPage
