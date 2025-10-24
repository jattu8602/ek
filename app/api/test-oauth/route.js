import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Google OAuth token endpoint
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: 'test_code', // This will fail but we can see the response
        redirect_uri: 'http://localhost:3000/api/auth/callback/google',
      }),
    })

    const data = await response.text()

    return NextResponse.json({
      status: 'success',
      message: 'OAuth endpoint is reachable',
      response: data.substring(0, 200), // First 200 chars
      statusCode: response.status,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        message: 'OAuth endpoint test failed',
      },
      { status: 500 }
    )
  }
}
