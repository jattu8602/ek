import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    // Check if user is logged in
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: 'Please login first to subscribe to newsletter',
          requiresLogin: true,
        },
        { status: 401 }
      )
    }

    const { email } = await request.json()

    // Validate email
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

    // Check if email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed to newsletter' },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { id: existingSubscriber.id },
          data: { isActive: true, updatedAt: new Date() },
        })

        return NextResponse.json({
          success: true,
          message: 'Newsletter subscription reactivated successfully',
        })
      }
    }

    // Create new subscription
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find and deactivate subscription
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in newsletter subscription' },
        { status: 404 }
      )
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { isActive: false, updatedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
}
