'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  User,
  ShoppingCart,
  Package,
  Heart,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Edit,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react'

const ProfileContent = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('profile')
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [personalForm, setPersonalForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  })
  const [personalError, setPersonalError] = useState('')
  const [personalSuccess, setPersonalSuccess] = useState('')
  const [isPersonalLoading, setIsPersonalLoading] = useState(false)
  const [userAddress, setUserAddress] = useState(null)
  const [isResendingVerification, setIsResendingVerification] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const section = searchParams.get('section')
    if (
      section &&
      ['profile', 'cart', 'orders', 'favorites'].includes(section)
    ) {
      setActiveSection(section)
    }
  }, [searchParams])

  // Fetch user data
  useEffect(() => {
    if (session) {
      fetchCartItems()
      fetchFavorites()
      fetchUserAddress()
      // Initialize personal form with user data
      setPersonalForm({
        name: session.user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
      })
    }
  }, [session])

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const fetchUserAddress = async () => {
    try {
      const response = await fetch('/api/user/addresses')
      if (response.ok) {
        const data = await response.json()
        const defaultAddress = data.addresses?.find((addr) => addr.isDefault)
        if (defaultAddress) {
          setUserAddress(defaultAddress)
          setPersonalForm((prev) => ({
            ...prev,
            phone: defaultAddress.phone || '',
            address: defaultAddress.address || '',
            city: defaultAddress.city || '',
            state: defaultAddress.state || '',
            pincode: defaultAddress.pincode || '',
            landmark: defaultAddress.landmark || '',
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching user address:', error)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors when user starts typing
    if (passwordError) setPasswordError('')
    if (passwordSuccess) setPasswordSuccess('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all required fields')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess('Password updated successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        setPasswordError(data.error || 'Failed to update password')
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handlePersonalChange = (e) => {
    const { name, value } = e.target
    setPersonalForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors when user starts typing
    if (personalError) setPersonalError('')
    if (personalSuccess) setPersonalSuccess('')
  }

  const handlePersonalSubmit = async (e) => {
    e.preventDefault()

    if (!personalForm.name.trim()) {
      setPersonalError('Name is required')
      return
    }

    setIsPersonalLoading(true)
    setPersonalError('')
    setPersonalSuccess('')

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalForm),
      })

      const data = await response.json()

      if (response.ok) {
        setPersonalSuccess('Profile updated successfully!')
        // Refresh address data
        fetchUserAddress()
        // Update session data if needed
        window.location.reload() // Simple refresh to update session
      } else {
        setPersonalError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setPersonalError('An error occurred. Please try again.')
    } finally {
      setIsPersonalLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    setPersonalError('')
    setPersonalSuccess('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user?.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPersonalSuccess('Verification email sent! Please check your inbox.')
      } else {
        setPersonalError(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      setPersonalError('An error occurred. Please try again.')
    } finally {
      setIsResendingVerification(false)
    }
  }

  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your account information',
    },
    {
      id: 'personal',
      label: 'Personal Info',
      icon: User,
      description: 'Update your personal details',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Lock,
      description: 'Password and security settings',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      description: 'Review your cart items',
      badge: cartItems.length > 0 ? cartItems.length : null,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      description: 'Track your orders',
      comingSoon: true,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      description: 'Your saved items',
      badge: favorites.length > 0 ? favorites.length : null,
    },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={session.user?.image || ''}
                      alt={session.user?.name || ''}
                    />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{session.user?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.user?.email}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {session.user?.role || 'CUSTOMER'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors ${
                          activeSection === item.id ? 'bg-muted' : ''
                        }`}
                        disabled={item.comingSoon}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.label}</span>
                              {item.comingSoon && (
                                <Badge variant="outline" className="text-xs">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {item.badge && (
                          <Badge variant="default" className="ml-2">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                  <Separator className="my-2" />
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">
                      {isLoading ? 'Signing out...' : 'Sign Out'}
                    </span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-sm text-muted-foreground">
                        {session.user?.name || 'Not provided'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Account Type
                      </label>
                      <Badge variant="secondary">
                        {session.user?.role || 'CUSTOMER'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Member Since
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">
                            {userAddress?.phone || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Default Address</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      {userAddress ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {userAddress.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userAddress.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userAddress.address}, {userAddress.city},{' '}
                            {userAddress.state} - {userAddress.pincode}
                          </p>
                          {userAddress.landmark && (
                            <p className="text-sm text-muted-foreground">
                              Landmark: {userAddress.landmark}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            No address provided yet
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Update your address in the Personal Info section
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'cart' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {cartItems.length} item(s) in your cart
                  </p>
                </CardHeader>
                <CardContent>
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                          <div className="w-16 h-16 bg-muted rounded-md"></div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {item.product?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              ₹{item.product?.price}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      ))}
                      <div className="flex justify-end pt-4">
                        <Button>Proceed to Checkout</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add some items to get started
                      </p>
                      <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Package className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Orders feature coming soon!</strong>
                      <br />
                      For now, please contact us directly for order inquiries.
                      <br />
                      <div className="mt-2">
                        <strong>Contact:</strong> 8602074069
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {activeSection === 'personal' && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Update your personal details and contact information
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {personalError && (
                    <Alert variant="destructive">
                      <AlertDescription>{personalError}</AlertDescription>
                    </Alert>
                  )}

                  {personalSuccess && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{personalSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handlePersonalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={personalForm.name}
                          onChange={handlePersonalChange}
                          placeholder="Enter your full name"
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="email"
                            value={session.user?.email || ''}
                            placeholder="Enter your email"
                            className="flex-1"
                            disabled
                          />
                          <Badge
                            variant={
                              session.user?.emailVerified
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {session.user?.emailVerified
                              ? 'Verified'
                              : 'Not Verified'}
                          </Badge>
                        </div>
                        {!session.user?.emailVerified && (
                          <div className="mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleResendVerification}
                              disabled={isResendingVerification}
                            >
                              {isResendingVerification
                                ? 'Sending...'
                                : 'Resend Verification Email'}
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed. Contact support if needed.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Address Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={personalForm.phone}
                            onChange={handlePersonalChange}
                            placeholder="Enter your phone number"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={personalForm.address}
                            onChange={handlePersonalChange}
                            placeholder="Enter your address"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={personalForm.city}
                            onChange={handlePersonalChange}
                            placeholder="Enter your city"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={personalForm.state}
                            onChange={handlePersonalChange}
                            placeholder="Enter your state"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            value={personalForm.pincode}
                            onChange={handlePersonalChange}
                            placeholder="Enter your pincode"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="landmark">Landmark (Optional)</Label>
                          <Input
                            id="landmark"
                            name="landmark"
                            value={personalForm.landmark}
                            onChange={handlePersonalChange}
                            placeholder="Enter landmark if any"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isPersonalLoading}
                      >
                        {isPersonalLoading
                          ? 'Updating...'
                          : 'Update Information'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveSection('profile')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your password and security preferences
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{passwordSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          placeholder="Enter your current password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.current ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {session.user?.password
                            ? 'Required to change password'
                            : 'Leave blank if you signed up with Google'}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <Link href="/forgot-password">
                            {session.user?.password
                              ? 'Forgot password?'
                              : 'Set up password?'}
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.new ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {passwordForm.newPassword && (
                        <p className="text-xs text-muted-foreground">
                          {passwordForm.newPassword.length < 8
                            ? 'Password must be at least 8 characters long'
                            : 'Password looks good!'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.confirm ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {passwordForm.confirmPassword && (
                        <p className="text-xs text-muted-foreground">
                          {passwordForm.newPassword !==
                          passwordForm.confirmPassword
                            ? 'Passwords do not match'
                            : 'Passwords match!'}
                        </p>
                      )}
                    </div>

                    <Button type="submit" disabled={isPasswordLoading}>
                      {isPasswordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Account Security</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Verification</span>
                        <Badge
                          variant={
                            session.user?.emailVerified
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {session.user?.emailVerified
                            ? 'Verified'
                            : 'Not Verified'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Login Method</span>
                        <Badge variant="secondary">
                          {session.user?.password
                            ? 'Email & Password'
                            : 'Google OAuth'}
                        </Badge>
                      </div>
                    </div>

                    {session.user?.password && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <h5 className="font-medium mb-2">
                          Forgot Your Password?
                        </h5>
                        <p className="text-sm text-muted-foreground mb-3">
                          If you've completely forgotten your password, you can
                          reset it using your email address.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/forgot-password">Reset Password</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'favorites' && (
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Items</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {favorites.length} item(s) saved
                  </p>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="w-full h-32 bg-muted rounded-md mb-3"></div>
                          <h4 className="font-medium">{item.product?.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.product?.category}
                          </p>
                          <p className="text-sm font-medium">
                            ₹{item.product?.price}
                          </p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" className="flex-1">
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Save items you love to see them here
                      </p>
                      <Button asChild>
                        <Link href="/">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfilePage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}

export default ProfilePage
