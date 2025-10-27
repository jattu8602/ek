'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, Loader2, X } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useSearch } from '@/hooks/use-search'

export default function SearchCommandPalette({
  open,
  onOpenChange,
  isDropdown = false,
  searchQuery: externalQuery = '',
  setSearchQuery: setExternalQuery = null,
}) {
  const router = useRouter()
  const {
    query,
    setQuery,
    searchResults,
    recentProducts,
    isLoading,
    error,
    trackProductView,
    clearSearch,
  } = useSearch(isDropdown ? externalQuery : null)

  // Use external query if provided (for dropdown mode)
  const currentQuery =
    isDropdown && externalQuery !== undefined ? externalQuery : query
  const currentSetQuery =
    isDropdown && setExternalQuery ? setExternalQuery : setQuery

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Calculate total items for keyboard navigation
  useEffect(() => {
    const searchCount = searchResults.length
    const recentCount = recentProducts.length
    const total = searchCount + (recentCount > 0 ? recentCount + 1 : 0) // +1 for separator
    setTotalItems(total)
  }, [searchResults, recentProducts])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults, recentProducts])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % totalItems)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleItemSelect()
    } else if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  // Handle item selection
  const handleItemSelect = () => {
    if (searchResults.length > 0 && selectedIndex < searchResults.length) {
      // Navigate to selected search result
      const selectedProduct = searchResults[selectedIndex]
      trackProductView(selectedProduct)
      router.push(selectedProduct.url)
      onOpenChange(false)
    } else if (currentQuery.trim().length > 0) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(currentQuery)}`)
      onOpenChange(false)
    }
  }

  // Handle product click
  const handleProductClick = (product) => {
    trackProductView(product)
    router.push(product.url)
    onOpenChange(false)
  }

  // Handle search results page navigation
  const handleSearchAll = () => {
    if (currentQuery.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(currentQuery)}`)
      onOpenChange(false)
    }
  }

  if (isDropdown) {
    return (
      <div className="w-full bg-background border border-border rounded-lg shadow-lg">
        <Command className="rounded-lg">
          <CommandList className="max-h-80">
            {error && (
              <div className="p-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((product, index) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => handleProductClick(product)}
                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 cursor-pointer ${
                      index === selectedIndex ? 'bg-[#EFF2F5]' : ''
                    }`}
                  >
                    <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm md:text-base truncate">
                        {product.name}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground truncate">
                        {product.category} • {product.subcategory}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-primary text-sm md:text-base">
                          ₹{product.price}
                        </span>
                        {product.unit && (
                          <Badge variant="secondary" className="text-xs">
                            {product.unit}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}

                {currentQuery.trim().length > 0 && (
                  <CommandItem
                    onSelect={handleSearchAll}
                    className={`flex items-center gap-2 p-2 md:p-3 cursor-pointer ${
                      selectedIndex === searchResults.length
                        ? 'bg-[#EFF2F5]'
                        : ''
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search all results for "{currentQuery}"</span>
                  </CommandItem>
                )}
              </CommandGroup>
            )}

            {/* Recent Products */}
            {recentProducts.length > 0 && currentQuery.length === 0 && (
              <>
                {searchResults.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Recent Products">
                  {recentProducts.map((product, index) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={() => handleProductClick(product)}
                      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 cursor-pointer ${
                        index +
                          (searchResults.length > 0
                            ? searchResults.length + 1
                            : 0) ===
                        selectedIndex
                          ? 'bg-[#EFF2F5]'
                          : ''
                      }`}
                    >
                      <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base truncate">
                          {product.name}
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground truncate">
                          {product.category} • {product.subcategory}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-primary text-sm md:text-base">
                            ₹{product.price}
                          </span>
                          {product.unit && (
                            <Badge variant="secondary" className="text-xs">
                              {product.unit}
                            </Badge>
                          )}
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Empty States */}
            {!isLoading &&
              searchResults.length === 0 &&
              currentQuery.length > 0 && (
                <CommandEmpty>
                  <div className="text-center py-6">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No products found for "{currentQuery}"
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSearchAll}
                      className="mt-2"
                    >
                      Search all results
                    </Button>
                  </div>
                </CommandEmpty>
              )}

            {!isLoading &&
              searchResults.length === 0 &&
              currentQuery.length === 0 &&
              recentProducts.length === 0 && (
                <CommandEmpty>
                  <div className="text-center py-6">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Start typing to search for products
                    </p>
                  </div>
                </CommandEmpty>
              )}
          </CommandList>
        </Command>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" onKeyDown={handleKeyDown}>
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Search Products
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search for seeds, pesticides, fertilizers..."
              value={currentQuery}
              onValueChange={setQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </div>

          <CommandList className="max-h-96">
            {error && (
              <div className="p-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((product, index) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => handleProductClick(product)}
                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 cursor-pointer ${
                      index === selectedIndex ? 'bg-[#EFF2F5]' : ''
                    }`}
                  >
                    <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm md:text-base truncate">
                        {product.name}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground truncate">
                        {product.category} • {product.subcategory}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-primary text-sm md:text-base">
                          ₹{product.price}
                        </span>
                        {product.unit && (
                          <Badge variant="secondary" className="text-xs">
                            {product.unit}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}

                {currentQuery.trim().length > 0 && (
                  <CommandItem
                    onSelect={handleSearchAll}
                    className={`flex items-center gap-2 p-3 cursor-pointer ${
                      selectedIndex === searchResults.length
                        ? 'bg-[#EFF2F5]'
                        : ''
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search all results for "{currentQuery}"</span>
                  </CommandItem>
                )}
              </CommandGroup>
            )}

            {/* Recent Products */}
            {recentProducts.length > 0 && currentQuery.length === 0 && (
              <>
                {searchResults.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Recent Products">
                  {recentProducts.map((product, index) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={() => handleProductClick(product)}
                      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 cursor-pointer ${
                        index +
                          (searchResults.length > 0
                            ? searchResults.length + 1
                            : 0) ===
                        selectedIndex
                          ? 'bg-[#EFF2F5]'
                          : ''
                      }`}
                    >
                      <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base truncate">
                          {product.name}
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground truncate">
                          {product.category} • {product.subcategory}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-primary text-sm md:text-base">
                            ₹{product.price}
                          </span>
                          {product.unit && (
                            <Badge variant="secondary" className="text-xs">
                              {product.unit}
                            </Badge>
                          )}
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Empty States */}
            {!isLoading &&
              searchResults.length === 0 &&
              currentQuery.length > 0 && (
                <CommandEmpty>
                  <div className="text-center py-6">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No products found for "{currentQuery}"
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSearchAll}
                      className="mt-2"
                    >
                      Search all results
                    </Button>
                  </div>
                </CommandEmpty>
              )}

            {!isLoading &&
              searchResults.length === 0 &&
              currentQuery.length === 0 &&
              recentProducts.length === 0 && (
                <CommandEmpty>
                  <div className="text-center py-6">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Start typing to search for products
                    </p>
                  </div>
                </CommandEmpty>
              )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
