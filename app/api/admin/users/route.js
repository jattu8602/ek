import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all users with their cart items and favorites
    const users = await prisma.user.findMany({
      include: {
        cart: {
          select: {
            id: true,
            quantity: true,
          },
        },
        favorites: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match the frontend format
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email,
      role: user.role,
      status: 'Active', // You can add a status field to your User model if needed
      joinDate: user.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      orders: 0, // You'll need to add an Order model and relation if you want real order counts
      cartItems: user.cart.reduce((total, item) => total + item.quantity, 0),
      favorites: user.favorites.length,
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role' },
        { status: 400 }
      )
    }

    if (!['CUSTOMER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: {
        cart: {
          select: {
            id: true,
            quantity: true,
          },
        },
        favorites: {
          select: {
            id: true,
          },
        },
      },
    })

    // Transform the data to match the frontend format
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name || 'Unknown User',
      email: updatedUser.email,
      role: updatedUser.role,
      status: 'Active',
      joinDate: updatedUser.createdAt.toISOString().split('T')[0],
      orders: 0,
      cartItems: updatedUser.cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      favorites: updatedUser.favorites.length,
    }

    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
