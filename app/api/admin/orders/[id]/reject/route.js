import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { createRefund } from '@/lib/razorpay'

const prisma = new PrismaClient()

// POST - Reject order with automatic refund (admin only)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { reason } = await request.json()

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Check if order exists and is pending
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        paymentTransaction: true,
      },
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

    // Initiate automatic refund via Razorpay
    let refundResult = null
    if (existingOrder.paymentTransaction?.razorpayPaymentId) {
      try {
        refundResult = await createRefund(
          existingOrder.paymentTransaction.razorpayPaymentId,
          existingOrder.totalAmount,
          `Order rejected: ${reason}`
        )
      } catch (refundError) {
        console.error('Error creating refund:', refundError)
        // Continue with order rejection even if refund fails
        // Admin can manually process refund later
      }
    }

    // Update order status to rejected
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        adminNotes: reason,
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

    // Update payment transaction with refund details
    if (refundResult) {
      await prisma.paymentTransaction.update({
        where: { orderId: params.id },
        data: {
          status: 'REFUNDED',
          refundId: refundResult.id,
          refundAmount: refundResult.amount / 100, // Convert from paise to rupees
        },
      })
    }

    // TODO: Send notification to customer about order rejection and refund
    // This could be email, SMS, or push notification

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      refund: refundResult,
      message: 'Order rejected and refund initiated successfully',
    })
  } catch (error) {
    console.error('Error rejecting order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
