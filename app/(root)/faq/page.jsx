'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const { t } = useLanguage()

  const faqData = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is Ekta Krishi Kendra?',
          answer:
            'Ekta Krishi Kendra is a trusted agricultural products supplier located in Keolari, District Seoni, Madhya Pradesh. We specialize in providing quality seeds, fertilizers, chemicals, and agricultural tools to farmers and agricultural businesses.',
        },
        {
          question: 'Where are you located?',
          answer:
            'We are located in Keolari, District Seoni, Madhya Pradesh. You can visit our store or contact us at 8602074069 for directions.',
        },
        {
          question: 'What are your business hours?',
          answer:
            'We are open Monday to Saturday from 9:00 AM to 6:00 PM. We are closed on Sundays.',
        },
      ],
    },
    {
      category: 'Products',
      questions: [
        {
          question: 'What types of products do you sell?',
          answer:
            'We sell a wide range of agricultural products including seeds (cereals, pulses, vegetables), fertilizers (organic and chemical), crop protection chemicals (pesticides, herbicides), and farming tools and equipment.',
        },
        {
          question: 'Do you have organic products?',
          answer:
            'Yes, we offer both organic and chemical fertilizers and crop protection products. Our team can help you choose the right products for your farming needs.',
        },
        {
          question: 'Can I get product recommendations?',
          answer:
            'Absolutely! Our experienced team provides expert advice on product selection, application methods, and farming techniques. We consider your soil type, crop variety, and local conditions.',
        },
      ],
    },
    {
      category: 'Orders & Delivery',
      questions: [
        {
          question: 'How can I place an order?',
          answer:
            'You can place orders by calling us at 8602074069, visiting our store, or through our website. We accept various payment methods including cash, online payments, and bank transfers.',
        },
        {
          question: 'Do you deliver products?',
          answer:
            'Yes, we provide delivery services to various locations. We offer free delivery for orders above ₹999 within 50km radius. Delivery charges apply for longer distances.',
        },
        {
          question: 'Can I pick up my order from the store?',
          answer:
            'Yes, you can choose to pick up your order from our store location. This option has no delivery charges and orders are usually ready within 2-4 hours.',
        },
        {
          question: 'What are your delivery areas?',
          answer:
            'We deliver to Seoni District and surrounding areas, Jabalpur and nearby regions, Nagpur and Maharashtra border areas, and Chhattisgarh border regions. Contact us for specific delivery to your location.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer returns within 7 days of delivery for most products. Perishable items like seeds have a 3-day return window. Certain products like opened chemicals are not returnable.',
        },
        {
          question: 'Which items cannot be returned?',
          answer:
            'Perishable agricultural products after 3 days, opened chemical products, customized items, and products damaged by customer negligence cannot be returned.',
        },
        {
          question: 'How long does it take to process refunds?',
          answer:
            'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method.',
        },
      ],
    },
    {
      category: 'Partnership',
      questions: [
        {
          question: 'How can I become a supplier partner?',
          answer:
            'You can apply to become a supplier partner by filling out our partnership application form. We look for suppliers with quality products, competitive pricing, and reliable supply chains.',
        },
        {
          question: 'What are the requirements for partnership?',
          answer:
            'Partners need valid business registration, quality agricultural products, competitive pricing, reliable supply chain, and good customer service. Contact us for detailed requirements.',
        },
        {
          question: 'Do you offer marketing support to partners?',
          answer:
            'Yes, we provide marketing support to our partners including product promotion, customer referrals, and access to our established customer network.',
        },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'Do you provide agricultural advice?',
          answer:
            'Yes, our team provides expert agricultural advice on product selection, application methods, and farming techniques. However, please note that our advice is for general guidance only.',
        },
        {
          question: 'Can you help with soil testing recommendations?',
          answer:
            'We can recommend appropriate fertilizers and soil amendments based on your crop requirements and local conditions. For detailed soil analysis, we recommend consulting agricultural laboratories.',
        },
        {
          question: 'Do you offer training or workshops?',
          answer:
            'We occasionally organize training sessions and workshops for farmers. Contact us to know about upcoming events and training programs.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our products, services, and
            policies.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqData.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  {section.category}
                </CardTitle>
                <CardDescription>
                  Common questions about {section.category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${sectionIndex}-${faqIndex}`}
                    >
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? We're here to help!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speak directly with our team
                  </p>
                  <Button asChild>
                    <Link href="tel:8602074069">8602074069</Link>
                  </Button>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us your questions
                  </p>
                  <Button asChild variant="outline">
                    <Link href="mailto:info@ektakrishi.com">
                      info@ektakrishi.com
                    </Link>
                  </Button>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Contact Form</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use our contact form
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/contact">Contact Form</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4">Visit Our Store</h3>
          <p className="text-muted-foreground mb-6">
            Come visit us at our store in Keolari for personalized service and
            expert advice.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/about">About Us</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
