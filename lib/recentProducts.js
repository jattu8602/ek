// localStorage utility functions for recent products

const RECENT_PRODUCTS_KEY = 'recent_products'
const MAX_RECENT_PRODUCTS = 4

/**
 * Get recent products from localStorage
 * @returns {Array} Array of recent products
 */
export function getRecentProducts() {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(RECENT_PRODUCTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading recent products from localStorage:', error)
    return []
  }
}

/**
 * Add a product to recent products in localStorage
 * @param {Object} product - Product object with id, name, image, etc.
 */
export function addRecentProduct(product) {
  if (typeof window === 'undefined') return

  try {
    const recentProducts = getRecentProducts()

    // Remove if product already exists
    const filteredProducts = recentProducts.filter((p) => p.id !== product.id)

    // Add to beginning of array
    const updatedProducts = [product, ...filteredProducts]

    // Keep only the most recent MAX_RECENT_PRODUCTS
    const limitedProducts = updatedProducts.slice(0, MAX_RECENT_PRODUCTS)

    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(limitedProducts))
  } catch (error) {
    console.error('Error saving recent product to localStorage:', error)
  }
}

/**
 * Sync localStorage recent products with database for logged-in users
 * @param {Function} syncCallback - Function to call for each product to sync with DB
 */
export function syncRecentProducts(syncCallback) {
  if (typeof window === 'undefined') return

  try {
    const recentProducts = getRecentProducts()

    // Call sync callback for each recent product
    recentProducts.forEach((product) => {
      if (syncCallback && typeof syncCallback === 'function') {
        syncCallback(product)
      }
    })
  } catch (error) {
    console.error('Error syncing recent products:', error)
  }
}

/**
 * Clear all recent products from localStorage
 */
export function clearRecentProducts() {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(RECENT_PRODUCTS_KEY)
  } catch (error) {
    console.error('Error clearing recent products from localStorage:', error)
  }
}

/**
 * Get recent products formatted for search component
 * @returns {Array} Formatted recent products
 */
export function getFormattedRecentProducts() {
  const recentProducts = getRecentProducts()

  return recentProducts.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.image || '/placeholder-product.jpg',
    category: product.category || '',
    subcategory: product.subcategory || '',
    price: product.price || 0,
    unit: product.unit || '',
    url: `/product/${product.id}`,
    isRecent: true, // Flag to identify recent products
  }))
}
