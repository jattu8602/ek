import { Inter } from 'next/font/google'
import './globals.css' // Assuming you have a global CSS file
import { Analytics } from '@vercel/analytics/react'

import Providers from '@/components/Providers'
import ConditionalLayout from '@/components/ConditionalLayout'

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
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
