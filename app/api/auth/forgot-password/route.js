import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message:
          'If an account with that email exists, you will receive a password reset link.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expires: tokenExpires,
      },
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json(
        {
          error: 'Failed to send password reset email. Please try again later.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message:
        'If an account with that email exists, you will receive a password reset link.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
