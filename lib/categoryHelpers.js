/**
 * Category and Subcategory normalization helpers
 * Handles URL slug to database format conversion
 */

/**
 * Convert URL slug to possible database formats
 * @param {string} slug - URL slug like "crop-protection" or "seedtreatment"
 * @returns {string[]} Array of possible database formats
 */
export function slugToDbFormats(slug) {
  if (!slug) return []

  // Handle single word slugs (like "seedtreatment")
  if (!slug.includes('-')) {
    const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1)
    return [capitalized, slug, slug.toLowerCase()]
  }

  // Handle multi-word slugs (like "crop-protection")
  const words = slug.split('-')

  // Format 1: "Crop Protection" (with spaces, title case)
  const withSpaces = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Format 2: "CropProtection" (camelCase, no spaces)
  const camelCase = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  // Format 3: Original slug
  const original = slug

  // Format 4: Lowercase version
  const lowercase = slug.toLowerCase()

  return [withSpaces, camelCase, original, lowercase]
}

/**
 * Get all possible category formats for a given slug
 * @param {string} categorySlug - Category slug from URL
 * @returns {string[]} Array of possible category names
 */
export function getCategoryFormats(categorySlug) {
  return slugToDbFormats(categorySlug)
}

/**
 * Get all possible subcategory formats for a given slug
 * @param {string} subcategorySlug - Subcategory slug from URL
 * @returns {string[]} Array of possible subcategory names
 */
export function getSubcategoryFormats(subcategorySlug) {
  return slugToDbFormats(subcategorySlug)
}

/**
 * Create API query string for flexible category matching
 * @param {string} categorySlug - Category slug from URL
 * @param {string} subcategorySlug - Optional subcategory slug from URL
 * @returns {string} Query string for API call
 */
export function createFlexibleQuery(categorySlug, subcategorySlug = null) {
  const categoryFormats = getCategoryFormats(categorySlug)
  let query = `category=${encodeURIComponent(categoryFormats.join(','))}`

  if (subcategorySlug) {
    const subcategoryFormats = getSubcategoryFormats(subcategorySlug)
    query += `&subcategory=${encodeURIComponent(subcategoryFormats.join(','))}`
  }

  return query
}

/**
 * Debug helper to log category matching attempts
 * @param {string} categorySlug - Category slug from URL
 * @param {string} subcategorySlug - Optional subcategory slug from URL
 */
export function debugCategoryMatching(categorySlug, subcategorySlug = null) {
  console.log('Category Matching Debug:', {
    categorySlug,
    subcategorySlug,
    categoryFormats: getCategoryFormats(categorySlug),
    subcategoryFormats: subcategorySlug
      ? getSubcategoryFormats(subcategorySlug)
      : null,
    queryString: createFlexibleQuery(categorySlug, subcategorySlug),
  })
}
