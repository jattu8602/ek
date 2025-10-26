'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ContactPage() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session) {
      setSubmitStatus({
        type: 'error',
        message: 'Please login to submit contact form',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: t('form.success') })
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || t('form.error'),
        })
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: t('form.error') })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            {t('legal.contact.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us for any questions, support, or inquiries about
            our agricultural products and services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  {session
                    ? "Fill out the form below and we'll get back to you soon."
                    : 'Please login to submit a contact form.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!session ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You need to be logged in to submit a contact form.
                    </p>
                    <div className="space-x-4">
                      <Button asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus && (
                      <Alert
                        variant={
                          submitStatus.type === 'success'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        <AlertDescription>
                          {submitStatus.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('form.name')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('form.email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('form.phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('form.message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us how we can help you..."
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Store Image */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src="https://res.cloudinary.com/doxmvuss9/image/upload/v1761400695/link-generator/vr2oi7e3nlak8yaptdly.jpg"
                alt="Ekta Krishi Kendra Shop"
                fill
                className="object-cover"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Store Address</h3>
                  <p className="text-muted-foreground">
                    Ekta Krishi Kendra
                    <br />
                    Keolari, District Seoni
                    <br />
                    Madhya Pradesh, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="tel:8602074069"
                      className="hover:text-primary transition-colors"
                    >
                      8602074069
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="mailto:info@ektakrishi.com"
                      className="hover:text-primary transition-colors"
                    >
                      info@ektakrishi.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <p className="text-muted-foreground">
                    Monday to Saturday
                    <br />
                    9:00 AM - 6:00 PM
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Closed on Sundays
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="font-semibold mb-4">Find Us on Map</h3>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.60227010943976!2d79.90380650053537!3d22.3673569065477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398077d1eaba790f%3A0xa1eb070321acbc7a!2sEkta%20krishi%20kendra!5e0!3m2!1sen!2sin!4v1761400722584!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
