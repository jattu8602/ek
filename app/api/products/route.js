import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
      where.category = category
    }

    if (subcategory) {
      where.subcategory = subcategory
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

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          units: true,
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

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
