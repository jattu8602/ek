'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart, addToFavorites, removeFromFavorites, isInFavorites } =
    useCart()
  const { requireAuth } = useAuth()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product.id, 1)
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
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 product-card-hover">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[currentImageIndex]}
          alt={product.name}
          fill
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
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                {discountPercent}% {t('product.off')}
              </Badge>
            ) : null
          })()}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleToggleFavorite}
        >
          <Heart
            className={`h-4 w-4 ${
              isInFavorites(product.id)
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }`}
          />
        </Button>

        {/* Quick Add to Cart Button */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('product.addToCart')}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.units && product.units.length > 0 ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                ₹{product.units[0].discountedPrice}
              </span>
              {(() => {
                const unit = product.units[0]
                const discountPercent = Math.round(
                  ((unit.actualPrice - unit.discountedPrice) /
                    unit.actualPrice) *
                    100
                )
                return discountPercent > 0 ? (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{unit.actualPrice}
                  </span>
                ) : null
              })()}
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              Price not available
            </span>
          )}
        </div>

        {/* Category */}
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium">{t('product.category')}:</span>{' '}
          {product.category}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('product.addToCart')}
          </Button>
          <Link href={`/product/${product.id}`}>
            <Button size="sm" className="flex-1">
              {t('product.buyNow')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
