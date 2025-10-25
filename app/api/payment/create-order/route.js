import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { createRazorpayOrder } from '@/lib/razorpay'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, address, phoneNumber } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 })
    }

    if (!address || !phoneNumber) {
      return NextResponse.json(
        { error: 'Address and phone number are required' },
        { status: 400 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    const processedItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { units: true },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      const unit = product.units.find((u) => u.id === item.unitId)
      if (!unit) {
        return NextResponse.json(
          { error: `Unit not found for product ${product.name}` },
          { status: 404 }
        )
      }

      const itemTotal = unit.discountedPrice * item.quantity
      totalAmount += itemTotal

      processedItems.push({
        productId: item.productId,
        unitId: item.unitId,
        selectedUnit: item.selectedUnit,
        quantity: item.quantity,
        unitPrice: unit.discountedPrice,
        totalPrice: itemTotal,
      })
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      totalAmount,
      'INR',
      `order_${Date.now()}`
    )

    // Store order data temporarily (you might want to use Redis or similar for production)
    // For now, we'll return the order data and handle it in the verify endpoint
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      items: processedItems,
      totalAmount,
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
