'use client'

import { usePathname } from 'next/navigation'
import TopAnnouncementBar from '@/components/TopAnnouncementBar'
import MainHeader from '@/components/MainHeader'
import CategoryNavBar from '@/components/CategoryNavBar'
import Footer from '@/components/Footer'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    // For admin routes, only render children without header/footer
    return <>{children}</>
  }

  // For all other routes, render with header and footer
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <TopAnnouncementBar />
        <MainHeader />
        <CategoryNavBar />
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
