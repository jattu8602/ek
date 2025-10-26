import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where = {
      status: 'ACTIVE', // Only show active products to users
    }

    if (category) {
      // Support multiple category formats (comma-separated)
      const categoryFormats = category.split(',').map((c) => c.trim())
      if (categoryFormats.length === 1) {
        where.category = categoryFormats[0]
      } else {
        where.category = { in: categoryFormats }
      }
    }

    if (subcategory) {
      // Support multiple subcategory formats (comma-separated)
      const subcategoryFormats = subcategory.split(',').map((s) => s.trim())
      if (subcategoryFormats.length === 1) {
        where.subcategory = subcategoryFormats[0]
      } else {
        where.subcategory = { in: subcategoryFormats }
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { subcategory: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy clause
    const orderBy = {}
    if (sortBy === 'price') {
      // For price sorting, we'll sort by the first unit's discounted price
      // This is a limitation of the current schema design
      orderBy.createdAt = sortOrder // Fallback to creation date for now
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    // Fetch products with pagination - optimized query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          category: true,
          subcategory: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          units: {
            select: {
              id: true,
              number: true,
              type: true,
              actualPrice: true,
              discountedPrice: true,
              status: true,
            },
            where: { status: 'ACTIVE' },
            take: 1,
          },
          _count: {
            select: {
              reviews: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
