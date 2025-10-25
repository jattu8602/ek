import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch user orders with filters
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    // Build where clause
    const where = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          paymentTransaction: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new order (called after payment verification)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      items,
      address,
      phoneNumber,
      isShopPickup,
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json()

    // Calculate total amount
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.totalPrice
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        phoneNumber,
        shippingAddress: JSON.stringify(address),
        isShopPickup,
        paymentId,
        paymentStatus: 'CAPTURED',
        status: 'PENDING',
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            unitId: item.unitId,
            selectedUnit: item.selectedUnit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
        paymentTransaction: {
          create: {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount: totalAmount,
            status: 'CAPTURED',
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        paymentTransaction: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
