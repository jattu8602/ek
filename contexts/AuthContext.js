'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else if (status === 'authenticated') {
      setUser(session.user)
      setIsLoading(false)
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [session, status])

  const requireAuth = (callback) => {
    if (!user) {
      router.push('/login')
      return
    }
    if (callback) callback()
  }

  const requireAdmin = (callback) => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    if (callback) callback()
  }

  const isAdmin = () => {
    return user?.role === 'ADMIN'
  }

  const isCustomer = () => {
    return user?.role === 'CUSTOMER'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        requireAuth,
        requireAdmin,
        isAdmin,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
