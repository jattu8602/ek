import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user addresses
    const addresses = await prisma.userAddress.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    })

    return NextResponse.json({
      addresses,
    })
  } catch (error) {
    console.error('Error fetching user addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
