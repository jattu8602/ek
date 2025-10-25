import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { name, email, phone, businessName, businessType, description } =
      await request.json()

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !businessName ||
      !businessType ||
      !description
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Check if user already has a pending application
    const existingApplication = await prisma.sellerApplication.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['PENDING', 'REVIEWED'],
        },
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending seller application' },
        { status: 400 }
      )
    }

    // Create seller application
    const sellerApplication = await prisma.sellerApplication.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        businessType: businessType.trim(),
        description: description.trim(),
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Seller application submitted successfully',
      applicationId: sellerApplication.id,
    })
  } catch (error) {
    console.error('Seller application submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit seller application' },
      { status: 500 }
    )
  }
}
