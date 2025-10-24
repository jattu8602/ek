'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-foreground text-background py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm opacity-80">{t('footer.copyright')}</p>
        <p className="text-sm opacity-80 mt-2">{t('footer.phone')}</p>
      </div>
    </footer>
  )
}
