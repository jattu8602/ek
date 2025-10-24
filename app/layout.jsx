import { Inter } from 'next/font/google'
import './globals.css' // Assuming you have a global CSS file

import Providers from '@/components/Providers'
import TopAnnouncementBar from '@/components/TopAnnouncementBar'
import MainHeader from '@/components/MainHeader'
import CategoryNavBar from '@/components/CategoryNavBar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ekta Krishi Kendra',
  description: "India's trusted source for quality agricultural products.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header>
              <TopAnnouncementBar />
              <MainHeader />
              <CategoryNavBar />
            </header>
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
