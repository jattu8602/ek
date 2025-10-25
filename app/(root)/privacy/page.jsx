'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-sm md:prose-lg max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t('legal.privacy.title')}
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We collect information you provide directly to us, such as when
                you create an account, make a purchase, or contact us. This may
                include your name, email address, phone number, shipping
                address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and our services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Service providers who assist us in operating our website and
                  conducting our business
                </li>
                <li>Payment processors to process your transactions</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                4. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                5. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We use cookies and similar tracking technologies to enhance your
                browsing experience, analyze website traffic, and personalize
                content. You can control cookie settings through your browser
                preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                6. Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Our website may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to read their privacy
                policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                7. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
                <li>File a complaint with relevant authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                8. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, comply with legal
                obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Our services are not directed to children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected such
                information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last Updated" date. Your continued use of our
                services after any changes constitutes acceptance of the updated
                policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                If you have any questions about this privacy policy or our data
                practices, please contact us at:
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
