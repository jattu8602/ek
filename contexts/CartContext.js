'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from './AuthContext'
import { useToast } from '@/hooks/use-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { data: session } = useSession()
  const { user, requireAuth } = useAuth()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch cart items from API
  const fetchCartItems = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch favorites from API
  const fetchFavorites = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCartItems()
      fetchFavorites()
    } else {
      setCartItems([])
      setFavorites([])
    }
  }, [user])

  // Add item to cart
  const addToCart = async (
    productId,
    quantity = 1,
    unitId = null,
    selectedUnit = null
  ) => {
    requireAuth(() => {
      const addItem = async () => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity, unitId, selectedUnit }),
          })

          if (response.ok) {
            fetchCartItems() // Refresh cart
            toast({
              title: 'Added to cart',
              description: 'Item has been added to your cart successfully.',
            })
          } else {
            throw new Error('Failed to add item to cart')
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          toast({
            title: 'Error',
            description: 'Failed to add item to cart. Please try again.',
            variant: 'destructive',
          })
        }
      }
      addItem()
    })
  }

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user) return

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchCartItems() // Refresh cart
        toast({
          title: 'Removed from cart',
          description: 'Item has been removed from your cart.',
        })
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Update cart item quantity
  const updateCartQuantity = async (
    productId,
    quantity,
    unitId = null,
    selectedUnit = null
  ) => {
    if (!user) return

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, unitId, selectedUnit }),
      })

      if (response.ok) {
        fetchCartItems() // Refresh cart
        toast({
          title: 'Cart updated',
          description: 'Item quantity has been updated.',
        })
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      toast({
        title: 'Error',
        description: 'Failed to update cart. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Add to favorites
  const addToFavorites = async (productId) => {
    requireAuth(() => {
      const addFavorite = async () => {
        try {
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
          })

          if (response.ok) {
            fetchFavorites() // Refresh favorites
          }
        } catch (error) {
          console.error('Error adding to favorites:', error)
        }
      }
      addFavorite()
    })
  }

  // Remove from favorites
  const removeFromFavorites = async (productId) => {
    if (!user) return

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchFavorites() // Refresh favorites
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId)
  }

  // Check if item is in favorites
  const isInFavorites = (productId) => {
    return favorites.some((fav) => fav.productId === productId)
  }

  // Get cart item quantity
  const getCartQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId)
    return item ? item.quantity : 0
  }

  // Get total cart items count
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Get total cart value
  const getCartTotal = () => {
    // This would need product prices from your products data
    // For now, return cart items count
    return cartItems.length
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        favorites,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToFavorites,
        removeFromFavorites,
        isInCart,
        isInFavorites,
        getCartQuantity,
        getCartItemsCount,
        getCartTotal,
        fetchCartItems,
        fetchFavorites,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
