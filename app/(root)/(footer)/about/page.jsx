'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            {t('legal.about.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('footer.company.description')}
          </p>
        </div>

        {/* Company Image */}
        <div className="mb-8 md:mb-12">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/doxmvuss9/image/upload/v1761400695/link-generator/vr2oi7e3nlak8yaptdly.jpg"
              alt="Ekta Krishi Kendra Shop"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Company Story */}
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Ekta Krishi Kendra has been serving the agricultural community in
              Keolari, District Seoni, Madhya Pradesh, for several years. We
              started with a simple mission: to provide farmers with access to
              high-quality agricultural products and expert guidance to help
              them achieve better yields and sustainable farming practices.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Our journey began with the understanding that farmers need
              reliable suppliers who understand their challenges and can provide
              not just products, but also knowledge and support. Today, we are
              proud to be a trusted partner for hundreds of farmers in the
              region.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To empower farmers with quality agricultural inputs, expert
              advice, and innovative solutions that enhance productivity while
              promoting sustainable farming practices. We believe that when
              farmers succeed, communities thrive.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-muted-foreground">
                  We source only the best quality seeds, fertilizers, and
                  agricultural chemicals from trusted manufacturers.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Farmer-Centric</h3>
                <p className="text-muted-foreground">
                  Every decision we make is guided by what's best for our
                  farming community and their success.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Our team provides knowledgeable advice on product selection,
                  application methods, and farming techniques.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Trust & Reliability
                </h3>
                <p className="text-muted-foreground">
                  We build long-term relationships with our customers through
                  consistent quality and dependable service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Seeds</h3>
                <p className="text-muted-foreground text-sm">
                  Premium quality seeds for various crops including cereals,
                  pulses, and vegetables.
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fertilizers</h3>
                <p className="text-muted-foreground text-sm">
                  Organic and chemical fertilizers to enhance soil fertility and
                  crop growth.
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧪</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Crop Protection</h3>
                <p className="text-muted-foreground text-sm">
                  Pesticides and chemicals for effective pest and disease
                  management.
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Farm Tools</h3>
                <p className="text-muted-foreground text-sm">
                  Essential farming tools and equipment for efficient
                  agricultural operations.
                </p>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Visit Our Store</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Store Location</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>Address:</strong> Ekta Krishi Kendra
                  </p>
                  <p>Keolari, District Seoni, Madhya Pradesh</p>
                  <p>
                    <strong>Phone:</strong> 8602074069
                  </p>
                  <p>
                    <strong>Email:</strong> info@ektakrishi.com
                  </p>
                  <p>
                    <strong>Hours:</strong> Monday to Saturday, 9 AM to 6 PM
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Find Us on Map</h3>
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
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Quality Assurance
                </h3>
                <p className="text-muted-foreground text-sm">
                  All our products are tested and certified for quality and
                  effectiveness.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Reliable Delivery
                </h3>
                <p className="text-muted-foreground text-sm">
                  Timely delivery to your doorstep or convenient shop pickup
                  options.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
                <p className="text-muted-foreground text-sm">
                  Professional guidance from experienced agricultural experts.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
