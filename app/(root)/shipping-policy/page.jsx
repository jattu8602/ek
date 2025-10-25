'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function ShippingPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-sm md:prose-lg max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t('legal.shipping.title')}
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                1. Delivery Areas
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We provide delivery services to various locations across Madhya
                Pradesh and neighboring states. Our primary delivery areas
                include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Seoni District and surrounding areas</li>
                <li>Jabalpur and nearby regions</li>
                <li>Nagpur and Maharashtra border areas</li>
                <li>Chhattisgarh border regions</li>
                <li>Other areas on request (additional charges may apply)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                2. Delivery Timeframes
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Standard delivery timeframes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Local (within 50km):</strong> 1-2 business days
                </li>
                <li>
                  <strong>Regional (50-100km):</strong> 2-3 business days
                </li>
                <li>
                  <strong>Extended areas (100km+):</strong> 3-5 business days
                </li>
                <li>
                  <strong>Special orders:</strong> 5-7 business days
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                3. Delivery Charges
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Our delivery charges are based on order value and distance:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Free delivery:</strong> Orders above ₹999 within 50km
                  radius
                </li>
                <li>
                  <strong>Local delivery:</strong> ₹50 for orders below ₹999
                </li>
                <li>
                  <strong>Regional delivery:</strong> ₹100-200 based on distance
                </li>
                <li>
                  <strong>Extended areas:</strong> ₹200-500 based on distance
                  and order size
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                4. Order Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Once your order is confirmed:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>We process your order within 24 hours</li>
                <li>Items are carefully packed and labeled</li>
                <li>You receive a confirmation with tracking details</li>
                <li>Delivery is scheduled based on your location</li>
                <li>You receive delivery updates via SMS/phone</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                5. Shop Pickup Option
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Customers can choose to pick up their orders from our shop
                location:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>No delivery charges for shop pickup</li>
                <li>Orders ready within 2-4 hours</li>
                <li>Convenient for local customers</li>
                <li>Opportunity to see and verify products</li>
                <li>Expert advice available during pickup</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                6. Special Handling
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Certain products require special handling:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Chemical products:</strong> Proper packaging and
                  labeling
                </li>
                <li>
                  <strong>Seeds:</strong> Temperature-controlled storage and
                  transport
                </li>
                <li>
                  <strong>Fertilizers:</strong> Moisture-proof packaging
                </li>
                <li>
                  <strong>Heavy items:</strong> Special delivery arrangements
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                7. Delivery Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We provide tracking information for all deliveries:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>SMS updates on delivery status</li>
                <li>Phone calls for delivery confirmation</li>
                <li>Delivery person contact information</li>
                <li>Estimated delivery time windows</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                8. Delivery Issues
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                If you experience delivery issues:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Contact us immediately at 8602074069</li>
                <li>Provide your order number and issue details</li>
                <li>We will investigate and resolve promptly</li>
                <li>Alternative delivery arrangements can be made</li>
                <li>Compensation provided for genuine issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                9. Weather and Seasonal Considerations
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                During monsoon season and extreme weather conditions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Delivery schedules may be affected</li>
                <li>Special packaging for weather protection</li>
                <li>Alternative delivery dates offered</li>
                <li>Priority given to urgent agricultural needs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                10. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                For shipping and delivery inquiries:
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
                Our delivery team is available Monday to Saturday, 9 AM to 6 PM.
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
