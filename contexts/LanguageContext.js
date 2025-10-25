'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(undefined)

// Translation data
const translations = {
  hindi: {
    // Header
    'announcement.text': '🎉 नए साल का विशेष ऑफर! सभी उत्पादों पर 20% छूट',
    'announcement.cta': 'अभी खरीदें',
    'language.toggle': 'हिंदी / English',

    // Navigation
    'nav.home': 'होम',
    'nav.categories': 'श्रेणियां',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.search.placeholder': 'उत्पाद खोजें...',
    'nav.cart': 'कार्ट',
    'nav.account': 'खाता',

    // Categories
    'category.seeds': 'बीज',
    'category.fertilizers': 'उर्वरक',
    'category.chemicals': 'रसायन',
    'category.tools': 'उपकरण',

    // Home page
    'home.hero.title': 'एकता कृषि केंद्र में आपका स्वागत है',
    'home.hero.subtitle':
      'भारत का भरोसेमंद स्रोत गुणवत्तापूर्ण बीज, उर्वरक और फसल सुरक्षा उत्पादों के लिए',
    'home.hero.cta': 'अभी खरीदें',
    'home.bestsellers.title': 'हमारे बेस्टसेलर',
    'home.bestsellers.subtitle': 'किसानों द्वारा भरोसेमंद टॉप-रेटेड उत्पाद',
    'home.bestsellers.seeMore': 'और देखें',
    'home.categories.title': 'श्रेणी के अनुसार खरीदारी करें',
    'home.categories.subtitle': 'हर कृषि आवश्यकता के लिए उत्पाद खोजें',

    // Product
    'product.addToCart': 'कार्ट में जोड़ें',
    'product.buyNow': 'अभी खरीदें',
    'product.selectUnit': 'इकाई चुनें',
    'product.quantity': 'मात्रा',
    'product.description': 'विवरण',
    'product.specifications': 'विशिष्टताएं',
    'product.reviews': 'समीक्षाएं',
    'product.freeDelivery': '₹999 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी',
    'product.returns': '7-दिन आसान रिटर्न',
    'product.expertAdvice': 'विशेषज्ञ सलाह उपलब्ध',
    'product.inclusiveTaxes': 'सभी करों सहित',
    'product.off': '% छूट',

    // Category pages
    'category.products.count': 'उत्पाद',
    'category.sortBy': 'क्रमबद्ध करें:',
    'category.sort.featured': 'विशेष',
    'category.noProducts': 'इस श्रेणी में कोई उत्पाद नहीं मिला।',

    // Footer
    'footer.copyright': '© 2025 एकता कृषि केंद्र केओलारी। सभी अधिकार सुरक्षित।',
    'footer.phone': '📞 ऑर्डर के लिए कॉल करें: 8602074069',
    'footer.company.title': 'एकता कृषि केंद्र',
    'footer.company.description':
      'भारत का भरोसेमंद स्रोत गुणवत्तापूर्ण बीज, उर्वरक और फसल सुरक्षा उत्पादों के लिए',
    'footer.company.address': 'केओलारी, जिला सिवनी, मध्य प्रदेश',
    'footer.quickLinks.title': 'त्वरित लिंक',
    'footer.legal.title': 'कानूनी',
    'footer.customerService.title': 'ग्राहक सेवा',
    'footer.business.title': 'व्यापार',
    'footer.social.title': 'सोशल मीडिया',
    'footer.newsletter.title': 'न्यूज़लेटर',
    'footer.newsletter.placeholder': 'आपका ईमेल पता',
    'footer.newsletter.subscribe': 'सब्सक्राइब करें',

    // Breadcrumbs
    'breadcrumb.home': 'होम',

    // Additional product details
    'product.category': 'श्रेणी',
    'product.subcategory': 'उपश्रेणी',
    'product.availableUnits': 'उपलब्ध इकाइयां',
    'product.rating': 'रेटिंग',
    'product.reviews.count': 'समीक्षाएं',

    // Legal Pages
    'legal.terms.title': 'नियम और शर्तें',
    'legal.privacy.title': 'गोपनीयता नीति',
    'legal.refund.title': 'रिफंड और रिटर्न नीति',
    'legal.shipping.title': 'शिपिंग नीति',
    'legal.disclaimer.title': 'अस्वीकरण',
    'legal.about.title': 'हमारे बारे में',
    'legal.contact.title': 'संपर्क करें',

    // Forms
    'form.name': 'नाम',
    'form.email': 'ईमेल',
    'form.phone': 'फोन',
    'form.message': 'संदेश',
    'form.businessName': 'व्यापार का नाम',
    'form.businessType': 'व्यापार का प्रकार',
    'form.description': 'विवरण',
    'form.submit': 'जमा करें',
    'form.submitting': 'जमा हो रहा है...',
    'form.success': 'सफलतापूर्वक जमा हो गया',
    'form.error': 'त्रुटि हुई, कृपया पुनः प्रयास करें',

    // Admin
    'admin.contacts.title': 'संपर्क जमा',
    'admin.sellers.title': 'विक्रेता आवेदन',
    'admin.status.pending': 'लंबित',
    'admin.status.reviewed': 'समीक्षित',
    'admin.status.responded': 'उत्तर दिया',
    'admin.status.archived': 'संग्रहीत',
  },
  english: {
    // Header
    'announcement.text': '🎉 New Year Special Offer! 20% off on all products',
    'announcement.cta': 'Shop Now',
    'language.toggle': 'English / हिन्दी',

    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.search.placeholder': 'Search products...',
    'nav.cart': 'Cart',
    'nav.account': 'Account',

    // Categories
    'category.seeds': 'Seeds',
    'category.fertilizers': 'Fertilizers',
    'category.chemicals': 'Chemicals',
    'category.tools': 'Tools',

    // Home page
    'home.hero.title': 'Welcome to Ekta Krishi Kendra',
    'home.hero.subtitle':
      "India's trusted source for quality seeds, fertilizers, and crop protection products",
    'home.hero.cta': 'Shop Now',
    'home.bestsellers.title': 'Our Bestsellers',
    'home.bestsellers.subtitle': 'Top-rated products trusted by farmers',
    'home.bestsellers.seeMore': 'See More',
    'home.categories.title': 'Shop by Category',
    'home.categories.subtitle': 'Find products for every farming need',

    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.selectUnit': 'Select Unit',
    'product.quantity': 'Quantity',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.reviews': 'Reviews',
    'product.freeDelivery': 'Free delivery on orders above ₹999',
    'product.returns': '7-day easy returns',
    'product.expertAdvice': 'Expert advice available',
    'product.inclusiveTaxes': 'Inclusive of all taxes',
    'product.off': '% OFF',

    // Category pages
    'category.products.count': 'products',
    'category.sortBy': 'Sort by:',
    'category.sort.featured': 'Featured',
    'category.noProducts': 'No products found in this category.',

    // Footer
    'footer.copyright':
      '© 2025 Ekta Krishi Kendra Keolari. All rights reserved.',
    'footer.phone': '📞 Call to order: 8602074069',
    'footer.company.title': 'Ekta Krishi Kendra',
    'footer.company.description':
      "India's trusted source for quality seeds, fertilizers, and crop protection products",
    'footer.company.address': 'Keolari, District Seoni, Madhya Pradesh',
    'footer.quickLinks.title': 'Quick Links',
    'footer.legal.title': 'Legal',
    'footer.customerService.title': 'Customer Service',
    'footer.business.title': 'Business',
    'footer.social.title': 'Social Media',
    'footer.newsletter.title': 'Newsletter',
    'footer.newsletter.placeholder': 'Your email address',
    'footer.newsletter.subscribe': 'Subscribe',

    // Breadcrumbs
    'breadcrumb.home': 'Home',

    // Additional product details
    'product.category': 'Category',
    'product.subcategory': 'Subcategory',
    'product.availableUnits': 'Available Units',
    'product.rating': 'Rating',
    'product.reviews.count': 'Reviews',

    // Legal Pages
    'legal.terms.title': 'Terms & Conditions',
    'legal.privacy.title': 'Privacy Policy',
    'legal.refund.title': 'Refund & Return Policy',
    'legal.shipping.title': 'Shipping Policy',
    'legal.disclaimer.title': 'Disclaimer',
    'legal.about.title': 'About Us',
    'legal.contact.title': 'Contact Us',

    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.businessName': 'Business Name',
    'form.businessType': 'Business Type',
    'form.description': 'Description',
    'form.submit': 'Submit',
    'form.submitting': 'Submitting...',
    'form.success': 'Successfully submitted',
    'form.error': 'Error occurred, please try again',

    // Admin
    'admin.contacts.title': 'Contact Submissions',
    'admin.sellers.title': 'Seller Applications',
    'admin.status.pending': 'Pending',
    'admin.status.reviewed': 'Reviewed',
    'admin.status.responded': 'Responded',
    'admin.status.archived': 'Archived',
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('hindi') // Default to Hindi
  const [isClient, setIsClient] = useState(false)

  const t = (key) => {
    return translations[language][key] || key
  }

  // Load language preference from localStorage on mount
  useEffect(() => {
    setIsClient(true)

    // Only access localStorage after component mounts (client-side only)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language')
      if (
        savedLanguage &&
        (savedLanguage === 'hindi' || savedLanguage === 'english')
      ) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language, isClient])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
