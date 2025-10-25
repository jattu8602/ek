import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { verifyPaymentSignature } from '@/lib/razorpay'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
      phoneNumber,
      isShopPickup = false,
    } = await request.json()

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

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
        paymentId: razorpay_payment_id,
        paymentStatus: 'CAPTURED',
        status: 'PENDING', // Will be approved/rejected by admin
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
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
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

    // Clear cart items for the user
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Payment verified and order created successfully',
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
