'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function RefundPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-sm md:prose-lg max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t('legal.refund.title')}
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                1. Return Policy Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                At Ekta Krishi Kendra, we strive to provide quality agricultural
                products. We understand that sometimes products may not meet
                your expectations, and we offer a fair return and refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                2. Return Timeframe
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                You have 7 days from the date of delivery to initiate a return
                request. For perishable items like seeds, the return window is 3
                days from delivery date.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                3. Return Conditions
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                To be eligible for a return, the product must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Be in its original packaging</li>
                <li>Not be used or damaged by the customer</li>
                <li>Have all original labels and tags intact</li>
                <li>Be in saleable condition</li>
                <li>Include the original invoice or receipt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                4. Non-Returnable Items
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Perishable agricultural products (seeds, plants) after 3 days
                </li>
                <li>Chemical products that have been opened</li>
                <li>Customized or special order items</li>
                <li>Items damaged by customer negligence</li>
                <li>
                  Products purchased during special sales (unless specified
                  otherwise)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                5. Return Process
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                To initiate a return:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Contact us within the return timeframe</li>
                <li>Provide your order number and reason for return</li>
                <li>We will provide return instructions</li>
                <li>Package the item securely in original packaging</li>
                <li>Ship the item back to our address</li>
                <li>
                  We will process your refund once the item is received and
                  inspected
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                6. Refund Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Refunds will be processed within 5-7 business days after we
                receive and inspect the returned item. The refund will be issued
                to the original payment method used for the purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                7. Return Shipping
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Return shipping costs are the responsibility of the customer
                unless the return is due to our error (wrong item shipped,
                defective product, etc.). In such cases, we will provide a
                prepaid return label.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                8. Exchange Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We offer exchanges for products of equal or higher value. If the
                new product costs more, you will need to pay the difference. If
                it costs less, we will refund the difference.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                9. Damaged or Defective Products
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                If you receive a damaged or defective product, please contact us
                immediately. We will arrange for a replacement or full refund at
                no additional cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                10. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                For return and refund inquiries, please contact us at:
                <br />
                Ekta Krishi Kendra
                <br />
                Keolari, District Seoni, Madhya Pradesh
                <br />
                Phone: 8602074069
                <br />
                Email: info@ektakrishi.com
                <br />
                <br />
                Please include your order number in all communications for
                faster processing.
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
