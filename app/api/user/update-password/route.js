import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json()

    // Validate input
    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user has a password, verify current password
    if (user.password && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      )

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }
    } else if (user.password && !currentPassword) {
      // User has password but didn't provide current password
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }
    // If user doesn't have a password (Google-only user), no current password needed

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
