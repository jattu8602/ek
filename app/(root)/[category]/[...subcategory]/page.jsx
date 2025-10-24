'use client'

import Link from 'next/link'
import { products, categories } from '@/data/products'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'

// Define the shape of the 'params' prop provided by Next.js

// This is now a Client Component
export default function CategoryPage({ params }) {
  const { t } = useLanguage()
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then((resolvedParams) => {
      setCategory(resolvedParams.category)
      setSubcategory(resolvedParams.subcategory?.[0] || '')
      setIsLoading(false)
    })
  }, [params])

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
    subcategory,
    categoryObj,
    categoryName,
    allCategories: categories.map((c) => ({ slug: c.slug, name: c.name })),
  })

  // This filtering logic runs on the server. We compare against the canonical
  // category name so products that use slightly different casing/spacing still match.
  const filteredProducts = products.filter((product) => {
    if (subcategory) {
      // Try to resolve the incoming subcategory slug to one of the
      // canonical subcategory names for this category (if available).
      const incoming = decodeURIComponent(subcategory).toLowerCase()

      // If we have a category object with subcategories, try to find a match
      // by comparing both raw lowercased values and slugified values.
      const matchedSub = categoryObj?.subcategories.find((s) => {
        const raw = s.toLowerCase()
        const sSlug = slugify(s)
        return (
          raw === incoming || sSlug === incoming || sSlug === slugify(incoming)
        )
      })

      const canonicalSub = matchedSub ?? decodeURIComponent(subcategory)

      // Compare product subcategory with the canonical subcategory (case-insensitive)
      // Also try direct comparison with the incoming subcategory
      const productSubLower = product.subcategory.toLowerCase()
      const canonicalSubLower = canonicalSub.toLowerCase()
      const incomingLower = incoming

      return (
        productSubLower === canonicalSubLower ||
        productSubLower === incomingLower
      )
    }

    return product.category.toLowerCase() === categoryName.toLowerCase()
  })

  const brands = [
    ...new Set(
      filteredProducts.map((p) => p.name.split(' ')[0]).filter(Boolean)
    ),
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
          {/* Add a link to the main category page */}
          {subcategory ? (
            <Link
              href={`/${category}`}
              className="capitalize hover:text-primary"
            >
              {categoryName}
            </Link>
          ) : (
            <span className="capitalize text-foreground">{categoryName}</span>
          )}
          {subcategory && (
            <>
              <ChevronRight size={16} />
              <span className="capitalize text-foreground">
                {decodeURIComponent(subcategory)}
              </span>
            </>
          )}
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
                {subcategory ? decodeURIComponent(subcategory) : categoryName}
                <span className="text-muted-foreground text-base ml-2">
                  ({filteredProducts.length} {t('category.products.count')})
                </span>
              </h2>
              <Button variant="outline" size="sm">
                {t('category.sortBy')} {t('category.sort.featured')}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
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
