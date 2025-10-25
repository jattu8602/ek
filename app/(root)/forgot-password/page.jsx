'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if already logged in (but allow Google users to set up password)
  useEffect(() => {
    console.log('Forgot password page - Session status:', status)
    console.log('Forgot password page - Session data:', session)
    console.log(
      'Forgot password page - User password exists:',
      session?.user?.password
    )

    if (status === 'authenticated' && session) {
      // Allow Google users without password to stay on this page
      if (!session.user?.password) {
        console.log('Google user without password - staying on page')
        // Pre-fill email for Google users
        setEmail(session.user?.email || '')
        return
      }
      console.log('User with password - redirecting to home')
      // Redirect users with passwords back to home
      router.push('/')
    }
  }, [session, status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Checking authentication...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>

          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                <p className="text-muted-foreground mb-4">
                  If an account with that email exists, you will receive a
                  password reset link within a few minutes.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/login">Back to Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">Go to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href={session?.user ? '/profile' : '/login'}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {session?.user ? 'Back to profile' : 'Back to login'}
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {session?.user && !session.user?.password
                ? 'Set Up Password'
                : 'Forgot Password'}
            </CardTitle>
            <CardDescription>
              {session?.user && !session.user?.password
                ? 'Set up a password for your account to enable email/password login'
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="text-center text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
