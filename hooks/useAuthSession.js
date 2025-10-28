'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * Custom hook to ensure session is loaded after OAuth redirect
 * This forces NextAuth to check the session immediately on mount
 */
export function useAuthSession() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Force session update on mount if status is loading
    if (status === 'loading') {
      console.log('useAuthSession: Forcing session update...')
      // Force NextAuth to refetch session
      update()
    }
  }, [status, update])

  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('useAuthSession: Session authenticated:', {
        email: session.user?.email,
        role: session.user?.role,
        id: session.user?.id,
      })
    } else if (status === 'unauthenticated') {
      console.log('useAuthSession: No session found')
    }
  }, [status, session])

  return { session, status }
}

