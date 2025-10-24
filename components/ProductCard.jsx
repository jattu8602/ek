'use client' // Mark this as a Client Component to use hooks

import { useState, useEffect } from 'react'
import Image from 'next/image' // For optimized images
import Link from 'next/link' // For optimized navigation
import { Button } from '@/components/ui/button'
import { Heart, Share2, Star, Minus, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Product } from '@/data/products'


const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState(product.units[0])
  const [isLiked, setIsLiked] = useState(false)

  // Auto-slide carousel effect remains the same
  useEffect(() => {
    if (product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [product.images.length])

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden product-card-hover border border-border">
      {/* Image Container: Replaced 'to' with 'href' */}
      <Link
        href={`/product/${product.urlSlug}`}
        className="block relative aspect-square overflow-hidden bg-muted group"
      >
        {/* Replaced <img> with next/image <Image> for performance */}
        <Image
          src={product.images[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
            -{product.discountPercent}%
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault() // Prevents link navigation
            setIsLiked(!isLiked)
          }}
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
        >
          <Heart
            size={16}
            className={
              isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'
            }
          />
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.preventDefault() // Prevents link navigation
          }}
          className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
        >
          <Share2 size={16} className="text-muted-foreground" />
        </button>

        {/* Image indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImageIndex ? 'bg-primary' : 'bg-background/50'
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-4 space-y-3">
        {/* Replaced 'to' with 'href' */}
        <Link href={`/product/${product.urlSlug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star size={14} className="fill-accent text-accent" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount} Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            ₹{product.discountedPrice}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{product.actualPrice}
          </span>
        </div>

        {/* Unit Selector */}
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

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-2 bg-muted rounded-md p-1">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="p-1 hover:bg-background rounded transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-1 hover:bg-background rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="w-full">
            Add to Cart
          </Button>
          <Button size="sm" className="w-full">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
