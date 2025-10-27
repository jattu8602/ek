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
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isUpdatingCart, setIsUpdatingCart] = useState(false)
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false)
  const [error, setError] = useState(null)

  // Fetch cart items from API
  const fetchCartItems = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      } else {
        throw new Error('Failed to fetch cart items')
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
      setError('Failed to load cart items')
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
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem('guestCart')
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart))
        } catch (error) {
          console.error('Error parsing guest cart:', error)
          setCartItems([])
        }
      } else {
        setCartItems([])
      }
      setFavorites([])
    }
  }, [user])

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!user && cartItems.length >= 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  // Migrate guest cart to user cart when user logs in
  useEffect(() => {
    if (user && cartItems.length === 0) {
      const guestCart = localStorage.getItem('guestCart')
      if (guestCart) {
        try {
          const guestItems = JSON.parse(guestCart)
          if (guestItems.length > 0) {
            // Migrate guest cart items to user cart
            const migrateGuestCart = async () => {
              for (const item of guestItems) {
                try {
                  await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      productId: item.productId,
                      quantity: item.quantity,
                      unitId: item.unitId,
                      selectedUnit: item.selectedUnit,
                    }),
                  })
                } catch (error) {
                  console.error('Error migrating cart item:', error)
                }
              }
              // Clear guest cart after migration
              localStorage.removeItem('guestCart')
              // Refresh user cart
              await fetchCartItems()
            }
            migrateGuestCart()
          }
        } catch (error) {
          console.error('Error parsing guest cart for migration:', error)
        }
      }
    }
  }, [user])

  // Add item to cart
  const addToCart = async (
    productId,
    quantity = 1,
    unitId = null,
    selectedUnit = null
  ) => {
    if (!user) {
      // Handle guest user - add to local cart
      try {
        setIsAddingToCart(true)
        setError(null)
        
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(
          (item) => item.productId === productId && item.unitId === unitId
        )
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...cartItems]
          updatedItems[existingItemIndex].quantity += quantity
          setCartItems(updatedItems)
        } else {
          // Add new item
          const newItem = {
            id: `guest_${Date.now()}_${Math.random()}`,
            productId,
            quantity,
            unitId,
            selectedUnit,
            product: null, // Will be populated when needed
          }
          setCartItems([...cartItems, newItem])
        }
        
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart successfully.",
        })
      } catch (error) {
        console.error('Error adding to cart:', error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAddingToCart(false)
      }
      return
    }

    // Handle authenticated user
    requireAuth(() => {
      const addItem = async () => {
        try {
          setIsAddingToCart(true)
          setError(null)
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity, unitId, selectedUnit }),
          })

          if (response.ok) {
            await fetchCartItems() // Refresh cart
            toast({
              title: "Added to cart",
              description: "Item has been added to your cart successfully.",
            })
          } else {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to add item to cart')
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          setError(error.message)
          toast({
            title: "Error",
            description: error.message || "Failed to add item to cart. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsAddingToCart(false)
        }
      }
      addItem()
    })
  }

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user) {
      // Handle guest user - remove from local cart
      try {
        setIsRemovingFromCart(true)
        setError(null)
        
        const updatedItems = cartItems.filter(item => item.productId !== productId)
        setCartItems(updatedItems)
        
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart.",
        })
      } catch (error) {
        console.error('Error removing from cart:', error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to remove item from cart. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsRemovingFromCart(false)
      }
      return
    }

    // Handle authenticated user
    try {
      setIsRemovingFromCart(true)
      setError(null)
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        await fetchCartItems() // Refresh cart
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart.",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove item from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRemovingFromCart(false)
    }
  }

  // Update cart item quantity
  const updateCartQuantity = async (
    productId,
    quantity,
    unitId = null,
    selectedUnit = null
  ) => {
    if (!user) {
      // Handle guest user - update local cart
      try {
        setIsUpdatingCart(true)
        setError(null)
        
        const updatedItems = cartItems.map(item => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: quantity,
              unitId: unitId || item.unitId,
              selectedUnit: selectedUnit || item.selectedUnit
            }
          }
          return item
        }).filter(item => item.quantity > 0) // Remove items with 0 quantity
        
        setCartItems(updatedItems)
        
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated in your cart.",
        })
      } catch (error) {
        console.error('Error updating cart quantity:', error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to update cart. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUpdatingCart(false)
      }
      return
    }

    // Handle authenticated user
    try {
      setIsUpdatingCart(true)
      setError(null)
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, unitId, selectedUnit }),
      })

      if (response.ok) {
        await fetchCartItems() // Refresh cart
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated in your cart.",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingCart(false)
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
            toast({
              title: "Added to favorites",
              description: "Item has been added to your favorites.",
            })
          }
        } catch (error) {
          console.error('Error adding to favorites:', error)
          toast({
            title: "Error",
            description: "Failed to add item to favorites. Please try again.",
            variant: "destructive",
          })
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
        toast({
          title: "Removed from favorites",
          description: "Item has been removed from your favorites.",
        })
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast({
        title: "Error",
        description: "Failed to remove item from favorites. Please try again.",
        variant: "destructive",
      })
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
        isAddingToCart,
        isUpdatingCart,
        isRemovingFromCart,
        error,
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
        clearError: () => setError(null),
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
