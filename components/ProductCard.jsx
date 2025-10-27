'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedUnit, setSelectedUnit] = useState('')
  const { addToCart, addToFavorites, removeFromFavorites, isInFavorites, isAddingToCart } =
    useCart()
  const { requireAuth } = useAuth()
  const { t } = useLanguage()

  // Set default unit when component mounts
  useEffect(() => {
    if (product.units && product.units.length > 0) {
      const defaultUnit = `${product.units[0].number} ${product.units[0].type}`
      setSelectedUnit(defaultUnit)
    }
  }, [product.units])

  // Auto-slider for multiple images
  useEffect(() => {
    if (product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [product.images])

  // Note: fetchFavorites is called at the app level, not per ProductCard
  // This prevents multiple API calls when multiple ProductCards are rendered

  const handleAddToCart = () => {
    requireAuth(() => {
      // Find the selected unit
      const unit = product.units?.find(
        (u) => `${u.number} ${u.type}` === selectedUnit
      )
      if (unit) {
        addToCart(product.id, 1, unit.id, selectedUnit)
      } else {
        // Fallback to first unit if no unit selected
        if (product.units && product.units.length > 0) {
          const firstUnit = product.units[0]
          addToCart(
            product.id,
            1,
            firstUnit.id,
            `${firstUnit.number} ${firstUnit.type}`
          )
        } else {
          addToCart(product.id, 1)
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

  const handleImageClick = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 touch-manipulation cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden">
          <Image
            src={
              product.images?.[currentImageIndex] ||
              product.image ||
              '/placeholder-product.jpg'
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            quality={80}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={handleImageClick}
          />

          {/* Discount Badge */}
          {product.units &&
            product.units.length > 0 &&
            (() => {
              const unit = product.units[0]
              const discountPercent = Math.round(
                ((unit.actualPrice - unit.discountedPrice) / unit.actualPrice) *
                  100
              )
              return discountPercent > 0 ? (
                <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                  {discountPercent}% {t('product.off')}
                </Badge>
              ) : null
            })()}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1.5 h-8 w-8 sm:h-8 sm:w-8 md:h-9 md:w-9 touch-manipulation"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleFavorite()
            }}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${
                isInFavorites(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }`}
            />
          </Button>

          {/* Image indicators for multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 lg:p-2 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-1.5 lg:mb-1 line-clamp-2 hover:text-primary transition-colors text-sm lg:text-xs leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 lg:mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 lg:h-2.5 lg:w-2.5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs lg:text-[10px] text-gray-600 ml-1">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2 lg:mb-1">
            {product.units && product.units.length > 0 ? (
              (() => {
                // Find the selected unit or default to first unit
                const unit =
                  product.units.find(
                    (u) => `${u.number} ${u.type}` === selectedUnit
                  ) || product.units[0]
                const discountPercent = Math.round(
                  ((unit.actualPrice - unit.discountedPrice) /
                    unit.actualPrice) *
                    100
                )
                return (
                  <>
                    <span className="text-base lg:text-sm font-bold text-gray-900">
                      ₹{unit.discountedPrice}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs lg:text-[10px] text-gray-500 line-through">
                        ₹{unit.actualPrice}
                      </span>
                    )}
                  </>
                )
              })()
            ) : (
              <span className="text-base lg:text-sm font-bold text-gray-900">
                Price not available
              </span>
            )}
          </div>

          {/* Category */}
          <div className="text-xs lg:text-[10px] text-gray-600 mb-2 lg:mb-1">
            <span className="font-medium">{t('product.category')}:</span>{' '}
            {product.category}
          </div>

          {/* Unit Selection */}
          {product.units && product.units.length > 1 && (
            <div className="mb-2 lg:mb-1">
              <Select
                value={selectedUnit}
                onValueChange={setSelectedUnit}
                onOpenChange={(e) => {
                  e?.preventDefault?.()
                  e?.stopPropagation?.()
                }}
              >
                <SelectTrigger
                  className="w-full h-8 text-xs sm:h-8 md:h-9 lg:h-7 sm:text-xs md:text-sm lg:text-[10px] touch-manipulation"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
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

          {/* Action Buttons */}
          <div className="flex gap-1.5 lg:gap-1 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs sm:h-8 md:h-9 lg:h-7 sm:text-xs md:text-sm lg:text-[10px]"
              disabled={isAddingToCart}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart()
              }}
            >
              <ShoppingCart className="h-3 w-3 mr-1 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-2.5 lg:w-2.5" />
              <span className="hidden sm:inline lg:hidden">
                {isAddingToCart ? 'Adding...' : t('product.addToCart')}
              </span>
              <span className="sm:hidden lg:inline">
                {isAddingToCart ? 'Adding...' : 'Add'}
              </span>
            </Button>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs sm:h-8 md:h-9 lg:h-7 sm:text-xs md:text-sm lg:text-[10px]"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/product/${product.id}`
              }}
            >
              <span className="hidden sm:inline lg:hidden">
                {t('product.buyNow')}
              </span>
              <span className="sm:hidden lg:inline">Buy</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
