import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Search products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    // Search products by name, category, subcategory, and description
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            category: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            subcategory: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        category: true,
        subcategory: true,
        rating: true,
        reviewCount: true,
        units: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            discountedPrice: 'asc',
          },
          take: 1,
        },
      },
      orderBy: [
        {
          name: 'asc',
        },
      ],
      skip: skip,
      take: limit,
    })

    // Format results for the search component - return full product structure
    const searchResults = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images || ['/placeholder-product.jpg'],
      image: product.images?.[0] || '/placeholder-product.jpg',
      category: product.category,
      subcategory: product.subcategory,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      units: product.units || [],
      url: `/product/${product.id}`,
    }))

    return NextResponse.json(searchResults)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
