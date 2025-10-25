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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch search results
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setSearchResults([])
      return
    }

    const fetchSearchResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&limit=50`
        )

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const results = await response.json()
        setSearchResults(results)
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

  if (!query || query.trim().length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Search Products</h1>
          <p className="text-muted-foreground mb-6">
            Enter a search term to find products
          </p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
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

          {/* Load More Button (if needed) */}
          {searchResults.length >= 50 && (
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Showing first 50 results. Try refining your search for more
                specific results.
              </p>
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
