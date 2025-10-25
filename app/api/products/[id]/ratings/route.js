import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params

    const ratings = await prisma.rating.findMany({
      where: { productId: id },
      select: {
        stars: true,
      },
    })

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.stars, 0) /
          ratings.length
        : 0

    const ratingDistribution = {
      5: ratings.filter((r) => r.stars === 5).length,
      4: ratings.filter((r) => r.stars === 4).length,
      3: ratings.filter((r) => r.stars === 3).length,
      2: ratings.filter((r) => r.stars === 2).length,
      1: ratings.filter((r) => r.stars === 1).length,
    }

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratingDistribution,
    })
  } catch (error) {
    console.error('Error fetching ratings:', error)
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
    const { stars } = await request.json()

    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5 stars' },
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
        { error: 'You can only rate products you have purchased' },
        { status: 403 }
      )
    }

    // Upsert rating (update if exists, create if not)
    const rating = await prisma.rating.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: id,
        },
      },
      update: {
        stars: parseInt(stars),
      },
      create: {
        userId: session.user.id,
        productId: id,
        stars: parseInt(stars),
      },
    })

    // Update product average rating
    const allRatings = await prisma.rating.findMany({
      where: { productId: id },
      select: { stars: true },
    })

    const averageRating =
      allRatings.reduce((sum, rating) => sum + rating.stars, 0) /
      allRatings.length

    await prisma.product.update({
      where: { id },
      data: {
        rating: Math.round(averageRating * 10) / 10,
      },
    })

    return NextResponse.json(rating)
  } catch (error) {
    console.error('Error creating/updating rating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
