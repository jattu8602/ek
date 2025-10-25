'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

export default function AdminSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState({
    siteName: 'Ekta Krishi Kendra',
    siteDescription:
      "India's trusted source for quality agricultural products.",
    contactEmail: 'admin@ektakrishi.com',
    contactPhone: '+91 9876543210',
    address: '123 Agriculture Street, Farm City, India - 123456',
    maintenanceMode: false,
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    analyticsEnabled: true,
    cacheEnabled: true,
    geminiApiKey: '',
    openaiApiKey: '',
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geminiApiKey: settings.geminiApiKey,
          openaiApiKey: settings.openaiApiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      console.log('Settings saved successfully')
      // You could add a toast notification here
    } catch (error) {
      console.error('Error saving settings:', error)
      // You could add an error toast notification here
    }
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      siteName: 'Ekta Krishi Kendra',
      siteDescription:
        "India's trusted source for quality agricultural products.",
      contactEmail: 'admin@ektakrishi.com',
      contactPhone: '+91 9876543210',
      address: '123 Agriculture Street, Farm City, India - 123456',
      maintenanceMode: false,
      emailNotifications: true,
      orderNotifications: true,
      userNotifications: true,
      analyticsEnabled: true,
      cacheEnabled: true,
    })
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                General
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                User Management
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                System
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderNotifications">
                    Order Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <Switch
                  id="orderNotifications"
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, orderNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="userNotifications">User Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new users register
                  </p>
                </div>
                <Switch
                  id="userNotifications"
                  checked={settings.userNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, userNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>Advanced system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analyticsEnabled">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable analytics tracking
                  </p>
                </div>
                <Switch
                  id="analyticsEnabled"
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, analyticsEnabled: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cacheEnabled">Cache</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable caching for better performance
                  </p>
                </div>
                <Switch
                  id="cacheEnabled"
                  checked={settings.cacheEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, cacheEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure external API keys for enhanced functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="Enter your OpenAI API key (optional)"
                  value={settings.openaiApiKey || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, openaiApiKey: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used for AI-powered product description generation. If not
                  provided, the default key will be used.
                </p>
              </div>
              <div>
                <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                <Input
                  id="geminiApiKey"
                  type="password"
                  placeholder="Enter your Gemini API key (optional)"
                  value={settings.geminiApiKey || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, geminiApiKey: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used for AI-powered image search. If not provided, the default
                  key will be used.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleSave}>Save Settings</Button>
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
