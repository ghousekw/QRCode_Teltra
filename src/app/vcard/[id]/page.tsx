"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, Copy, Phone, Mail, MapPin, Globe, Building, User, MessageCircle, Instagram, Facebook, Twitter, Linkedin, Youtube, MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"
import { generateWhatsAppUrl, validatePhoneNumber, formatPhoneDisplay, getFullInternationalNumber } from "@/lib/phone-utils"

interface PhoneNumber {
  id: string
  number: string
  country?: string
  type?: string
}

interface VCard {
  id: string
  firstName: string
  lastName: string
  arabicFirstName?: string
  arabicLastName?: string
  title?: string
  company?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  notes?: string
  qrCodeUrl?: string
  logoUrl?: string
  instagram?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  snapchat?: string
  telegram?: string
  whatsapp?: string
  phoneNumbers?: PhoneNumber[]
}

export default function VCardPage() {
  const params = useParams()
  const [vcard, setVcard] = useState<VCard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchVCard(params.id as string)
    }
  }, [params.id])

  const fetchVCard = async (id: string) => {
    try {
      const response = await fetch(`/api/vcards/${id}`)
      if (response.ok) {
        const data = await response.json()
        setVcard(data)
      } else {
        toast.error("vCard not found")
      }
    } catch (error) {
      console.error("Error fetching vCard:", error)
      toast.error("Error loading vCard")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadVCard = () => {
    if (!vcard) return
    
    const vcardString = generateVCardString(vcard)
    const blob = new Blob([vcardString], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${vcard.firstName}_${vcard.lastName}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("vCard downloaded successfully!")
  }

  const handleShare = async () => {
    if (!vcard) return

    const shareData = {
      title: `${vcard.firstName} ${vcard.lastName} - Digital Business Card`,
      text: `Check out ${vcard.firstName} ${vcard.lastName}'s digital business card`,
      url: window.location.href
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("vCard shared successfully!")
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("vCard URL copied to clipboard!")
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error("Unable to share vCard")
    }
  }

  const handleCopyContact = async () => {
    if (!vcard) return

    const contactInfo = [
      `Name: ${vcard.firstName} ${vcard.lastName}`,
      vcard.title && `Title: ${vcard.title}`,
      vcard.company && `Company: ${vcard.company}`,
      vcard.email && `Email: ${vcard.email}`,
      // Include all phone numbers from phoneNumbers array
      ...(vcard.phoneNumbers && vcard.phoneNumbers.length > 0 
        ? vcard.phoneNumbers.map(phone => `Phone (${phone.type || 'phone'}): ${phone.number}`)
        : vcard.phone ? [`Phone: ${vcard.phone}`] : []
      ),
      vcard.website && `Website: ${vcard.website}`,
      vcard.address && `Address: ${vcard.address}`,
      vcard.city && vcard.state && `City: ${vcard.city}, ${vcard.state}`,
      vcard.country && `Country: ${vcard.country}`,
      vcard.notes && `Notes: ${vcard.notes}`
    ].filter(Boolean).join('\n')

    try {
      await navigator.clipboard.writeText(contactInfo)
      toast.success("Contact information copied to clipboard!")
    } catch (error) {
      console.error('Copy error:', error)
      toast.error("Unable to copy contact information")
    }
  }

  const generateVCardString = (vcard: VCard): string => {
    let vcardString = 'BEGIN:VCARD\n'
    vcardString += 'VERSION:3.0\n'
    vcardString += `FN:${vcard.firstName} ${vcard.lastName}\n`
    vcardString += `N:${vcard.lastName};${vcard.firstName};;;\n`
    
    if (vcard.title) {
      vcardString += `TITLE:${vcard.title}\n`
    }
    
    if (vcard.company) {
      vcardString += `ORG:${vcard.company}\n`
    }
    
    if (vcard.email) {
      vcardString += `EMAIL:${vcard.email}\n`
    }
    
    // Include all phone numbers from phoneNumbers array
    if (vcard.phoneNumbers && vcard.phoneNumbers.length > 0) {
      vcard.phoneNumbers.forEach(phone => {
        const phoneType = phone.type ? `TYPE=${phone.type.toUpperCase()}` : ''
        vcardString += `TEL${phoneType ? ';' + phoneType : ''}:${phone.number}\n`
      })
    } else if (vcard.phone) {
      // Fallback to single phone field if phoneNumbers array is not available
      vcardString += `TEL:${vcard.phone}\n`
    }
    
    if (vcard.website) {
      vcardString += `URL:${vcard.website}\n`
    }
    
    if (vcard.address || vcard.city || vcard.state || vcard.country || vcard.zipCode) {
      let address = ''
      if (vcard.address) address += vcard.address
      if (vcard.city) address += (address ? ', ' : '') + vcard.city
      if (vcard.state) address += (address ? ', ' : '') + vcard.state
      if (vcard.zipCode) address += (address ? ' ' : '') + vcard.zipCode
      if (vcard.country) address += (address ? ', ' : '') + vcard.country
      vcardString += `ADR:;;${address};;;\n`
    }
    
    if (vcard.notes) {
      vcardString += `NOTE:${vcard.notes}\n`
    }
    
    vcardString += 'END:VCARD'
    return vcardString
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vCard...</p>
        </div>
      </div>
    )
  }

  if (!vcard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">vCard Not Found</h1>
          <p className="text-gray-600">The requested vCard could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Professional Contact Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Modern Header with Company Info */}
            <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                {vcard.logoUrl && (
                  <div className="flex justify-center">
                    <img 
                      src={vcard.logoUrl} 
                      alt="Company Logo" 
                      className="h-20 w-auto object-contain drop-shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="p-4">
              {/* Personal Info Section */}
              <div className="text-center mb-4 pb-3 border-b border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {vcard.firstName.charAt(0)}{vcard.lastName.charAt(0)}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {vcard.firstName} {vcard.lastName}
                </h1>
                {(vcard.arabicFirstName || vcard.arabicLastName) && (
                  <h2 className="text-lg font-bold text-gray-800 mb-1" dir="rtl">
                    {vcard.arabicFirstName} {vcard.arabicLastName}
                  </h2>
                )}
                {vcard.title && (
                  <p className="text-sm text-gray-700 font-medium">{vcard.title}</p>
                )}
              </div>
              
              {/* Contact Methods */}
              <div className="space-y-2">
                {vcard.email && (
                  <div className="group p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                        <Mail className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <a 
                          href={`mailto:${vcard.email}`}
                          className="text-gray-900 font-medium hover:text-blue-600 transition-colors text-sm block"
                        >
                          {vcard.email}
                        </a>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {vcard.phoneNumbers && vcard.phoneNumbers.length > 0 ? (
                  vcard.phoneNumbers.map((phone, index) => {
                    const isWhatsApp = phone.type === 'whatsapp'
                    
                    // For WhatsApp numbers, try to generate URL
                    let whatsappUrl: string | null = null
                    let isValidNumber = false
                    
                    if (isWhatsApp) {
                      whatsappUrl = generateWhatsAppUrl(phone.number)
                      isValidNumber = whatsappUrl !== null
                    } else {
                      // For non-WhatsApp numbers, just validate format
                      const validation = validatePhoneNumber(phone.number)
                      isValidNumber = validation.isValid
                    }
                    
                    return (
                      <div key={index} className={`group p-2 rounded-lg transition-all duration-200 border border-transparent ${
                        isWhatsApp 
                          ? 'bg-gray-50 hover:bg-green-50 hover:border-green-200' 
                          : 'bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                            isWhatsApp ? 'bg-green-500 group-hover:bg-green-600' : 'bg-gray-600 group-hover:bg-gray-700'
                          }`}>
                            {isWhatsApp ? (
                              <MessageCircle className="h-3 w-3 text-white" />
                            ) : (
                              <Phone className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <a 
                              href={isWhatsApp && whatsappUrl ? whatsappUrl : `tel:${phone.number}`}
                              className={`font-medium transition-colors text-sm block ${
                                isWhatsApp && whatsappUrl 
                                  ? 'text-gray-900 hover:text-green-600' 
                                  : 'text-gray-900 hover:text-gray-600'
                              }`}
                              target={isWhatsApp && whatsappUrl ? "_blank" : undefined}
                              rel={isWhatsApp && whatsappUrl ? "noopener noreferrer" : undefined}
                              title={isWhatsApp && !isValidNumber ? 'Invalid WhatsApp number format - must be in international format (e.g., +96550123456)' : undefined}
                            >
                              {formatPhoneDisplay(phone.number)}
                            </a>
                            <p className="text-xs text-gray-500">
                              {phone.country && `${phone.country} - `}{phone.type}
                              {isWhatsApp && !isValidNumber && (
                                <span className="text-red-500 ml-1">(Invalid format)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : vcard.phone && (
                  <div className="group p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                        <Phone className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <a 
                          href={`tel:${vcard.phone}`}
                          className="text-gray-900 font-medium hover:text-gray-600 transition-colors text-sm block"
                        >
                          {vcard.phone}
                        </a>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {vcard.website && (
                  <div className="group p-2 rounded-lg bg-gray-50 hover:bg-purple-50 transition-all duration-200 border border-transparent hover:border-purple-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors">
                        <Globe className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <a 
                          href={vcard.website.startsWith('http') ? vcard.website : `https://${vcard.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 font-medium hover:text-purple-600 transition-colors text-sm block"
                        >
                          {vcard.website}
                        </a>
                        <p className="text-xs text-gray-500">Website</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {(vcard.address || vcard.city || vcard.state || vcard.country) && (
                  <div className="group p-2 rounded-lg bg-gray-50 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:bg-red-600 transition-colors">
                        <MapPin className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-900 font-medium text-sm">
                          {vcard.address && <p>{vcard.address}</p>}
                          {(vcard.city || vcard.state) && (
                            <p>{[vcard.city, vcard.state].filter(Boolean).join(', ')}</p>
                          )}
                          {vcard.country && <p>{vcard.country}</p>}
                          {vcard.zipCode && <p>{vcard.zipCode}</p>}
                        </div>
                        <p className="text-xs text-gray-500">Address</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Social Media Links */}
              {(vcard.instagram || vcard.facebook || vcard.twitter || vcard.linkedin || vcard.youtube || vcard.tiktok || vcard.snapchat || vcard.telegram || vcard.whatsapp) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Social Media</h4>
                  <div className="flex flex-wrap gap-2">
                    {vcard.instagram && (
                      <a 
                        href={vcard.instagram.startsWith('http') ? vcard.instagram : `https://instagram.com/${vcard.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                        title="Instagram"
                      >
                        <Instagram className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.facebook && (
                      <a 
                        href={vcard.facebook.startsWith('http') ? vcard.facebook : `https://facebook.com/${vcard.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                        title="Facebook"
                      >
                        <Facebook className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.twitter && (
                      <a 
                        href={vcard.twitter.startsWith('http') ? vcard.twitter : `https://twitter.com/${vcard.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 transition-all duration-200"
                        title="Twitter"
                      >
                        <Twitter className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.linkedin && (
                      <a 
                        href={vcard.linkedin.startsWith('http') ? vcard.linkedin : `https://linkedin.com/in/${vcard.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 hover:bg-blue-800 transition-all duration-200"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.youtube && (
                      <a 
                        href={vcard.youtube.startsWith('http') ? vcard.youtube : `https://youtube.com/@${vcard.youtube.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200"
                        title="YouTube"
                      >
                        <Youtube className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.tiktok && (
                      <a 
                        href={vcard.tiktok.startsWith('http') ? vcard.tiktok : `https://tiktok.com/@${vcard.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-black hover:bg-gray-800 transition-all duration-200"
                        title="TikTok"
                      >
                        <MessageSquare className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.snapchat && (
                      <a 
                        href={vcard.snapchat.startsWith('http') ? vcard.snapchat : `https://snapchat.com/add/${vcard.snapchat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-all duration-200"
                        title="Snapchat"
                      >
                        <MessageSquare className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.telegram && (
                      <a 
                        href={vcard.telegram.startsWith('http') ? vcard.telegram : `https://t.me/${vcard.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                        title="Telegram"
                      >
                        <Send className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {vcard.whatsapp && (
                      <a 
                        href={vcard.whatsapp.startsWith('http') ? vcard.whatsapp : `https://wa.me/${vcard.whatsapp.replace('+', '').replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 transition-all duration-200"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {vcard.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">Notes</h4>
                  <p className="text-gray-700 text-sm">{vcard.notes}</p>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownloadVCard} 
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="text-xs">Download Contact Info</span>
                  </Button>
                  <Button 
                    onClick={handleShare} 
                    variant="outline" 
                    className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600 font-medium py-2 px-3 rounded-lg transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    <span className="text-xs">Share</span>
                  </Button>
                  <Button 
                    onClick={handleCopyContact} 
                    variant="outline" 
                    className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600 font-medium py-2 px-3 rounded-lg transition-all duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    <span className="text-xs">Copy</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Digital Business Card</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {vcard.qrCodeUrl ? (
                <div className="space-y-4">
                  <img 
                    src={vcard.qrCodeUrl} 
                    alt="QR Code" 
                    className="w-64 h-64 mx-auto border rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    Scan this QR code to save contact information to your phone
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = vcard.qrCodeUrl!
                        link.download = `${vcard.firstName}_${vcard.lastName}_qrcode.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        toast.success("QR code downloaded!")
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button 
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(vcard.qrCodeUrl!)
                          toast.success("QR code URL copied!")
                        } catch (error) {
                          toast.error("Unable to copy QR code URL")
                        }
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy QR URL
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">QR code not generated</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
