import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone, address, city, state, pincode, landmark } =
      await request.json()

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { addresses: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user's name
    await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
    })

    // Handle address - create or update default address
    if (phone || address || city || state || pincode) {
      // Check if user has a default address
      const defaultAddress = await prisma.userAddress.findFirst({
        where: {
          userId: user.id,
          isDefault: true,
        },
      })

      const addressData = {
        name: name.trim(),
        phone: phone || '',
        address: address || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        landmark: landmark || '',
        isDefault: true,
      }

      if (defaultAddress) {
        // Update existing default address
        await prisma.userAddress.update({
          where: { id: defaultAddress.id },
          data: addressData,
        })
      } else {
        // Create new default address
        await prisma.userAddress.create({
          data: {
            ...addressData,
            userId: user.id,
          },
        })
      }
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
