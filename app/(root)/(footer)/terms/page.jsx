'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-sm md:prose-lg max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t('legal.terms.title')}
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                1. User Agreement
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                By accessing and using Ekta Krishi Kendra's website and
                services, you agree to be bound by these Terms and Conditions.
                If you do not agree to these terms, please do not use our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                2. Company Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Ekta Krishi Kendra is a registered agricultural products
                supplier located in Keolari, District Seoni, Madhya Pradesh,
                India. We specialize in providing quality seeds, fertilizers,
                chemicals, and agricultural tools to farmers and agricultural
                businesses.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                3. Product Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We strive to provide accurate product information, including
                descriptions, specifications, and pricing. However, product
                availability, prices, and specifications may change without
                notice. We reserve the right to modify or discontinue any
                product at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                4. Pricing & Payment
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                All prices are listed in Indian Rupees (INR) and are inclusive
                of applicable taxes. We accept various payment methods including
                online payments, cash on delivery, and bank transfers. Payment
                terms and conditions are subject to our payment policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                5. Shipping & Delivery
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We provide delivery services to various locations. Delivery
                times and charges may vary based on location and order size.
                Customers may also opt for shop pickup from our location in
                Keolari, District Seoni, MP.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                6. Returns & Refunds
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We offer returns and refunds as per our return policy. Certain
                products may not be eligible for returns due to their nature
                (perishable items, chemicals, etc.). Please refer to our
                detailed return policy for specific terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Ekta Krishi Kendra shall not be liable for any indirect,
                incidental, special, or consequential damages arising from the
                use of our products or services. Our liability is limited to the
                maximum extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                All content on this website, including text, graphics, logos,
                and images, is the property of Ekta Krishi Kendra and is
                protected by copyright laws. Unauthorized use of any content is
                strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                9. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                These terms and conditions are governed by the laws of India.
                Any disputes arising from these terms shall be subject to the
                jurisdiction of the courts in Seoni, Madhya Pradesh.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                10. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                For any questions regarding these terms and conditions, please
                contact us at:
                <br />
                Ekta Krishi Kendra
                <br />
                Keolari, District Seoni, Madhya Pradesh
                <br />
                Phone: 8602074069
                <br />
                Email: info@ektakrishi.com
              </p>
            </section>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
