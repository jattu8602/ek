'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'

const ProfileContent = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('profile')
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your account information',
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
                            Not provided
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
