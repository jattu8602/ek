'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import TopAnnouncementBar from '@/components/TopAnnouncementBar'
import MainHeader from '@/components/MainHeader'
import CategoryNavBar from '@/components/CategoryNavBar'
import Footer from '@/components/Footer'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const announcementRef = useRef(null)

  useEffect(() => {
    if (isAdminRoute) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When announcement bar leaves viewport (scrolling down), make header sticky
        setIsHeaderSticky(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px', // Trigger slightly before it completely disappears
      }
    )

    if (announcementRef.current) {
      observer.observe(announcementRef.current)
    }

    return () => {
      if (announcementRef.current) {
        observer.unobserve(announcementRef.current)
      }
    }
  }, [isAdminRoute])

  if (isAdminRoute) {
    // For admin routes, only render children without header/footer
    return <>{children}</>
  }

  // For all other routes, render with header and footer
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <div ref={announcementRef}>
          <TopAnnouncementBar />
        </div>
        <MainHeader isSticky={isHeaderSticky} />
        {/* Spacer to prevent layout shift when header becomes fixed */}
        {isHeaderSticky && <div className="h-[76px]" />}
        <CategoryNavBar />
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
