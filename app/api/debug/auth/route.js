import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check database connection
    const userCount = await prisma.user.count()

    // Check environment variables
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
        ? 'Set'
        : 'Missing',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
    }

    return NextResponse.json({
      status: 'success',
      database: {
        connected: true,
        userCount,
      },
      environment: envCheck,
      message: 'Authentication system is properly configured',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        message: 'Database connection failed',
      },
      { status: 500 }
    )
  }
}
