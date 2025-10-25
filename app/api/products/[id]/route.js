import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    console.log('API called with params:', params)
    const { id } = params
    console.log('Product ID:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        units: true,
        _count: {
          select: {
            reviews: true,
            ratings: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // For now, set default values for rating and review count
    const averageRating = 0
    const reviewCount = product._count.reviews

    return NextResponse.json({
      ...product,
      averageRating,
      reviewCount,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
