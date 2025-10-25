'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle,
  Package,
  Calendar,
  MapPin,
  Phone,
  ArrowLeft,
  ShoppingBag,
  Clock,
} from 'lucide-react'

function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const id = searchParams.get('orderId')
    if (id) {
      setOrderId(id)
      fetchOrderDetails(id)
    } else {
      router.push('/')
    }
  }, [])

  const fetchOrderDetails = async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        console.error('Failed to fetch order details')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Your order is pending admin approval'
      case 'APPROVED':
        return 'Your order has been approved and is being processed'
      case 'REJECTED':
        return 'Your order has been rejected. Refund will be processed.'
      case 'PROCESSING':
        return 'Your order is being prepared'
      case 'SHIPPED':
        return 'Your order has been shipped'
      case 'DELIVERED':
        return 'Your order has been delivered'
      default:
        return 'Order status unknown'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We'll process it shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {getStatusMessage(order.status)}
              </p>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    {(() => {
                      const address = JSON.parse(order.shippingAddress)
                      return (
                        <div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.landmark && (
                            <p className="text-sm text-muted-foreground">
                              Landmark: {address.landmark}
                            </p>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {order.isShopPickup ? 'Pick up from shop' : 'Home delivery'}
                  </span>
                </div>
                {order.deliveryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Expected delivery:{' '}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedUnit} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{item.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span>₹{item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Payment ID: {order.paymentId}</p>
                <p>• Payment Status: {order.paymentStatus}</p>
                <p>• Order requires admin approval</p>
                {order.isShopPickup ? (
                  <p>• Pick up from shop</p>
                ) : (
                  <p>• Home delivery (date to be set)</p>
                )}
              </div>

              <div className="space-y-2">
                <Link href="/profile?section=orders" className="block">
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}
