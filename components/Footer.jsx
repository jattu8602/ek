'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import Image from 'next/image'
import {
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Newsletter Form Component
function NewsletterForm() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setStatus(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ type: 'success', message: data.message })
        setEmail('')
      } else {
        if (data.requiresLogin) {
          setStatus({
            type: 'error',
            message: 'Please login first to subscribe to newsletter',
            showLogin: true,
          })
        } else {
          setStatus({ type: 'error', message: data.error })
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to subscribe. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {status && (
        <Alert
          variant={status.type === 'success' ? 'default' : 'destructive'}
          className="text-xs"
        >
          <AlertDescription>
            {status.message}
            {status.showLogin && (
              <div className="mt-2">
                <a
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Click here to login
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder={t('footer.newsletter.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/10 border-background/20 text-background placeholder:text-background/60 flex-1"
          required
        />
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 whitespace-nowrap"
          disabled={isSubmitting}
        >
          {isSubmitting ? '...' : t('footer.newsletter.subscribe')}
        </Button>
      </div>
    </form>
  )
}

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Company Info Section */}
          <div className="space-y-3 md:space-y-4 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Ekta Krishi Kendra"
                width={32}
                height={32}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h3 className="text-base md:text-lg font-bold">
                {t('footer.company.title')}
              </h3>
            </div>
            <p className="text-xs md:text-sm opacity-80 leading-relaxed hidden md:block">
              {t('footer.company.description')}
            </p>
            <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {t('footer.company.address')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>8602074069</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="break-all">info@ektakrishi.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 md:space-y-4">
            <h4 className="text-sm md:text-lg font-semibold">
              {t('footer.quickLinks.title')}
            </h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('nav.cart')}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('nav.account')}
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('nav.search.placeholder')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-2 md:space-y-4">
            <h4 className="text-sm md:text-lg font-semibold">
              {t('footer.legal.title')}
            </h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.terms.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.privacy.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.refund.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.shipping.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.disclaimer.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Business */}
          <div className="space-y-2 md:space-y-4">
            <h4 className="text-sm md:text-lg font-semibold">
              {t('footer.customerService.title')}
            </h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm mb-3 md:mb-6">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.about.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  {t('legal.contact.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  FAQ
                </Link>
              </li>
            </ul>

            <h4 className="text-sm md:text-lg font-semibold">
              {t('footer.business.title')}
            </h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link
                  href="/sell-with-us"
                  className="hover:text-primary transition-colors block py-0.5 md:py-1"
                >
                  Sell with Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-border/20 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Social Media */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-sm md:text-lg font-semibold">
                {t('footer.social.title')}
              </h4>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <a
                  href="#"
                  className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Facebook
                  </span>
                </a>
                <a
                  href="#"
                  className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Twitter
                  </span>
                </a>
                <a
                  href="#"
                  className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Instagram
                  </span>
                </a>
                <a
                  href="#"
                  className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-sm md:text-lg font-semibold">
                {t('footer.newsletter.title')}
              </h4>
              <p className="text-xs md:text-sm opacity-80">
                Stay updated with our latest products and offers
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20 bg-background/5">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-xs md:text-sm">
            <p className="opacity-80">{t('footer.copyright')}</p>
            <p className="opacity-80">{t('footer.phone')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
