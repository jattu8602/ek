import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Search products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '8')

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
      include: {
        units: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            discountedPrice: 'asc',
          },
          take: 1, // Get the cheapest unit for display
        },
      },
      orderBy: [
        {
          name: 'asc',
        },
      ],
      take: limit,
    })

    // Format results for the search component
    const searchResults = products.map((product) => ({
      id: product.id,
      name: product.name,
      images: product.images || ['/placeholder-product.jpg'],
      image: product.images?.[0] || '/placeholder-product.jpg',
      category: product.category,
      subcategory: product.subcategory,
      price: product.units[0]?.discountedPrice || 0,
      unit: product.units[0]
        ? `${product.units[0].number} ${product.units[0].type}`
        : '',
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
