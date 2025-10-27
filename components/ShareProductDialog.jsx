'use client'

import { useState } from 'react'
import {
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Mail,
  Smartphone,
  Instagram,
  Copy,
  Check,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function ShareProductDialog({ isOpen, onClose, product }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!product) return null

  // Generate product URL
  const productUrl = `${window.location.origin}/product/${product.id}`

  // Calculate discount
  const selectedUnit = product.units?.[0]
  const discountAmount =
    selectedUnit?.actualPrice - selectedUnit?.discountedPrice
  const discountPercent = selectedUnit?.actualPrice
    ? Math.round((discountAmount / selectedUnit.actualPrice) * 100)
    : 0

  // Generate WhatsApp message (special formatting)
  const generateWhatsAppMessage = () => {
    const units =
      product.units?.map((unit) => `${unit.number} ${unit.type}`).join(', ') ||
      'Various sizes'

    return `🛒 *${product.name}*

💰 Price: ₹${selectedUnit?.discountedPrice || 'N/A'}
🔥 Save ₹${discountAmount || 0} (${discountPercent}% OFF!)

✨ Available in: ${units}

🔗 Shop Now: ${productUrl}`
  }

  // Generate general message for other platforms
  const generateGeneralMessage = () => {
    return `🛒 ${product.name}
💰 ₹${selectedUnit?.discountedPrice || 'N/A'} (Save ${discountPercent}%)
🔗 ${productUrl}`
  }

  // Platform-specific share URLs
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      generateWhatsAppMessage()
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      generateGeneralMessage()
    )}&url=${encodeURIComponent(productUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      productUrl
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      productUrl
    )}&text=${encodeURIComponent(generateGeneralMessage())}`,
    email: `mailto:?subject=${encodeURIComponent(
      `Check out ${product.name}`
    )}&body=${encodeURIComponent(generateGeneralMessage())}`,
    sms: `sms:?body=${encodeURIComponent(generateGeneralMessage())}`,
  }

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = productUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Instagram copy message
  const handleInstagramShare = () => {
    copyToClipboard()
    toast({
      title: 'Link copied!',
      description: 'Paste this link in your Instagram story or post.',
    })
  }

  // Platform configurations
  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open(shareUrls.whatsapp, '_blank'),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => window.open(shareUrls.facebook, '_blank'),
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800',
      action: () => window.open(shareUrls.twitter, '_blank'),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => window.open(shareUrls.linkedin, '_blank'),
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.open(shareUrls.telegram, '_blank'),
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => window.open(shareUrls.email, '_blank'),
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: Smartphone,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => window.open(shareUrls.sms, '_blank'),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color:
        'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      action: handleInstagramShare,
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: 'bg-gray-500 hover:bg-gray-600',
      action: copyToClipboard,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Product
          </DialogTitle>
          <DialogDescription>
            Share this amazing product with your friends and family!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
          {platforms.map((platform) => {
            const IconComponent = platform.icon
            return (
              <Button
                key={platform.id}
                variant="outline"
                className={`h-20 flex flex-col gap-2 ${platform.color} text-white border-0 hover:scale-105 transition-all duration-200`}
                onClick={platform.action}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs font-medium">{platform.name}</span>
              </Button>
            )
          })}
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground mb-2">
            Product Preview:
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <div className="font-medium">{product.name}</div>
            <div className="text-muted-foreground">
              ₹{selectedUnit?.discountedPrice || 'N/A'}
              {discountPercent > 0 && (
                <span className="text-green-600 ml-2">
                  (Save {discountPercent}%)
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {productUrl}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
