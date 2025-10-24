'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const TopAnnouncementBar = () => {
  const { language, setLanguage, t } = useLanguage()

  const announcements =
    language === 'hindi'
      ? 'ऑनलाइन भुगतान पर अतिरिक्त छूट! ✨ दिवाली सेल लाइव है! ✨ ऑर्डर के लिए कॉल करें: 8602074069 ✨ भारत का #1 खाद बीज शॉप ✨ '
      : "Extra discount on online payment! ✨ Diwali Sale is LIVE! ✨ Call to order: 8602074069 ✨ India's #1 Khaad Beej Shop ✨ "

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden relative">
      <div className="flex items-center">
        {/* Scrolling content */}
        <div className="flex animate-scroll">
          <span className="text-sm font-medium whitespace-nowrap px-4">
            {announcements}
          </span>
          <span className="text-sm font-medium whitespace-nowrap px-4">
            {announcements}
          </span>
          <span className="text-sm font-medium whitespace-nowrap px-4">
            {announcements}
          </span>
        </div>

        {/* Language toggle dropdown */}
        <div className="absolute right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="  h-8 px-3 bg-[#84940A] hover:bg-[#84940A]/80"
              >
                <Globe size={16} className="mr-2" />
                <span className="text-sm font-medium">
                  {language === 'hindi' ? 'हिंदी' : 'English'}
                </span>
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-background border border-border shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => setLanguage('hindi')}
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  language === 'hindi' ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <span className="text-lg">🇮🇳</span>
                <span className="ml-2">हिंदी</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('english')}
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  language === 'english'
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }`}
              >
                <span className="text-lg">🇺🇸</span>
                <span className="ml-2">English</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default TopAnnouncementBar
