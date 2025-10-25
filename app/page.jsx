import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { categories } from '@/data/products'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import HomePageClient from './HomePageClient'

const categoryImages = {
  'category-seeds.jpg': '/category-seeds.jpg',
  'category-fertilizers.jpg': '/category-fertilizers.jpg',
  'category-chemicals.jpg': '/category-chemicals.jpg',
  'category-tools.jpg': '/category-tools.jpg',
}

async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL
    const res = await fetch(`${baseUrl}/api/products?limit=8`, {
      next: { revalidate: 300 }, // ISR with 5min cache
    })

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await res.json()
    return data.products || []
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return <HomePageClient featuredProducts={featuredProducts} />
}
