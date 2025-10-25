import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment) {
  try {
    // Update payment transaction status
    await prisma.paymentTransaction.updateMany({
      where: {
        razorpayPaymentId: payment.id,
      },
      data: {
        status: 'CAPTURED',
      },
    })

    // Update order payment status
    await prisma.order.updateMany({
      where: {
        paymentId: payment.id,
      },
      data: {
        paymentStatus: 'CAPTURED',
      },
    })

    console.log('Payment captured for:', payment.id)
  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment) {
  try {
    // Update payment transaction status
    await prisma.paymentTransaction.updateMany({
      where: {
        razorpayPaymentId: payment.id,
      },
      data: {
        status: 'FAILED',
      },
    })

    // Update order payment status
    await prisma.order.updateMany({
      where: {
        paymentId: payment.id,
      },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED',
      },
    })

    console.log('Payment failed for:', payment.id)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleRefundCreated(refund) {
  try {
    // Update payment transaction with refund details
    await prisma.paymentTransaction.updateMany({
      where: {
        razorpayPaymentId: refund.payment_id,
      },
      data: {
        status: 'REFUNDED',
        refundId: refund.id,
        refundAmount: refund.amount / 100, // Convert from paise to rupees
      },
    })

    console.log('Refund created for payment:', refund.payment_id)
  } catch (error) {
    console.error('Error handling refund created:', error)
  }
}
