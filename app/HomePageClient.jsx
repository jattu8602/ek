'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { categories } from '@/data/products'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Truck, Shield, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
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

  return (
    <div className="min-h-screen bg-background">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <p>
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
          className="object-cover"
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

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProducts.map((product) => (
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
              New
            </Badge>
          </div>

          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <div className="relative">
                    {index < 3 && (
                      <Badge className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground">
                        New
                      </Badge>
                    )}
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
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
