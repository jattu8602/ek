'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { categories } from '@/data/products'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Truck, Shield, Clock, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSelector } from 'react-redux'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const categoryImages = {
  'category-seeds.jpg': '/category-seeds.jpg',
  'category-fertilizers.jpg': '/category-fertilizers.jpg',
  'category-chemicals.jpg': '/category-chemicals.jpg',
  'category-tools.jpg': '/category-tools.jpg',
}

export default function HomePageClient({ featuredProducts }) {
  const { t } = useLanguage()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)
  const [allProducts, setAllProducts] = useState(featuredProducts || [])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Log auth status from Redux
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Home page - User authenticated (Redux):', {
        email: user?.email,
        role: user?.role,
        id: user?.id,
      })
    } else if (!loading && !isAuthenticated) {
      console.log('Home page - No active session (Redux)')
    }
  }, [user, isAuthenticated, loading])

  // Load more products for carousels
  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMoreProducts) return

    setIsLoadingMore(true)
    const nextPage = currentPage + 1

    try {
      const response = await fetch(`/api/products?limit=20&page=${nextPage}`)
      if (!response.ok) throw new Error('Failed to load products')

      const data = await response.json()
      const newProducts = Array.isArray(data) ? data : data.products || []

      setAllProducts((prev) => [...prev, ...newProducts])
      setCurrentPage(nextPage)
      setHasMoreProducts(newProducts.length === 20)
    } catch (error) {
      console.error('Error loading more products:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-[10px] sm:text-xs md:text-sm">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          🌱 Free shipping on orders over ₹500 | Expert farming support
          available
        </p>
      </div>
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] md:h-[500px] overflow-hidden">
        <Image
          src="/hero-banner.jpg"
          alt="Agricultural Products"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-right md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90">
                {t('home.hero.subtitle')}
              </p>
              <Link href="/search">
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t('home.hero.cta')} <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8">
          <div className="flex flex-wrap gap-2 md:gap-4 text-white/80 text-xs md:text-sm">
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Truck className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Free Shipping</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Shield className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Secure Payment</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">
              Featured Products
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Discover our handpicked selection of quality products
            </p>
          </div>
          <Link href="/search">
            <Button
              variant="link"
              className="hidden md:flex items-center text-sm"
            >
              View All <ArrowRight className="ml-1" size={16} />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              dragFree: true,
              containScroll: 'trimSnaps',
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {allProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>

          {/* Mobile swipe indicator */}
          <div className="md:hidden flex justify-center mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full"></div>
              </div>
              <span>Swipe to see more</span>
            </div>
          </div>
        </div>

        {/* See All Products Button - Featured */}
        <div className="text-center mt-8 md:hidden">
          <Link href="/search">
            <Button
              variant="outline"
              size="lg"
              className="group bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <span className="text-primary font-medium">See all Products</span>
              <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                New Arrivals
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Fresh products just added to our collection
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              <Star className="h-3 w-3 mr-1" />
              Fresh
            </Badge>
          </div>

          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
                dragFree: true,
                containScroll: 'trimSnaps',
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {allProducts.slice(0, 8).map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>

            {/* Mobile swipe indicator */}
            <div className="md:hidden flex justify-center mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full"></div>
                </div>
                <span>Swipe to see more</span>
              </div>
            </div>
          </div>

          {/* See All Products Button - New Arrivals */}
          {/* <div className="text-center mt-8">
            <Link href="/search">
              <Button
                variant="outline"
                size="lg"
                className="group bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 hover:from-accent/20 hover:to-accent/10 hover:border-accent/40 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              >
                <span className="text-accent font-medium">
                  See all Products
                </span>
                <ArrowRight className="ml-2 h-4 w-4 text-accent group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link href="/search?q=seeds" className="group">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 md:p-6 text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2">
                Free Shipping
              </h3>
              <p className="text-xs md:text-sm lg:text-base opacity-90 mb-3 md:mb-4">
                On orders over ₹500
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs md:text-sm"
              >
                Shop Now
              </Button>
            </div>
          </Link>
          <Link href="/search?q=fertilizers" className="group">
            <div className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-4 md:p-6 text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2">
                Seasonal Sale
              </h3>
              <p className="text-xs md:text-sm lg:text-base opacity-90 mb-3 md:mb-4">
                Up to 30% off on fertilizers
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs md:text-sm"
              >
                View Deals
              </Button>
            </div>
          </Link>
          <Link href="/contact" className="group">
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4 md:p-6 text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2">
                Expert Support
              </h3>
              <p className="text-xs md:text-sm lg:text-base opacity-90 mb-3 md:mb-4">
                Get farming advice from experts
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs md:text-sm"
              >
                Learn More
              </Button>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="bg-secondary py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">
              {t('home.categories.title')}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {t('home.categories.subtitle')}
            </p>
          </div>

          {/* Mobile and Desktop: Grid layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group bg-card rounded-lg overflow-hidden shadow-md hover-lift border border-border"
              >
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={categoryImages[category.image]}
                    alt={category.name}
                    fill
                    loading="lazy"
                    quality={80}
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3 md:p-4 text-center">
                  <h3 className="font-semibold text-sm md:text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
