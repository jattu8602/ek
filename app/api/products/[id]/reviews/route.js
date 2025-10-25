import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.review.count({
      where: { productId: id },
    })

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Review text is required' },
        { status: 400 }
      )
    }

    // Check if user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: id,
        order: {
          userId: session.user.id,
          status: 'DELIVERED',
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 403 }
      )
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: id,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: id,
        text: text.trim(),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    // Update product review count
    await prisma.product.update({
      where: { id },
      data: {
        reviewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
