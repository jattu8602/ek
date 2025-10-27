'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Package,
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export default function CartPage() {
  const router = useRouter()
  const {
    cartItems,
    isLoading,
    isUpdatingCart,
    isRemovingFromCart,
    updateCartQuantity,
    removeFromCart,
    fetchCartItems,
  } = useCart()
  const { requireAuth } = useAuth()
  const [quantities, setQuantities] = useState({})
  const [selectedUnits, setSelectedUnits] = useState({})

  useEffect(() => {
    fetchCartItems()
  }, [])

  useEffect(() => {
    // Initialize quantities and selected units from cart items
    const initialQuantities = {}
    const initialUnits = {}

    cartItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity
      initialUnits[item.id] =
        item.selectedUnit ||
        `${item.product?.units?.[0]?.number || '1'} ${
          item.product?.units?.[0]?.type || 'kg'
        }`
    })

    setQuantities(initialQuantities)
    setSelectedUnits(initialUnits)
  }, [cartItems])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const item = cartItems.find((cartItem) => cartItem.id === itemId)
      if (item) {
        await updateCartQuantity(item.productId, newQuantity)
        setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }))
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleUnitChange = async (itemId, newUnit) => {
    try {
      const item = cartItems.find((cartItem) => cartItem.id === itemId)
      if (item) {
        // Find the unit ID for the selected unit
        const unit = item.product?.units?.find(
          (u) => `${u.number} ${u.type}` === newUnit
        )
        if (unit) {
          await updateCartQuantity(
            item.productId,
            quantities[itemId],
            unit.id,
            newUnit
          )
          setSelectedUnits((prev) => ({ ...prev, [itemId]: newUnit }))
        }
      }
    } catch (error) {
      console.error('Error updating unit:', error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const item = cartItems.find((cartItem) => cartItem.id === itemId)
      if (item) {
        await removeFromCart(item.productId)
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleBuyNow = (itemId) => {
    const item = cartItems.find((cartItem) => cartItem.id === itemId)
    if (item) {
      const unit = item.product?.units?.find(
        (u) => `${u.number} ${u.type}` === selectedUnits[itemId]
      )
      const totalPrice = unit ? unit.discountedPrice * quantities[itemId] : 0

      // Navigate to checkout with single item
      router.push(
        `/checkout?items=${encodeURIComponent(
          JSON.stringify([
            {
              productId: item.productId,
              unitId: item.unitId,
              selectedUnit: selectedUnits[itemId],
              quantity: quantities[itemId],
              productName: item.product?.name || 'Product',
              totalPrice: totalPrice,
            },
          ])
        )}`
      )
    }
  }

  const handleCheckoutAll = () => {
    const checkoutItems = cartItems.map((item) => {
      const unit = item.product?.units?.find(
        (u) => `${u.number} ${u.type}` === selectedUnits[item.id]
      )
      const totalPrice = unit ? unit.discountedPrice * quantities[item.id] : 0

      return {
        productId: item.productId,
        unitId: item.unitId,
        selectedUnit: selectedUnits[item.id],
        quantity: quantities[item.id],
        productName: item.product?.name || 'Product',
        totalPrice: totalPrice,
      }
    })

    router.push(
      `/checkout?items=${encodeURIComponent(JSON.stringify(checkoutItems))}`
    )
  }

  const calculateItemTotal = (item) => {
    const unit = item.product?.units?.find(
      (u) => `${u.number} ${u.type}` === selectedUnits[item.id]
    )
    if (unit) {
      return unit.discountedPrice * quantities[item.id]
    }
    return 0
  }

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} item(s) in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                        {item.product?.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product?.category}
                    </p>

                    {/* Unit Selection */}
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Unit</Label>
                      <Select
                        value={selectedUnits[item.id]}
                        onValueChange={(value) =>
                          handleUnitChange(item.id, value)
                        }
                        disabled={isUpdatingCart}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.product?.units?.map((unit, index) => (
                            <SelectItem
                              key={index}
                              value={`${unit.number} ${unit.type}`}
                            >
                              {unit.number} {unit.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              quantities[item.id] - 1
                            )
                          }
                          disabled={isUpdatingCart || quantities[item.id] <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {quantities[item.id]}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              quantities[item.id] + 1
                            )
                          }
                          disabled={isUpdatingCart}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemovingFromCart}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ₹{calculateItemTotal(item).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      per {selectedUnits[item.id]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{calculateCartTotal().toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleCheckoutAll}
                  disabled={isUpdatingCart || isRemovingFromCart}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout All ({cartItems.length} items)
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• Secure payment with Razorpay</p>
                <p>• Free delivery on all orders</p>
                <p>• Easy returns within 7 days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
