import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Approve order (admin only)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { deliveryDate, isShopPickup } = await request.json()

    // Check if order exists and is pending
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (existingOrder.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Order is not pending approval' },
        { status: 400 }
      )
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        isShopPickup: isShopPickup || false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
        paymentTransaction: true,
      },
    })

    // TODO: Send notification to customer about order approval
    // This could be email, SMS, or push notification

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order approved successfully',
    })
  } catch (error) {
    console.error('Error approving order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
