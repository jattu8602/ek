'use client'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export function useSessionCache() {
  const { data: session, status } = useSession()
  const [cachedSession, setCachedSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else if (status === 'authenticated') {
      setCachedSession(session)
      setIsLoading(false)
    } else {
      setCachedSession(null)
      setIsLoading(false)
    }
  }, [session, status])

  return { session: cachedSession, isLoading, status }
}
