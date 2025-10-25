'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import {
  getFormattedRecentProducts,
  addRecentProduct,
} from '@/lib/recentProducts'

/**
 * Custom hook for search functionality with debouncing
 */
export function useSearch(externalQuery = null) {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)
  const debounceTimeoutRef = useRef(null)

  // Debounced search function
  const debouncedSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=8`,
        {
          signal: abortControllerRef.current.signal,
        }
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error)
        setError('Search failed. Please try again.')
        setSearchResults([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load recent products
  const loadRecentProducts = useCallback(async () => {
    if (!session) {
      // For non-logged-in users, use localStorage
      const localRecent = getFormattedRecentProducts()
      setRecentProducts(localRecent)
      return
    }

    try {
      const response = await fetch('/api/user/recent-products')
      if (response.ok) {
        const results = await response.json()
        setRecentProducts(results)
      } else {
        // Fallback to localStorage if API fails
        const localRecent = getFormattedRecentProducts()
        setRecentProducts(localRecent)
      }
    } catch (error) {
      console.error('Error loading recent products:', error)
      // Fallback to localStorage
      const localRecent = getFormattedRecentProducts()
      setRecentProducts(localRecent)
    }
  }, [session])

  // Use external query if provided
  const searchQuery = externalQuery !== null ? externalQuery : query

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      debouncedSearch(searchQuery)
    }, 300) // 300ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearch])

  // Load recent products on mount
  useEffect(() => {
    loadRecentProducts()
  }, [loadRecentProducts])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Track product view
  const trackProductView = useCallback(
    async (product) => {
      // Add to localStorage immediately
      addRecentProduct({
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        unit: product.unit,
      })

      // If logged in, also sync with database
      if (session) {
        try {
          await fetch('/api/user/recent-products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.id }),
          })
        } catch (error) {
          console.error('Error tracking product view:', error)
        }
      }

      // Reload recent products to update the list
      loadRecentProducts()
    },
    [session, loadRecentProducts]
  )

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('')
    setSearchResults([])
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    searchResults,
    recentProducts,
    isLoading,
    error,
    trackProductView,
    clearSearch,
    loadRecentProducts,
  }
}
