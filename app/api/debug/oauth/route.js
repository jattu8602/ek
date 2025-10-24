import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables (without exposing secrets)
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
        ? 'Set'
        : 'Missing',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
    }

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isVercel = process.env.VERCEL === '1'

    return NextResponse.json({
      status: 'success',
      environment: envCheck,
      deployment: {
        isProduction,
        isVercel,
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
      },
      oauth: {
        callbackUrl: `${
          process.env.NEXTAUTH_URL || 'https://ek-qnty.vercel.app'
        }/api/auth/callback/google`,
        signInUrl: `${
          process.env.NEXTAUTH_URL || 'https://ek-qnty.vercel.app'
        }/api/auth/signin/google`,
      },
      message: 'OAuth configuration check complete',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        message: 'Failed to check OAuth configuration',
      },
      { status: 500 }
    )
  }
}
