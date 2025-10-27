import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch user's cart items with full product details
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            units: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      productId,
      quantity = 1,
      unitId,
      selectedUnit,
    } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Check if item already exists in cart with same unit
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
        unitId: unitId,
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })
      return NextResponse.json(updatedItem)
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          unitId: unitId,
          selectedUnit: selectedUnit,
          quantity: quantity,
        },
      })
      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update cart item quantity or unit
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity, unitId, selectedUnit } = await request.json()

    if (!productId || quantity < 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id,
          productId: productId,
        },
      })
      return NextResponse.json({ message: 'Item removed from cart' })
    }

    const updatedItem = await prisma.cartItem.updateMany({
      where: {
        userId: session.user.id,
        productId: productId,
      },
      data: {
        quantity: quantity,
        unitId: unitId,
        selectedUnit: selectedUnit,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from cart
export async function DELETE(request) {
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

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
