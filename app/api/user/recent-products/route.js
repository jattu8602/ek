import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch user's recent products
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate user ID format (should be 24 characters for MongoDB ObjectId)
    if (!session.user.id || session.user.id.length !== 24) {
      console.error('Invalid user ID format:', session.user.id)
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 400 }
      )
    }

    const recentProducts = await prisma.recentProduct.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
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
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
      take: 4,
    })

    // Format results for the search component
    const formattedResults = recentProducts.map((recent) => ({
      id: recent.product.id,
      name: recent.product.name,
      images: recent.product.images || ['/placeholder-product.jpg'],
      image: recent.product.images?.[0] || '/placeholder-product.jpg',
      category: recent.product.category,
      subcategory: recent.product.subcategory,
      price: recent.product.units[0]?.discountedPrice || 0,
      unit: recent.product.units[0]
        ? `${recent.product.units[0].number} ${recent.product.units[0].type}`
        : '',
      url: `/product/${recent.product.id}`,
      viewedAt: recent.viewedAt,
    }))

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error('Error fetching recent products:', error)

    // Handle specific Prisma ObjectID errors
    if (error.code === 'P2023') {
      console.error('ObjectID format error - user session may be corrupted')
      return NextResponse.json(
        { error: 'Session corrupted, please log in again' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Track product view
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Upsert recent product (update viewedAt if exists, create if not)
    await prisma.recentProduct.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        productId: productId,
        viewedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking product view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
