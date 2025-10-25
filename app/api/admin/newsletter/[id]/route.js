import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    const { id } = params
    const { isActive } = await request.json()

    // Update subscriber status
    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        isActive: isActive,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      subscriber: updatedSubscriber,
    })
  } catch (error) {
    console.error('Error updating newsletter subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to update newsletter subscriber' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    const { id } = params

    // Delete newsletter subscriber
    await prisma.newsletterSubscriber.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscriber deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to delete newsletter subscriber' },
      { status: 500 }
    )
  }
}
