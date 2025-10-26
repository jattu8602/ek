'use client'

import Link from 'next/link'
import { categories } from '@/data/products'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'
import {
  createFlexibleQuery,
  debugCategoryMatching,
} from '@/lib/categoryHelpers'

// Define the shape of the 'params' prop provided by Next.js

// This is now a Client Component
export default function CategoryPage({ params }) {
  const { t } = useLanguage()
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCategory(params.category)
    setIsLoading(false)
  }, [params])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return

      try {
        setLoading(true)

        // Debug category matching
        debugCategoryMatching(category)

        // Create flexible query with multiple category formats
        const queryString = createFlexibleQuery(category)

        const response = await fetch(`/api/products?${queryString}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // helper to create a simple slug for matching (spaces -> '-', lowercase)
  const slugify = (s) =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  // Find the canonical category name from the categories list using the slug
  const categoryObj = categories.find(
    (c) => c.slug === decodeURIComponent(category)
  )
  const categoryName = categoryObj
    ? categoryObj.name
    : decodeURIComponent(category)

  // Debug logging
  console.log('CategoryPage Debug:', {
    category,
    categoryObj,
    categoryName,
    allCategories: categories.map((c) => ({ slug: c.slug, name: c.name })),
  })

  const brands = [
    ...new Set(products.map((p) => p.name.split(' ')[0]).filter(Boolean)),
  ]

  return (
    <>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* Use next/link with href prop */}
          <Link href="/" className="hover:text-primary">
            {t('breadcrumb.home')}
          </Link>
          <ChevronRight size={16} />
          <span className="capitalize text-foreground">{categoryName}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Pass the server-computed 'brands' list to the
            Client Component as a prop.
          */}
          <aside className="md:col-span-1">
            <FilterSidebar brands={brands} />
          </aside>

          {/* Products Grid */}
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold capitalize">
                {categoryName}
                <span className="text-muted-foreground text-base ml-2">
                  ({products.length} {t('category.products.count')})
                </span>
              </h2>
              <Button variant="outline" size="sm">
                {t('category.sortBy')} {t('category.sort.featured')}
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted rounded-lg aspect-square animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t('category.noProducts')}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
