'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function DisclaimerPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-sm md:prose-lg max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t('legal.disclaimer.title')}
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                1. Product Information Accuracy
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                While we strive to provide accurate and up-to-date information
                about our products, we cannot guarantee that all product
                descriptions, specifications, and images are completely accurate
                or current. Product information may change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                2. Product Availability
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Product availability is subject to change without notice. We
                reserve the right to limit quantities, discontinue products, or
                refuse orders at our discretion. Out-of-stock items will be
                clearly marked, and we will notify customers of any availability
                issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                3. Pricing Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                All prices are subject to change without notice. While we make
                every effort to ensure accurate pricing, errors may occur. We
                reserve the right to correct any pricing errors and adjust
                orders accordingly. Final pricing will be confirmed at the time
                of order processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                4. Agricultural Advice Limitations
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Any agricultural advice, recommendations, or information
                provided by Ekta Krishi Kendra is for general guidance only. We
                are not responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Crop yield results or agricultural outcomes</li>
                <li>Weather-related crop failures or losses</li>
                <li>Soil condition variations affecting product performance</li>
                <li>Application timing or method variations</li>
                <li>Local agricultural conditions and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                5. Chemical Product Usage
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                For chemical products (pesticides, fertilizers, etc.):
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Always follow manufacturer instructions and safety guidelines
                </li>
                <li>Use appropriate protective equipment</li>
                <li>Comply with local agricultural regulations</li>
                <li>Store chemicals safely and securely</li>
                <li>Dispose of containers according to regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                6. Website and Technology
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We do not guarantee that our website will be error-free,
                uninterrupted, or free of viruses or other harmful components.
                We are not liable for any technical issues, downtime, or data
                loss that may occur while using our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                7. Third-Party Links
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Our website may contain links to third-party websites. We are
                not responsible for the content, privacy practices, or security
                of these external sites. Use of third-party links is at your own
                risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                8. Force Majeure
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We are not liable for delays or failures in performance due to
                circumstances beyond our control, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Natural disasters and extreme weather conditions</li>
                <li>Government regulations or policy changes</li>
                <li>Transportation disruptions</li>
                <li>Supplier issues or shortages</li>
                <li>Pandemic or health emergencies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                To the maximum extent permitted by law, Ekta Krishi Kendra shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from the use of our
                products or services, including but not limited to loss of
                profits, crop failures, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                10. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                This disclaimer is governed by the laws of India. Any disputes
                arising from this disclaimer shall be subject to the
                jurisdiction of the courts in Seoni, Madhya Pradesh.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                11. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                For questions regarding this disclaimer, please contact us at:
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
