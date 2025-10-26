'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [searchResults, setSearchResults] = useState([])
  const [defaultProducts, setDefaultProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDefault, setIsLoadingDefault] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch default products when no query
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setSearchResults([])
      setCurrentPage(1)
      setHasMore(true)

      // Fetch default products from all categories
      const fetchDefaultProducts = async () => {
        setIsLoadingDefault(true)
        setError(null)

        try {
          const response = await fetch('/api/products?limit=20&page=1')

          if (!response.ok) {
            throw new Error('Failed to fetch products')
          }

          const data = await response.json()
          // Handle both array format and object format
          const results = Array.isArray(data) ? data : data.products || []
          setDefaultProducts(results)
          setHasMore(results.length === 20) // If we got less than 20, no more pages
        } catch (error) {
          console.error('Default products error:', error)
          setError('Failed to load products. Please try again.')
          setDefaultProducts([])
        } finally {
          setIsLoadingDefault(false)
        }
      }

      fetchDefaultProducts()
      return
    }

    // Fetch search results when query exists
    const fetchSearchResults = async () => {
      setIsLoading(true)
      setError(null)
      setCurrentPage(1)
      setHasMore(true)

      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&limit=20&page=1`
        )

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const results = await response.json()
        setSearchResults(results)
        setHasMore(results.length === 20) // If we got less than 20, no more pages
      } catch (error) {
        console.error('Search error:', error)
        setError('Failed to search products. Please try again.')
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  // Load more products function
  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    const nextPage = currentPage + 1

    try {
      let response
      if (!query || query.trim().length === 0) {
        // Load more default products
        response = await fetch(`/api/products?limit=20&page=${nextPage}`)
      } else {
        // Load more search results
        response = await fetch(
          `/api/products/search?q=${encodeURIComponent(
            query
          )}&limit=20&page=${nextPage}`
        )
      }

      if (!response.ok) {
        throw new Error('Failed to load more products')
      }

      const data = await response.json()
      const newProducts = Array.isArray(data) ? data : data.products || []

      if (!query || query.trim().length === 0) {
        setDefaultProducts((prev) => [...prev, ...newProducts])
      } else {
        setSearchResults((prev) => [...prev, ...newProducts])
      }

      setCurrentPage(nextPage)
      setHasMore(newProducts.length === 20) // If we got less than 20, no more pages
    } catch (error) {
      console.error('Error loading more products:', error)
      setError('Failed to load more products. Please try again.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProducts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage, hasMore, isLoadingMore, query])

  if (!query || query.trim().length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Browse our complete range of agricultural products
          </p>
        </div>

        {/* Loading State */}
        {isLoadingDefault && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Default Products Grid */}
        {!isLoadingDefault && !error && defaultProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {defaultProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMoreProducts}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </Button>
              </div>
            )}

            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="text-center mt-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">
                    Loading more products...
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* No Products */}
        {!isLoadingDefault && !error && defaultProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              No products available
            </h2>
            <p className="text-muted-foreground mb-6">
              We're working on adding more products. Please check back later.
            </p>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>Search Results for "{query}"</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-muted-foreground">
          {isLoading
            ? 'Searching...'
            : `${searchResults.length} products found`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Searching products...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && searchResults.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products matching "{query}". Try different
            keywords.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Suggestions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">seeds</Badge>
              <Badge variant="outline">fertilizers</Badge>
              <Badge variant="outline">pesticides</Badge>
              <Badge variant="outline">tools</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && !error && searchResults.length > 0 && (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button
                onClick={loadMoreProducts}
                disabled={isLoadingMore}
                variant="outline"
                className="min-w-[200px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Results'
                )}
              </Button>
            </div>
          )}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="text-center mt-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">
                  Loading more results...
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}
