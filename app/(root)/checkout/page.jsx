'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  CreditCard,
  Package,
  Check,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { requireAuth } = useAuth()
  const { t } = useLanguage()

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Checkout data
  const [checkoutItems, setCheckoutItems] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  })
  const [isShopPickup, setIsShopPickup] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  // Payment data
  const [razorpayOrder, setRazorpayOrder] = useState(null)

  useEffect(() => {
    requireAuth(() => {
      // Parse items from URL params
      const itemsParam = searchParams.get('items')
      if (itemsParam) {
        try {
          const items = JSON.parse(decodeURIComponent(itemsParam))
          setCheckoutItems(items)
        } catch (error) {
          console.error('Error parsing items:', error)
          router.push('/cart')
        }
      } else {
        router.push('/cart')
      }

      fetchAddresses()
    })
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/user/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
        // Set default address if available
        const defaultAddress = data.find((addr) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleAddressSubmit = async () => {
    if (!selectedAddressId && !newAddress.name) {
      alert('Please select an address or add a new one')
      return
    }

    setLoading(true)
    try {
      let addressData

      if (selectedAddressId) {
        // Use existing address
        const selectedAddress = addresses.find(
          (addr) => addr.id === selectedAddressId
        )
        addressData = selectedAddress
      } else {
        // Create new address
        const response = await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAddress),
        })

        if (response.ok) {
          addressData = await response.json()
        } else {
          throw new Error('Failed to create address')
        }
      }

      if (!phoneNumber) {
        alert('Please enter your phone number')
        return
      }

      setCurrentStep(2)
    } catch (error) {
      console.error('Error handling address:', error)
      alert('Error processing address. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setPaymentLoading(true)
    try {
      // Create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          address: selectedAddressId
            ? addresses.find((addr) => addr.id === selectedAddressId)
            : newAddress,
          phoneNumber,
          isShopPickup,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment order')
      }

      const orderData = await response.json()
      setRazorpayOrder(orderData)

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Agricultural Store',
          description: 'Order Payment',
          order_id: orderData.orderId,
          handler: async function (response) {
            // Verify payment
            await verifyPayment(response)
          },
          prefill: {
            name:
              addresses.find((addr) => addr.id === selectedAddressId)?.name ||
              newAddress.name,
            email: 'customer@example.com',
            contact: phoneNumber,
          },
          theme: {
            color: '#059669',
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    } catch (error) {
      console.error('Error initiating payment:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          items: checkoutItems,
          address: selectedAddressId
            ? addresses.find((addr) => addr.id === selectedAddressId)
            : newAddress,
          phoneNumber,
          isShopPickup,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/checkout/success?orderId=${result.orderId}`)
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      alert('Payment verification failed. Please contact support.')
    }
  }

  const calculateTotal = () => {
    return checkoutItems.reduce((total, item) => {
      const itemTotal = item.totalPrice || 0
      return total + itemTotal
    }, 0)
  }

  const getSelectedAddress = () => {
    if (selectedAddressId) {
      return addresses.find((addr) => addr.id === selectedAddressId)
    }
    return newAddress
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order in {4 - currentStep} steps
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address & Contact */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Existing Addresses */}
                {addresses.length > 0 && (
                  <div>
                    <Label>Select Address</Label>
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={setSelectedAddressId}
                    >
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-center space-x-2 p-3 border rounded-lg"
                        >
                          <RadioGroupItem value={address.id} id={address.id} />
                          <Label
                            htmlFor={address.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.address}, {address.city},{' '}
                                {address.state} - {address.pincode}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.phone}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Add New Address */}
                <div>
                  <Label>Or Add New Address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPhone">Phone *</Label>
                      <Input
                        id="newPhone"
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Complete Address *</Label>
                      <Textarea
                        id="address"
                        value={newAddress.address}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Enter complete address"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            pincode: e.target.value,
                          }))
                        }
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div>
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            landmark: e.target.value,
                          }))
                        }
                        placeholder="Enter landmark"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddressSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Review
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Order Review */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Address */}
                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">{getSelectedAddress().name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getSelectedAddress().address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getSelectedAddress().city}, {getSelectedAddress().state}{' '}
                      - {getSelectedAddress().pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Phone: {phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {checkoutItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {item.productName || 'Product'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.selectedUnit} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.totalPrice || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <h3 className="font-semibold mb-2">Delivery Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shopPickup"
                        checked={isShopPickup}
                        onCheckedChange={setIsShopPickup}
                      />
                      <Label htmlFor="shopPickup">
                        Pick up from shop (Free)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="homeDelivery"
                        checked={!isShopPickup}
                        onCheckedChange={(checked) => setIsShopPickup(!checked)}
                      />
                      <Label htmlFor="homeDelivery">Home delivery (Free)</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Address
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="flex-1">
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                  <p className="text-muted-foreground mb-4">
                    Your payment will be processed securely through Razorpay
                  </p>
                  <Button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    size="lg"
                    className="w-full max-w-md"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ₹{calculateTotal().toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.productName || 'Product'} × {item.quantity}
                    </span>
                    <span>₹{(item.totalPrice || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Secure payment with Razorpay</p>
                <p>• Free delivery on all orders</p>
                <p>• Order requires admin approval</p>
                {isShopPickup ? (
                  <p>• Pick up from shop</p>
                ) : (
                  <p>• Home delivery (date to be set by admin)</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
