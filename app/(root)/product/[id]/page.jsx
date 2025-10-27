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
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { addRecentProduct } from '@/lib/recentProducts'
import RelatedProducts from '@/components/RelatedProducts'
import ReviewRestrictionDialog from '@/components/ReviewRestrictionDialog'
import ShareProductDialog from '@/components/ShareProductDialog'

export default function ProductDetail({ params }) {
  const router = useRouter()
  const { t } = useLanguage()
  const {
    addToCart,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    isAddingToCart,
  } = useCart()
  const { requireAuth } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checkingPurchase, setCheckingPurchase] = useState(false)
  const [showReviewRestriction, setShowReviewRestriction] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  // Get the ID directly from params
  const id = params.id

  // Fetch reviews
  const fetchReviews = async () => {
    if (!id) return

    try {
      setReviewsLoading(true)
      const response = await fetch(`/api/products/${id}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  // Check if user has purchased this product
  const checkPurchaseStatus = async () => {
    if (!id) return

    try {
      setCheckingPurchase(true)
      const response = await fetch(`/api/products/${id}/reviews`)
      if (response.status === 403) {
        setHasPurchased(false)
      } else if (response.ok) {
        setHasPurchased(true)
      }
    } catch (error) {
      console.error('Error checking purchase status:', error)
    } finally {
      setCheckingPurchase(false)
    }
  }

  // Handle review submission attempt
  const handleReviewSubmit = () => {
    if (!hasPurchased) {
      setShowReviewRestriction(true)
      return
    }
    submitReview()
  }

  // Submit review
  const submitReview = async () => {
    if (!reviewText.trim() || !hasPurchased) return

    try {
      setSubmittingReview(true)
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: reviewText.trim() }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews((prev) => [newReview, ...prev])
        setReviewText('')
        // Update product review count
        setProduct((prev) => ({
          ...prev,
          reviewCount: (prev.reviewCount || 0) + 1,
        }))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Handle going to cart from popup
  const handleGoToCart = () => {
    setShowReviewRestriction(false)
    handleAddToCart()
  }

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

  // Fetch reviews and check purchase status when product loads
  useEffect(() => {
    if (product) {
      fetchReviews()
      checkPurchaseStatus()
    }
  }, [product])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumbs Skeleton */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-12"></div>
            <div className="h-4 w-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-4 w-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Product Images Skeleton */}
            <div className="space-y-2 md:space-y-4">
              <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
              <div className="flex gap-1 md:gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-md animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-3">
                <div className="h-8 md:h-10 bg-muted rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-muted rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Pricing Skeleton */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <div className="h-8 md:h-10 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-6 md:h-8 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                </div>

                {/* Unit Selection Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>

                {/* Quantity Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-8 animate-pulse"></div>
                    <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Desktop Buttons Skeleton */}
                <div className="hidden md:flex gap-4">
                  <div className="h-12 bg-muted rounded w-48 animate-pulse"></div>
                  <div className="h-12 bg-muted rounded w-12 animate-pulse"></div>
                </div>

                {/* Mobile Buttons Skeleton */}
                <div className="flex gap-3 md:hidden">
                  <div className="h-12 bg-muted rounded flex-1 animate-pulse"></div>
                  <div className="h-12 bg-muted rounded flex-1 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Description and Specifications Skeleton */}
            <div className="space-y-4 md:space-y-6">
              {/* Description Skeleton */}
              <div className="bg-muted/30 rounded-xl p-4 md:p-6 border border-muted/50 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-muted rounded"></div>
                  <div className="h-5 bg-muted rounded w-24"></div>
                </div>
                <div className="h-px bg-muted/50 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>

              {/* Specifications Skeleton */}
              <div className="bg-muted/30 rounded-xl p-4 md:p-6 border border-muted/50 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-muted rounded"></div>
                  <div className="h-5 bg-muted rounded w-28"></div>
                </div>
                <div className="h-px bg-muted/50 mb-3"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-muted rounded w-20"></div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                      <div className="h-px bg-muted/30"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section Skeleton */}
          <div className="mt-8 md:mt-12">
            <div className="border-t pt-6 md:pt-8">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
                <div className="h-6 md:h-8 bg-muted rounded w-48 animate-pulse"></div>
              </div>

              {/* Review Form Skeleton */}
              <div className="bg-muted/30 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-muted/50 animate-pulse">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="w-5 h-5 bg-muted rounded"></div>
                  <div className="h-5 bg-muted rounded w-24"></div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="h-20 md:h-24 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded w-32"></div>
                </div>
              </div>

              {/* Reviews List Skeleton */}
              <div className="space-y-4 md:space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted/20 rounded-xl p-4 md:p-6 border border-muted/30 animate-pulse"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="w-1 h-1 bg-muted rounded-full"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                        <div className="h-px bg-muted/50"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* More Products Skeleton */}
          <div className="mt-8 md:mt-12">
            <div className="h-6 md:h-8 bg-muted rounded w-48 mb-4 md:mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
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
    requireAuth(() => {
      const unit = product.units?.find(
        (u) => `${u.number} ${u.type}` === selectedUnit
      )
      if (unit) {
        addToCart(product.id, quantity, unit.id, selectedUnit)
      } else {
        // Fallback to first unit if no unit selected
        if (product.units && product.units.length > 0) {
          const firstUnit = product.units[0]
          addToCart(
            product.id,
            quantity,
            firstUnit.id,
            `${firstUnit.number} ${firstUnit.type}`
          )
        } else {
          addToCart(product.id, quantity)
        }
      }
    })
  }

  const handleToggleFavorite = () => {
    requireAuth(() => {
      if (isInFavorites(product.id)) {
        removeFromFavorites(product.id)
      } else {
        addToFavorites(product.id)
      }
    })
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
          <Link href="/" className="hover:text-primary flex-shrink-0">
            Home
          </Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <Link
            href={`/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-primary capitalize flex-shrink-0"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-foreground truncate min-w-0">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Product Images */}
          <div className="space-y-2 md:space-y-4">
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
              <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 ${
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
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating || 0)
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
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <span className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                  ₹
                  {selectedUnitData?.discountedPrice ||
                    product.units?.[0]?.discountedPrice ||
                    'N/A'}
                </span>
                {selectedUnitData?.actualPrice &&
                  selectedUnitData?.discountedPrice && (
                    <span className="text-base md:text-lg text-muted-foreground line-through">
                      ₹{selectedUnitData.actualPrice}
                    </span>
                  )}
                {selectedUnitData?.actualPrice &&
                  selectedUnitData?.discountedPrice && (
                    <span className="bg-red-100 text-red-800 text-xs md:text-sm font-medium px-2 py-1 rounded">
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
                  {/* Share and Like buttons next to quantity controls on mobile */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="md:hidden"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="md:hidden"
                    onClick={handleToggleFavorite}
                  >
                    <Heart
                      size={16}
                      className={
                        isInFavorites(product.id)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }
                    />
                  </Button>
                </div>
              </div>

              {/* Favorite Button - Desktop only */}
              <div className="hidden md:flex justify-start">
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
                  <span className="ml-2">
                    {isInFavorites(product.id)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="ml-4"
                  onClick={() => setShowShareDialog(true)}
                >
                  <Share2 size={20} />
                </Button>
              </div>

              {/* Add to Cart and Buy Now - Side by side */}
              <div className="flex flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
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
            </div>
          </div>

          {/* Description and Specifications */}
          <div className="space-y-4 md:space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl p-4 md:p-6 border border-muted/50">
              <h3 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Description
              </h3>
              <div className="w-full h-px bg-gradient-to-r from-muted/50 to-transparent mb-3"></div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl p-4 md:p-6 border border-muted/50">
              <h3 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                <Star size={18} className="text-primary" />
                Specifications
              </h3>
              <div className="w-full h-px bg-gradient-to-r from-muted/50 to-transparent mb-3"></div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-sm md:text-base">
                    Category:
                  </span>
                  <span className="text-muted-foreground capitalize text-sm md:text-base">
                    {product.category}
                  </span>
                </div>
                <div className="w-full h-px bg-muted/30"></div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-sm md:text-base">
                    Subcategory:
                  </span>
                  <span className="text-muted-foreground capitalize text-sm md:text-base">
                    {product.subcategory}
                  </span>
                </div>
                <div className="w-full h-px bg-muted/30"></div>
                <div className="flex justify-between items-start py-1">
                  <span className="font-medium text-sm md:text-base flex-shrink-0">
                    Available Units:
                  </span>
                  <span className="text-muted-foreground text-right text-sm md:text-base max-w-[60%] break-words">
                    {product.units
                      ?.map((unit) => `${unit.number} ${unit.type}`)
                      .join(', ')}
                  </span>
                </div>
                <div className="w-full h-px bg-muted/30"></div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-sm md:text-base">
                    Status:
                  </span>
                  <span className="text-muted-foreground capitalize text-sm md:text-base">
                    {product.status?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 md:mt-12">
          <div className="border-t pt-6 md:pt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="md:w-6 md:h-6" />
              Customer Reviews ({product.reviewCount || 0})
            </h2>

            {/* Review Submission Form */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-muted/50">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Write a Review
              </h3>
              <div className="space-y-3 md:space-y-4">
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[80px] md:min-h-[100px] text-sm md:text-base resize-none"
                />
                <Button
                  onClick={handleReviewSubmit}
                  disabled={!reviewText.trim() || submittingReview}
                  className="w-full sm:w-auto text-sm md:text-base"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted/50 rounded-lg p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-muted rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 md:space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gradient-to-br from-white to-muted/20 rounded-xl p-4 md:p-6 border border-muted/30 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm md:text-base text-foreground truncate">
                            {review.user?.name || 'Anonymous'}
                          </p>
                          <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
                          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-muted/50 to-transparent mb-3"></div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={24} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-base md:text-lg font-medium">
                  No reviews yet
                </p>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* More Products for You */}
        <div className="mt-8 md:mt-12">
          <RelatedProducts
            category={product.category}
            subcategory={product.subcategory}
            currentProductId={product.id}
          />
        </div>
      </div>

      {/* Review Restriction Dialog */}
      <ReviewRestrictionDialog
        isOpen={showReviewRestriction}
        onClose={() => setShowReviewRestriction(false)}
        onGoToCart={handleGoToCart}
      />

      {/* Share Product Dialog */}
      <ShareProductDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        product={product}
      />
    </div>
  )
}
