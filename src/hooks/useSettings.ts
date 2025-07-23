import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface Settings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string | null
    dateOfBirth: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  security: {
    twoFactorEnabled: boolean
    biometricEnabled: boolean
    passwordLastChanged: string
    loginNotifications: boolean
    sessionTimeout: number
  }
  notifications: {
    email: {
      transactions: boolean
      security: boolean
      marketing: boolean
      updates: boolean
    }
    push: {
      transactions: boolean
      security: boolean
      marketing: boolean
      updates: boolean
    }
    sms: {
      transactions: boolean
      security: boolean
      marketing: boolean
      updates: boolean
    }
  }
  preferences: {
    theme: string
    language: string
    currency: string
    timezone: string
    dateFormat: string
    numberFormat: string
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Update settings
  const updateSettings = useCallback(async (section: string, data: Record<string, unknown>) => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      })

      return updatedSettings
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      })
      throw error
    } finally {
      setSaving(false)
    }
  }, [toast])

  // Update password
  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update password')
      }

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
    } catch (error) {
      console.error('Error updating password:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive',
      })
      throw error
    } finally {
      setSaving(false)
    }
  }, [toast])

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/settings/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload avatar')
      }

      const result = await response.json()

      // Update local settings with new avatar
      if (settings) {
        setSettings({
          ...settings,
          profile: {
            ...settings.profile,
            avatar: result.imageUrl
          }
        })
      }

      toast({
        title: 'Success',
        description: 'Avatar updated successfully',
      })

      return result.imageUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      })
      throw error
    } finally {
      setSaving(false)
    }
  }, [settings, toast])

  // Remove avatar
  const removeAvatar = useCallback(async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings/avatar', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove avatar')
      }

      // Update local settings
      if (settings) {
        setSettings({
          ...settings,
          profile: {
            ...settings.profile,
            avatar: null
          }
        })
      }

      toast({
        title: 'Success',
        description: 'Avatar removed successfully',
      })
    } catch (error) {
      console.error('Error removing avatar:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove avatar',
        variant: 'destructive',
      })
      throw error
    } finally {
      setSaving(false)
    }
  }, [settings, toast])

  // Export data
  const exportData = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      const response = await fetch(`/api/settings/export?format=${format}`)

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `instapay-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: `Data exported successfully as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: 'Error',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  // Load settings on mount
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    saving,
    updateSettings,
    updatePassword,
    uploadAvatar,
    removeAvatar,
    exportData,
    refreshSettings: fetchSettings,
  }
}
