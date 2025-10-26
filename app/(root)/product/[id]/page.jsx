'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  ShoppingCart,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { addRecentProduct } from '@/lib/recentProducts'
import RelatedProducts from '@/components/RelatedProducts'

export default function ProductDetail({ params }) {
  const router = useRouter()
  const { t } = useLanguage()
  const { addToCart, isInFavorites, addToFavorites, removeFromFavorites } =
    useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get the ID directly from params
  const id = params.id

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          if (data.units && data.units.length > 0) {
            setSelectedUnit(`${data.units[0].number} ${data.units[0].type}`)
          }

          // Track product view
          addRecentProduct({
            id: data.id,
            name: data.name,
            image: data.images[0] || '/placeholder-product.jpg',
            category: data.category,
            subcategory: data.subcategory,
            price: data.units[0]?.discountedPrice || 0,
            unit: data.units[0]
              ? `${data.units[0].number} ${data.units[0].type}`
              : '',
          })

          // Sync with database if logged in
          try {
            await fetch('/api/user/recent-products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productId: data.id }),
            })
          } catch (error) {
            console.error('Error tracking product view:', error)
          }
        } else if (response.status === 404) {
          notFound()
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumbs Skeleton */}
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Product Details Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <div className="flex gap-2">
                <Skeleton className="w-16 h-16" />
                <Skeleton className="w-16 h-16" />
                <Skeleton className="w-16 h-16" />
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              {/* Pricing Skeleton */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>

                {/* Unit Selection Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Quantity Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-12 w-12" />
                </div>

                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>

          {/* Description and Specs Skeleton */}
          <div className="mt-12 space-y-6">
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          {/* Reviews Skeleton */}
          <div className="mt-12">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="text-center py-8">
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if product is not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const selectedUnitData = product.units?.find(
    (unit) => `${unit.number} ${unit.type}` === selectedUnit
  )

  const handleAddToCart = () => {
    const unit = product.units?.find(
      (u) => `${u.number} ${u.type}` === selectedUnit
    )
    if (unit) {
      addToCart(product.id, quantity, unit.id, selectedUnit)
    }
  }

  const handleToggleFavorite = () => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product.id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-primary capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-border'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.averageRating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  ₹
                  {selectedUnitData?.discountedPrice ||
                    product.units?.[0]?.discountedPrice ||
                    'N/A'}
                </span>
                {selectedUnitData?.actualPrice &&
                  selectedUnitData?.discountedPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{selectedUnitData.actualPrice}
                    </span>
                  )}
                {selectedUnitData?.actualPrice &&
                  selectedUnitData?.discountedPrice && (
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {Math.round(
                        ((selectedUnitData.actualPrice -
                          selectedUnitData.discountedPrice) /
                          selectedUnitData.actualPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
              </div>

              {/* Unit Selection */}
              {product.units && product.units.length > 1 && (
                <div className="space-y-2">
                  <Label>Select Unit</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.units.map((unit, index) => (
                        <SelectItem
                          key={index}
                          value={`${unit.number} ${unit.type}`}
                        >
                          {unit.number} {unit.type} - ₹{unit.discountedPrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    size={20}
                    className={
                      isInFavorites(product.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }
                  />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 size={20} />
                </Button>
              </div>

              {/* Buy Now Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  // Navigate to checkout with single item
                  const checkoutItem = {
                    productId: product.id,
                    unitId: selectedUnitData?.id,
                    selectedUnit: selectedUnit,
                    quantity: quantity,
                    totalPrice: selectedUnitData?.discountedPrice * quantity,
                    unitPrice: selectedUnitData?.discountedPrice,
                    productName: product.name,
                  }

                  router.push(
                    `/checkout?items=${encodeURIComponent(
                      JSON.stringify([checkoutItem])
                    )}`
                  )
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      Subcategory:
                    </span>
                    <span className="text-gray-900">{product.subcategory}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      Available Units:
                    </span>
                    <span className="text-gray-900">
                      {product.units
                        ?.map((unit) => `${unit.number} ${unit.type}`)
                        .join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className="text-gray-900 capitalize">
                      {product.status?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to review this product!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <RelatedProducts
          category={product.category}
          subcategory={product.subcategory}
          currentProductId={product.id}
        />
      </div>
    </div>
  )
}
