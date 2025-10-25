'use client'

import { useState, useEffect } from 'react'

export default function TestProductDetail({ params }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Price: ₹{product.units?.[0]?.discountedPrice || 'N/A'}</p>
    </div>
  )
}
