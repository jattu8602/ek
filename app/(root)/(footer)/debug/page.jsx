'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [debugInfo, setDebugInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        const response = await fetch('/api/debug/auth')
        const data = await response.json()
        setDebugInfo(data)
      } catch (error) {
        console.error('Failed to fetch debug info:', error)
      }
    }

    fetchDebugInfo()
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false,
      })
      console.log('Sign in result:', result)
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Session Status:</h3>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-mono">{status}</span>
              </p>
              {session && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p>
                    <strong>User ID:</strong> {session.user?.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {session.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {session.user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {session.user?.role}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">System Status:</h3>
              {debugInfo ? (
                <div className="space-y-2">
                  <p>
                    <strong>Database:</strong>{' '}
                    {debugInfo.database?.connected
                      ? '✅ Connected'
                      : '❌ Failed'}
                  </p>
                  <p>
                    <strong>User Count:</strong> {debugInfo.database?.userCount}
                  </p>
                  <p>
                    <strong>Environment Variables:</strong>
                  </p>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>NEXTAUTH_URL: {debugInfo.environment?.NEXTAUTH_URL}</li>
                    <li>
                      NEXTAUTH_SECRET: {debugInfo.environment?.NEXTAUTH_SECRET}
                    </li>
                    <li>
                      GOOGLE_CLIENT_ID:{' '}
                      {debugInfo.environment?.GOOGLE_CLIENT_ID}
                    </li>
                    <li>
                      GOOGLE_CLIENT_SECRET:{' '}
                      {debugInfo.environment?.GOOGLE_CLIENT_SECRET}
                    </li>
                    <li>DATABASE_URL: {debugInfo.environment?.DATABASE_URL}</li>
                  </ul>
                </div>
              ) : (
                <p>Loading debug information...</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Test Authentication:</h3>
              <div className="flex gap-4">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? 'Signing in...' : 'Test Google Sign In'}
                </Button>
                {session && (
                  <Button
                    onClick={() => signOut({ callbackUrl: '/debug' })}
                    variant="destructive"
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>OAuthAccountNotLinked Error:</strong> This usually
                occurs when:
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>
                    Google OAuth redirect URI doesn't match your current URL
                  </li>
                  <li>User account exists but OAuth linking fails</li>
                  <li>Database connection issues during account creation</li>
                </ul>
                <p className="mt-2">
                  <strong>Solution:</strong> Make sure your Google Console has
                  the correct redirect URI:
                  <code className="bg-muted px-1 rounded">
                    http://localhost:3000/api/auth/callback/google
                  </code>
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
