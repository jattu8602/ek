import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    // Fetch admin settings
    const settings = await prisma.adminSettings.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error fetching admin settings:', error)
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

    const { geminiApiKey, openaiApiKey } = await request.json()

    // Upsert admin settings
    const settings = await prisma.adminSettings.upsert({
      where: { userId: session.user.id },
      update: {
        geminiApiKey: geminiApiKey || null,
        openaiApiKey: openaiApiKey || null,
      },
      create: {
        userId: session.user.id,
        geminiApiKey: geminiApiKey || null,
        openaiApiKey: openaiApiKey || null,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
