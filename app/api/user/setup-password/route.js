import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { password, token } = await request.json()

    if (!password || !token) {
      return NextResponse.json(
        { error: 'Password and token are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user with password
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      message: 'Password set up successfully',
    })
  } catch (error) {
    console.error('Setup password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
