'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function VerifyEmailPage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error', 'password-setup'
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const setup = searchParams.get('setup')

  useEffect(() => {
    if (setup === 'password') {
      // Direct password setup for Google users
      setStatus('password-setup')
      setMessage('Please set up a password for your account')
      if (session?.user) {
        setUser({ name: session.user.name, email: session.user.email })
      }
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token, setup])

  const verifyEmail = async (token) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Check if user needs to set up password (Google users)
        if (data.user && !data.user.hasPassword) {
          setStatus('password-setup')
          setMessage('Please set up a password for your account')
        } else {
          setStatus('success')
          setMessage(data.message)
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage('An error occurred during verification')
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (passwordError) setPasswordError('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!passwordForm.password || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all fields')
      return
    }

    if (passwordForm.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsPasswordLoading(true)
    setPasswordError('')

    try {
      // Use different API based on whether it's token-based or Google user setup
      const apiEndpoint =
        setup === 'password'
          ? '/api/user/setup-google-password'
          : '/api/user/setup-password'

      const requestBody =
        setup === 'password'
          ? { password: passwordForm.password }
          : { password: passwordForm.password, token: token }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(
          'Password set up successfully! You can now login with email and password.'
        )
      } else {
        setPasswordError(data.error || 'Failed to set up password')
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Email Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === 'verifying' && (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Verifying your email address...
                </p>
              </div>
            )}

            {status === 'password-setup' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-600">
                    Email Verified!
                  </h3>
                  <p className="text-muted-foreground mb-4">{message}</p>
                  {user && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Welcome, {user.name}! Please set up a password for your
                      account.
                    </p>
                  )}
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.password && (
                      <p className="text-xs text-muted-foreground">
                        {passwordForm.password.length < 8
                          ? 'Password must be at least 8 characters long'
                          : 'Password looks good!'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.confirmPassword && (
                      <p className="text-xs text-muted-foreground">
                        {passwordForm.password !== passwordForm.confirmPassword
                          ? 'Passwords do not match'
                          : 'Passwords match!'}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? 'Setting up...' : 'Set Up Password'}
                  </Button>
                </form>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Email Verified Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">{message}</p>
                {user && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Welcome, {user.name}! Your account is now active.
                  </p>
                )}
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">Go to Home</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  Verification Failed
                </h3>
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/register">Try Again</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">Go to Home</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
