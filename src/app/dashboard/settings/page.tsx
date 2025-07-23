/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettings } from '@/hooks/useSettings'
import { useGeoData } from '@/hooks/useGeoData'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { useTheme } from 'next-themes'
import {
    Settings,
    User,
    Shield,
    Bell,
    Globe,
    Smartphone,
    Edit,
    Camera,
    Key,
    Fingerprint,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Palette,
    Moon,
    Sun,
    Monitor,
    Download,
    Upload,
    Trash2,
    CheckCircle,
    Info,
    Lock,
    EyeOff,
    Eye,
    Loader2,
    Search
} from 'lucide-react'



const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile')
    const [showPassword, setShowPassword] = useState(false);

    const {
        settings,
        loading,
        saving,
        updateSettings,
        exportData
    } = useSettings()

      const { loading: geoLoading, searchCountries, searchTimezones, searchCurrencies } = useGeoData()
  const { preferences, updatePreferences, formatAmount } = useUserPreferences()

  // Track changes to preferences
  const handlePreferenceChange = (updates: any) => {
    updatePreferences(updates)
    setHasUnsavedChanges(true)
  }
  const { theme, setTheme } = useTheme()

  const [countrySearch, setCountrySearch] = useState('')
  const [timezoneSearch, setTimezoneSearch] = useState('')
  const [currencySearch, setCurrencySearch] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const filteredCountries = searchCountries(countrySearch)
  const filteredTimezones = searchTimezones(timezoneSearch)
  const filteredCurrencies = searchCurrencies(currencySearch)

      const updateSetting = async (section: string, key: string, value: string | boolean | number) => {
    if (!settings) return

    // Handle theme changes immediately
    if (section === 'preferences' && key === 'theme') {
      setTheme(value as string)
      setHasUnsavedChanges(true)
      return
    }

    const sectionData = { ...settings[section as keyof typeof settings] }
    ; (sectionData as any)[key] = value

    try {
      await updateSettings(section, sectionData)
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

    const updateNestedSetting = async (section: string, subsection: string, key: string, value: any) => {
        if (!settings) return

        const sectionData = { ...settings[section as keyof typeof settings] }
        const subsectionData = { ...(sectionData as any)[subsection] }
        subsectionData[key] = value
            ; (sectionData as any)[subsection] = subsectionData

        try {
            await updateSettings(section, sectionData)
        } catch (error) {
            console.error('Error updating nested setting:', error)
        }
    }



    const handleExportData = async (format: 'json' | 'csv') => {
        try {
            await exportData(format)
        } catch (error) {
            console.error('Error exporting data:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading settings...</span>
                </div>
            </div>
        )
    }

    if (!settings) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Failed to load settings</p>
                    <Button onClick={() => window.location.reload()} className="mt-2">
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <PageHeader
                title="Settings"
                description="Manage your account preferences and security settings"
                icon={Settings}
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData('json')}
                            disabled={saving}
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            Export JSON
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData('csv')}
                            disabled={saving}
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            Export CSV
                        </Button>
                    </div>
                }
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Preferences</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Profile Picture */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    Profile Picture
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 ring-4 ring-white/20">
                                            <AvatarImage src={settings.profile.avatar || undefined} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-xl">
                                                {settings.profile.firstName[0]}{settings.profile.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2">
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold">{settings.profile.firstName} {settings.profile.lastName}</h3>
                                        <p className="text-sm text-muted-foreground">{settings.profile.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={settings.profile.firstName}
                                                onChange={(e) => updateSetting('profile', 'firstName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={settings?.profile?.lastName || ''}
                                                onChange={(e) => updateSetting('profile', 'lastName', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                className="pl-10"
                                                value={settings?.profile?.email || ''}
                                                onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                className="pl-10"
                                                value={settings.profile.phone}
                                                onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                className="pl-10"
                                                value={settings.profile.dateOfBirth}
                                                onChange={(e) => updateSetting('profile', 'dateOfBirth', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Address */}
                            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Address Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            value={settings.profile.address.street}
                                            onChange={(e) => updateNestedSetting('profile', 'address', 'street', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={settings.profile.address.city}
                                                onChange={(e) => updateNestedSetting('profile', 'address', 'city', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={settings.profile.address.state}
                                                onChange={(e) => updateNestedSetting('profile', 'address', 'state', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">ZIP Code</Label>
                                            <Input
                                                id="zipCode"
                                                value={settings.profile.address.zipCode}
                                                onChange={(e) => updateNestedSetting('profile', 'address', 'zipCode', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Select value={settings.profile.address.country} onValueChange={(value) => updateNestedSetting('profile', 'address', 'country', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="United States">United States</SelectItem>
                                                    <SelectItem value="Canada">Canada</SelectItem>
                                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                    <SelectItem value="Australia">Australia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Password & Authentication */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Password & Authentication
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter current password"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" placeholder="Enter new password" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input type="password" placeholder="Confirm new password" />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">
                                            Password last changed: {settings?.security?.passwordLastChanged ? new Date(settings.security.passwordLastChanged).toLocaleDateString() : 'Never'}
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full">
                                    <Key className="h-4 w-4 mr-2" />
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Two-Factor Authentication */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Two-Factor Authentication
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-emerald-900 dark:text-emerald-100">2FA Enabled</h4>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-300">Your account is secured</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings?.security?.twoFactorEnabled || false}
                                        onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                            <Fingerprint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Biometric Authentication</h4>
                                            <p className="text-sm text-muted-foreground">Fingerprint & Face ID</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings?.security?.biometricEnabled || false}
                                        onCheckedChange={(checked) => updateSetting('security', 'biometricEnabled', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Login Notifications</h4>
                                            <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings?.security?.loginNotifications || false}
                                        onCheckedChange={(checked) => updateSetting('security', 'loginNotifications', checked)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Session Timeout (minutes)</Label>
                                    <Select value={settings?.security?.sessionTimeout?.toString() || '15'} onValueChange={(value) => updateSetting('security', 'sessionTimeout', parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15">15 minutes</SelectItem>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="60">1 hour</SelectItem>
                                            <SelectItem value="120">2 hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Email Notifications */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Email Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(settings?.notifications?.email || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {key === 'transactions' && 'Payment confirmations and receipts'}
                                                {key === 'security' && 'Login alerts and security updates'}
                                                {key === 'marketing' && 'Promotional offers and news'}
                                                {key === 'updates' && 'Product updates and new features'}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={value}
                                            onCheckedChange={(checked) => updateNestedSetting('notifications', 'email', key, checked)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Push Notifications */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5" />
                                    Push Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(settings?.notifications?.push || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {key === 'transactions' && 'Instant payment notifications'}
                                                {key === 'security' && 'Security alerts and warnings'}
                                                {key === 'marketing' && 'Special offers and promotions'}
                                                {key === 'updates' && 'App updates and announcements'}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={value}
                                            onCheckedChange={(checked) => updateNestedSetting('notifications', 'push', key, checked)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* SMS Notifications */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    SMS Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(settings?.notifications?.sms || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {key === 'transactions' && 'SMS confirmations for payments'}
                                                {key === 'security' && 'Critical security alerts only'}
                                                {key === 'marketing' && 'Promotional text messages'}
                                                {key === 'updates' && 'Important service updates'}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={value}
                                            onCheckedChange={(checked) => updateNestedSetting('notifications', 'sms', key, checked)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Appearance */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Appearance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'light', icon: Sun, label: 'Light' },
                                            { value: 'dark', icon: Moon, label: 'Dark' },
                                            { value: 'system', icon: Monitor, label: 'System' }
                                        ].map(({ value, icon: Icon, label }) => (
                                                                    <Button
                          key={value}
                          variant={theme === value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('preferences', 'theme', value)}
                          className="flex flex-col gap-2 h-auto p-4"
                        >
                                                <Icon className="h-5 w-5" />
                                                <span className="text-xs">{label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Regional Settings */}
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Regional Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange({ language: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Country</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search countries..."
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select
                                        value={preferences.country}
                                        onValueChange={(value) => handlePreferenceChange({ country: value })}
                                        disabled={geoLoading.countries}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={geoLoading.countries ? "Loading countries..." : "Select country"} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {filteredCountries.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{country.name}</span>
                                                        <span className="text-xs text-muted-foreground">({country.code})</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search currencies..."
                                            value={currencySearch}
                                            onChange={(e) => setCurrencySearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select
                                        value={preferences.currency}
                                        onValueChange={(value) => handlePreferenceChange({ currency: value })}
                                        disabled={geoLoading.currencies}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={geoLoading.currencies ? "Loading currencies..." : "Select currency"} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {filteredCurrencies.map((currency) => (
                                                <SelectItem key={currency.code} value={currency.code}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{currency.symbol}</span>
                                                        <span>{currency.name}</span>
                                                        <span className="text-xs text-muted-foreground">({currency.code})</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {preferences.currency && (
                                        <div className="text-sm text-muted-foreground">
                                            Example: {formatAmount(1234.56)}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search timezones..."
                                            value={timezoneSearch}
                                            onChange={(e) => setTimezoneSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select
                                        value={preferences.timezone}
                                        onValueChange={(value) => handlePreferenceChange({ timezone: value })}
                                        disabled={geoLoading.timezones}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={geoLoading.timezones ? "Loading timezones..." : "Select timezone"} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {filteredTimezones.map((timezone) => (
                                                <SelectItem key={timezone.value} value={timezone.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{timezone.label}</span>
                                                        <span className="text-xs text-muted-foreground">({timezone.offset})</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Date Format</Label>
                                    <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange({ dateFormat: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>

            {/* Save Changes */}
            {hasUnsavedChanges && (
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Unsaved Changes</h4>
                                    <p className="text-sm text-muted-foreground">You have unsaved changes. Click save to apply them.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setHasUnsavedChanges(false)
                                        // Reset to original values
                                    }}
                                >
                                    Discard Changes
                                </Button>
                                <Button
                                    onClick={() => {
                                        setHasUnsavedChanges(false)
                                        // Save all changes
                                    }}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default SettingsPage
