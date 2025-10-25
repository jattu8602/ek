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
    const { status, adminNotes } = await request.json()

    // Validate status
    const validStatuses = ['PENDING', 'REVIEWED', 'RESPONDED', 'ARCHIVED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update seller application
    const updatedApplication = await prisma.sellerApplication.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    })
  } catch (error) {
    console.error('Error updating seller application:', error)
    return NextResponse.json(
      { error: 'Failed to update seller application' },
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

    // Delete seller application
    await prisma.sellerApplication.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Seller application deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting seller application:', error)
    return NextResponse.json(
      { error: 'Failed to delete seller application' },
      { status: 500 }
    )
  }
}
