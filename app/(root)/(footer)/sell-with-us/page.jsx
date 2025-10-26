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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SellWithUsPage() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const businessTypes = [
    'Agricultural Products Supplier',
    'Seed Company',
    'Fertilizer Manufacturer',
    'Chemical Company',
    'Farm Equipment Dealer',
    'Agricultural Consultant',
    'Other',
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      businessType: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session) {
      setSubmitStatus({
        type: 'error',
        message: 'Please login to submit seller application',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: t('form.success') })
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessName: '',
          businessType: '',
          description: '',
        })
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
            Sell with Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our network of trusted agricultural suppliers and expand your
            business with Ekta Krishi Kendra.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-6">
                Why Partner with Us?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Established Market Presence
                    </h3>
                    <p className="text-muted-foreground">
                      Leverage our strong reputation and customer base in the
                      agricultural sector across Madhya Pradesh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Trusted Network
                    </h3>
                    <p className="text-muted-foreground">
                      Connect with hundreds of farmers and agricultural
                      businesses who trust our recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Growth Opportunities
                    </h3>
                    <p className="text-muted-foreground">
                      Expand your reach and grow your business with our
                      marketing support and distribution network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Quality Assurance
                    </h3>
                    <p className="text-muted-foreground">
                      We maintain high standards and only partner with suppliers
                      who meet our quality criteria.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Partnership Requirements
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Valid business registration and licenses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Quality agricultural products
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Competitive pricing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Reliable supply chain
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Good customer service
                </li>
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Apply to Become a Partner</CardTitle>
                <CardDescription>
                  {session
                    ? 'Fill out the form below to start your partnership application.'
                    : 'Please login to submit a partnership application.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!session ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You need to be logged in to submit a partnership
                      application.
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
                      <Label htmlFor="businessName">
                        {t('form.businessName')}
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your business name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">
                        {t('form.businessType')}
                      </Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        {t('form.description')}
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us about your business, products, and why you want to partner with us..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t('form.submitting')
                        : 'Submit Application'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Questions about Partnership?
          </h3>
          <p className="text-muted-foreground mb-6">
            Contact us for more information about our partnership program.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild>
              <Link href="tel:8602074069">Call: 8602074069</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
