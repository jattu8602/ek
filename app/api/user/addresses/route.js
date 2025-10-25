import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch user addresses
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = await prisma.userAddress.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        isDefault: 'desc',
      },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new address
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone, address, city, state, pincode, landmark, isDefault } =
      await request.json()

    // Validate required fields
    if (!name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId: session.user.id,
        name,
        phone,
        address,
        city,
        state,
        pincode,
        landmark,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update address
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      id,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Check if address belongs to user
    const existingAddress = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: { not: id },
        },
        data: {
          isDefault: false,
        },
      })
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        city,
        state,
        pincode,
        landmark,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove address
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Check if address belongs to user
    const existingAddress = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    await prisma.userAddress.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
