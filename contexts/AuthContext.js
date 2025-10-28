'use client'

import { createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { syncSession, setLoading } from '@/store/authSlice'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const {
    user,
    isAuthenticated,
    loading: isLoading,
  } = useSelector((state) => state.auth)
  const router = useRouter()

  // Sync with server session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Syncing with server session...')
        dispatch(setLoading(true))

        // Fetch session from server
        const response = await fetch('/api/auth/session')
        const sessionData = await response.json()

        console.log('AuthContext: Server session data:', sessionData)
        dispatch(syncSession(sessionData))
      } catch (error) {
        console.error('AuthContext: Failed to sync session:', error)
        dispatch(syncSession(null))
      }
    }

    initializeAuth()
  }, [dispatch])

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
