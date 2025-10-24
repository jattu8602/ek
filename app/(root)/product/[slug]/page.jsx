'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation' // Replaces manual not found component
import Link from 'next/link'
import Image from 'next/image' // For optimized images
import { products, categories } from '@/data/products'
import { ChevronRight, Star, Minus, Plus, Heart, Share2 } from 'lucide-react'
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
import { useLanguage } from '@/contexts/LanguageContext'

// Next.js passes 'params' as a prop
export default function ProductDetail(params) {

  const { t } = useLanguage()
  const [slug, setSlug] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [isLiked, setIsLiked] = useState(false)

  // Handle async params in useEffect
  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug)
    })
  }, [params])

  // Find product based on slug
  const product = products.find((p) => p.urlSlug === slug)

  // Update selectedUnit when product is found
  useEffect(() => {
    if (product && !selectedUnit) {
      setSelectedUnit(product.units[0])
    }
  }, [product, selectedUnit])

  // Show loading state while slug is being resolved
  if (!slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Debug logging
  console.log('ProductDetail - slug:', slug)
  console.log(
    'Available products:',
    products.map((p) => p.urlSlug)
  )
  console.log('Products array length:', products.length)

  console.log('Found product:', product)

  // Use Next.js's built-in notFound function
  if (!product) {
    console.log('Product not found, calling notFound()')
    notFound()
  }

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            {t('breadcrumb.home')}
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/${
              // Find the slug for the product category. Fall back to a simple
              // lowercased version if not found.
              categories.find(
                (c) => c.name.toLowerCase() === product.category.toLowerCase()
              )?.slug || product.category.toLowerCase()
            }`}
            className="hover:text-primary capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/${
              categories.find(
                (c) => c.name.toLowerCase() === product.category.toLowerCase()
              )?.slug || product.category.toLowerCase()
            }/${product.subcategory.toLowerCase()}`}
            className="hover:text-primary capitalize"
          >
            {product.subcategory}
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              {/* Optimized Image Component */}
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-colors"
              >
                <Heart
                  size={20}
                  className={
                    isLiked
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }
                />
              </button>

              <button className="absolute top-16 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-colors">
                <Share2 size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square bg-muted rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }
                    />
                  ))}
                  <span className="ml-2 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviewCount} Reviews)
                </span>
              </div>
            </div>

            <div className="border-y border-border py-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.discountedPrice}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.actualPrice}
                </span>
                <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm font-bold">
                  {product.discountPercent}
                  {t('product.off')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('product.inclusiveTaxes')}
              </p>
            </div>

            <div>
              <Label className="mb-2 block font-medium">
                {t('product.selectUnit')}
              </Label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {product.units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block font-medium">
                {t('product.quantity')}
              </Label>
              <div className="flex items-center gap-2 bg-muted rounded-md p-1 w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-background rounded transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="min-w-12 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-background rounded transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1">
                {t('product.addToCart')}
              </Button>
              <Button size="lg" className="flex-1">
                {t('product.buyNow')}
              </Button>
            </div>

            <div className="bg-secondary p-4 rounded-lg space-y-2 text-sm">
              <p>✓ {t('product.freeDelivery')}</p>
              <p>✓ {t('product.returns')}</p>
              <p>✓ {t('product.expertAdvice')}</p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              {t('product.description')}
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              {t('product.specifications')}
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              {t('product.reviews')} ({product.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{t('product.category')}</p>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
              <div>
                <p className="font-medium">{t('product.subcategory')}</p>
                <p className="text-muted-foreground">{product.subcategory}</p>
              </div>
              <div>
                <p className="font-medium">{t('product.availableUnits')}</p>
                <p className="text-muted-foreground">
                  {product.units.join(', ')}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('product.reviews')} feature coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
