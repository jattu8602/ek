import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { signIn } from 'next-auth/react'
import { sendWelcomeEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token },
      })

      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail verification if welcome email fails
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
