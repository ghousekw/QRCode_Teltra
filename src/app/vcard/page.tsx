"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, QrCode, User, Edit, Trash2, Share2, Copy, Eye, ExternalLink, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { COUNTRY_CODES, normalizePhoneNumber, validatePhoneNumber, getFullInternationalNumber } from "@/lib/phone-utils"

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
  createdAt: string
  updatedAt: string
}

export default function VCardManager() {
  const [vcards, setVcards] = useState<VCard[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isQRPreviewOpen, setIsQRPreviewOpen] = useState(false)
  const [previewQRUrl, setPreviewQRUrl] = useState("")
  const [previewQRTitle, setPreviewQRTitle] = useState("")
  const [selectedVCard, setSelectedVCard] = useState<VCard | null>(null)
  const [newVCard, setNewVCard] = useState({
    firstName: "",
    lastName: "",
    arabicFirstName: "",
    arabicLastName: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    notes: "",
    logoUrl: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    snapchat: "",
    telegram: "",
    whatsapp: ""
  })
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { id: "", number: "", country: "", type: "office" }
  ])
  const [editVCard, setEditVCard] = useState({
    firstName: "",
    lastName: "",
    arabicFirstName: "",
    arabicLastName: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    notes: "",
    logoUrl: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    snapchat: "",
    telegram: "",
    whatsapp: ""
  })
  const [editPhoneNumbers, setEditPhoneNumbers] = useState<PhoneNumber[]>([
    { id: "", number: "", country: "", type: "office" }
  ])

  useEffect(() => {
    fetchVCards()
  }, [])

  const fetchVCards = async () => {
    try {
      const response = await fetch('/api/vcards')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setVcards(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching vCards:", error)
      toast.error("Error loading vCards")
      setVcards([]) // Ensure vcards is always an array
    }
  }

  const handleCreateVCard = async () => {
    if (!newVCard.firstName || !newVCard.lastName) {
      toast.error("First name and last name are required")
      return
    }

    try {
      // Process phone numbers to include full international format
      const processedPhoneNumbers = phoneNumbers
        .filter(pn => pn.number.trim())
        .map(pn => {
          const selectedCountry = COUNTRY_CODES.find(c => c.name === pn.country)
          const countryCode = selectedCountry?.code
          const fullNumber = countryCode ? getFullInternationalNumber(pn.number, countryCode) : pn.number
          
          return {
            ...pn,
            number: fullNumber
          }
        })

      const vcard = await fetch('/api/vcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVCard,
          phoneNumbers: processedPhoneNumbers
        })
      }).then(res => res.json())
      
      setVcards([vcard, ...vcards])
      setNewVCard({
        firstName: "",
        lastName: "",
        arabicFirstName: "",
        arabicLastName: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        notes: "",
        logoUrl: "",
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        snapchat: "",
        telegram: "",
        whatsapp: ""
      })
      setPhoneNumbers([{ id: "", number: "", country: "", type: "office" }])
      setIsCreateDialogOpen(false)
      toast.success("vCard created successfully!")
    } catch (error: any) {
      console.error("Error creating vCard:", error)
      toast.error(error?.message || "Error creating vCard")
    }
  }

  const handleEditVCard = (vcard: VCard) => {
    setSelectedVCard(vcard)
    setEditVCard({
      firstName: vcard.firstName,
      lastName: vcard.lastName,
      arabicFirstName: vcard.arabicFirstName || "",
      arabicLastName: vcard.arabicLastName || "",
      title: vcard.title || "",
      company: vcard.company || "",
      email: vcard.email || "",
      phone: vcard.phone || "",
      website: vcard.website || "",
      address: vcard.address || "",
      city: vcard.city || "",
      state: vcard.state || "",
      country: vcard.country || "",
      zipCode: vcard.zipCode || "",
      notes: vcard.notes || "",
      logoUrl: vcard.logoUrl || "",
      instagram: vcard.instagram || "",
      facebook: vcard.facebook || "",
      twitter: vcard.twitter || "",
      linkedin: vcard.linkedin || "",
      youtube: vcard.youtube || "",
      tiktok: vcard.tiktok || "",
      snapchat: vcard.snapchat || "",
      telegram: vcard.telegram || "",
      whatsapp: vcard.whatsapp || ""
    })
    // Populate editPhoneNumbers with existing phone numbers or default
    if (vcard.phoneNumbers && vcard.phoneNumbers.length > 0) {
      setEditPhoneNumbers(vcard.phoneNumbers)
    } else if (vcard.phone) {
      setEditPhoneNumbers([{ id: "", number: vcard.phone, country: "", type: "office" }])
    } else {
      setEditPhoneNumbers([{ id: "", number: "", country: "", type: "office" }])
    }
    setIsEditDialogOpen(true)
  }

  const handleUpdateVCard = async () => {
    if (!selectedVCard || !editVCard.firstName || !editVCard.lastName) {
      toast.error("First name and last name are required")
      return
    }

    try {
      // Process phone numbers to include full international format
      const processedPhoneNumbers = editPhoneNumbers
        .filter(pn => pn.number.trim())
        .map(pn => {
          const selectedCountry = COUNTRY_CODES.find(c => c.name === pn.country)
          const countryCode = selectedCountry?.code
          const fullNumber = countryCode ? getFullInternationalNumber(pn.number, countryCode) : pn.number
          
          return {
            ...pn,
            number: fullNumber
          }
        })

      const updatedVCard = await fetch(`/api/vcards/${selectedVCard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editVCard,
          phoneNumbers: processedPhoneNumbers
        })
      }).then(res => res.json())
      
      setVcards(Array.isArray(vcards) ? vcards.map(v => v.id === selectedVCard.id ? updatedVCard : v) : [updatedVCard])
      setIsEditDialogOpen(false)
      setSelectedVCard(null)
      setEditVCard({
        firstName: "",
        lastName: "",
        arabicFirstName: "",
        arabicLastName: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        notes: "",
        logoUrl: "",
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        snapchat: "",
        telegram: "",
        whatsapp: ""
      })
      setEditPhoneNumbers([{ id: "", number: "", country: "", type: "office" }])
      toast.success("vCard updated successfully!")
    } catch (error: any) {
      console.error('Error updating vCard', error)
      toast.error(error?.message || "Error updating vCard")
    }
  }

  const handleDeleteVCard = async (vcardId: string) => {
    if (!confirm("Are you sure you want to delete this vCard?")) {
      return
    }

    try {
      await fetch(`/api/vcards/${vcardId}`, { method: "DELETE" })
      setVcards(Array.isArray(vcards) ? vcards.filter(v => v.id !== vcardId) : [])
      toast.success("vCard deleted successfully!")
    } catch (error) {
      toast.error("Error deleting vCard")
    }
  }

  const handleGenerateQRCode = async (vcardId: string) => {
    try {
      console.log("Generating QR code for vCard ID:", vcardId)
      const response = await fetch(`/api/vcards/${vcardId}/qrcode`, { method: 'POST' })
      console.log("QR code API response status:", response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("QR code generated successfully:", data)
      
      setVcards(Array.isArray(vcards) ? vcards.map(v => 
        v.id === vcardId ? { ...v, qrCodeUrl: data.qrCodeUrl } : v
      ) : [])
      toast.success("QR code generated successfully!")
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Error generating QR code")
    }
  }

  const handlePreviewQRCode = (qrCodeUrl: string, vcardName: string) => {
    setPreviewQRUrl(qrCodeUrl)
    setPreviewQRTitle(vcardName)
    setIsQRPreviewOpen(true)
  }

  const handleDownloadQRCode = (qrCodeUrl: string, vcardName: string) => {
    try {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `${vcardName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("QR code downloaded successfully!")
    } catch (error) {
      toast.error("Error downloading QR code")
    }
  }

  const handleShareVCard = async (vcard: VCard) => {
    const vcardUrl = `${window.location.origin}/vcard/${vcard.id}`
    
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({
        title: `${vcard.firstName} ${vcard.lastName} - Digital Business Card`,
        text: `Check out ${vcard.firstName} ${vcard.lastName}'s digital business card`,
        url: vcardUrl
      })) {
        await navigator.share({
          title: `${vcard.firstName} ${vcard.lastName} - Digital Business Card`,
          text: `Check out ${vcard.firstName} ${vcard.lastName}'s digital business card`,
          url: vcardUrl
        })
        toast.success("vCard shared successfully!")
      } else {
        await navigator.clipboard.writeText(vcardUrl)
        toast.success("vCard URL copied to clipboard!")
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error("Error sharing vCard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Digital Business Cards</h1>
          <p className="text-lg text-gray-600">Create virtual vCards with QR codes and company logos</p>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Create New vCard
          </Button>
        </div>

        {isCreateDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Create New vCard</h2>
                  <button
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Create a digital business card with QR code</p>
                
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact & Company</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                        <Input
                          id="firstName"
                          value={newVCard.firstName}
                          onChange={(e) => setNewVCard({ ...newVCard, firstName: e.target.value })}
                          placeholder="Enter first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={newVCard.lastName}
                          onChange={(e) => setNewVCard({ ...newVCard, lastName: e.target.value })}
                          placeholder="Enter last name"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="arabicFirstName" className="text-sm font-medium text-gray-700">Arabic First Name</Label>
                        <Input
                          id="arabicFirstName"
                          value={newVCard.arabicFirstName}
                          onChange={(e) => setNewVCard({ ...newVCard, arabicFirstName: e.target.value })}
                          placeholder="الاسم الأول"
                          className="mt-1"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="arabicLastName" className="text-sm font-medium text-gray-700">Arabic Last Name</Label>
                        <Input
                          id="arabicLastName"
                          value={newVCard.arabicLastName}
                          onChange={(e) => setNewVCard({ ...newVCard, arabicLastName: e.target.value })}
                          placeholder="الاسم الأخير"
                          className="mt-1"
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">Job Title</Label>
                      <Input
                        id="title"
                        value={newVCard.title}
                        onChange={(e) => setNewVCard({ ...newVCard, title: e.target.value })}
                        placeholder="e.g., Chief Operations Officer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
                      <Input
                        id="company"
                        value={newVCard.company}
                        onChange={(e) => setNewVCard({ ...newVCard, company: e.target.value })}
                        placeholder="e.g., TELTRA"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-700">Company Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={newVCard.logoUrl}
                        onChange={(e) => setNewVCard({ ...newVCard, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newVCard.email}
                        onChange={(e) => setNewVCard({ ...newVCard, email: e.target.value })}
                        placeholder="barrak@teltra.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                      <Input
                        id="phone"
                        value={newVCard.phone}
                        onChange={(e) => setNewVCard({ ...newVCard, phone: e.target.value })}
                        placeholder="+964 785 666 888 7"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                      <Input
                        id="website"
                        value={newVCard.website}
                        onChange={(e) => setNewVCard({ ...newVCard, website: e.target.value })}
                        placeholder="https://teltra.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Phone Numbers</Label>
                      <div className="space-y-3 mt-2">
                        {phoneNumbers.map((phone, index) => {
                          const selectedCountry = COUNTRY_CODES.find(c => c.name === phone.country)
                          const countryCode = selectedCountry?.code
                          const validation = validatePhoneNumber(phone.number, countryCode)
                          return (
                            <div key={index} className="flex gap-3">
                              <div className="w-40">
                                <Select
                                  value={phone.country}
                                  onValueChange={(value) => {
                                    const newPhones = [...phoneNumbers]
                                    newPhones[index].country = value
                                    setPhoneNumbers(newPhones)
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Country" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60">
                                    {COUNTRY_CODES.map((country, idx) => (
                                      <SelectItem key={`${country.code}-${country.name}-${idx}`} value={country.name}>
                                        {country.flag} {country.name} ({country.code})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={phone.number}
                                  onChange={(e) => {
                                    const newPhones = [...phoneNumbers]
                                    newPhones[index].number = e.target.value
                                    setPhoneNumbers(newPhones)
                                  }}
                                  placeholder={selectedCountry ? 
                                    (selectedCountry.name === 'Kuwait' ? 
                                      `e.g., 50123456 (${selectedCountry.code} will be added automatically)` : 
                                      `e.g., 51500000 (${selectedCountry.code} will be added automatically)`
                                    ) : "Enter phone number"}
                                  className={`mt-1 ${!validation.isValid && phone.number ? 'border-red-500' : ''}`}
                                />
                                {!validation.isValid && phone.number && (
                                  <p className="text-xs text-red-500 mt-1">{validation.error}</p>
                                )}
                                {selectedCountry && phone.number && validation.isValid && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Full number: {getFullInternationalNumber(phone.number, countryCode!)}
                                  </p>
                                )}
                              </div>
                              <div className="w-24">
                                <select
                                  value={phone.type}
                                  onChange={(e) => {
                                    const newPhones = [...phoneNumbers]
                                    newPhones[index].type = e.target.value
                                    setPhoneNumbers(newPhones)
                                  }}
                                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                  <option value="office">Office</option>
                                  <option value="mobile">Mobile</option>
                                  <option value="whatsapp">WhatsApp</option>
                                  <option value="fax">Fax</option>
                                  <option value="home">Home</option>
                                </select>
                              </div>
                              {phoneNumbers.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))
                                  }}
                                  className="mt-1"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          )
                        })}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPhoneNumbers([...phoneNumbers, { id: "", number: "", country: "", type: "office" }])
                          }}
                        >
                          Add Phone Number
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                      <Input
                        id="address"
                        value={newVCard.address}
                        onChange={(e) => setNewVCard({ ...newVCard, address: e.target.value })}
                        placeholder="Street address"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                        <Input
                          id="city"
                          value={newVCard.city}
                          onChange={(e) => setNewVCard({ ...newVCard, city: e.target.value })}
                          placeholder="City"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                        <Input
                          id="state"
                          value={newVCard.state}
                          onChange={(e) => setNewVCard({ ...newVCard, state: e.target.value })}
                          placeholder="State"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={newVCard.zipCode}
                          onChange={(e) => setNewVCard({ ...newVCard, zipCode: e.target.value })}
                          placeholder="ZIP"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                      <Input
                        id="country"
                        value={newVCard.country}
                        onChange={(e) => setNewVCard({ ...newVCard, country: e.target.value })}
                        placeholder="Country"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newVCard.notes}
                        onChange={(e) => setNewVCard({ ...newVCard, notes: e.target.value })}
                        placeholder="Additional notes or information"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">Instagram</Label>
                        <Input
                          id="instagram"
                          value={newVCard.instagram}
                          onChange={(e) => setNewVCard({ ...newVCard, instagram: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">Facebook</Label>
                        <Input
                          id="facebook"
                          value={newVCard.facebook}
                          onChange={(e) => setNewVCard({ ...newVCard, facebook: e.target.value })}
                          placeholder="username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitter" className="text-sm font-medium text-gray-700">Twitter / X</Label>
                        <Input
                          id="twitter"
                          value={newVCard.twitter}
                          onChange={(e) => setNewVCard({ ...newVCard, twitter: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={newVCard.linkedin}
                          onChange={(e) => setNewVCard({ ...newVCard, linkedin: e.target.value })}
                          placeholder="username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="youtube" className="text-sm font-medium text-gray-700">YouTube</Label>
                        <Input
                          id="youtube"
                          value={newVCard.youtube}
                          onChange={(e) => setNewVCard({ ...newVCard, youtube: e.target.value })}
                          placeholder="@channel or full URL"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tiktok" className="text-sm font-medium text-gray-700">TikTok</Label>
                        <Input
                          id="tiktok"
                          value={newVCard.tiktok}
                          onChange={(e) => setNewVCard({ ...newVCard, tiktok: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="snapchat" className="text-sm font-medium text-gray-700">Snapchat</Label>
                        <Input
                          id="snapchat"
                          value={newVCard.snapchat}
                          onChange={(e) => setNewVCard({ ...newVCard, snapchat: e.target.value })}
                          placeholder="username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telegram" className="text-sm font-medium text-gray-700">Telegram</Label>
                        <Input
                          id="telegram"
                          value={newVCard.telegram}
                          onChange={(e) => setNewVCard({ ...newVCard, telegram: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={newVCard.whatsapp}
                        onChange={(e) => setNewVCard({ ...newVCard, whatsapp: e.target.value })}
                        placeholder="+1234567890"
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-3 pt-6">
                  <Button 
                    onClick={handleCreateVCard} 
                    className="flex-1"
                    disabled={!newVCard.firstName || !newVCard.lastName}
                  >
                    Create vCard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditDialogOpen && selectedVCard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Edit vCard</h2>
                  <button
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setSelectedVCard(null)
                      setEditVCard({
                        firstName: "",
                        lastName: "",
                        arabicFirstName: "",
                        arabicLastName: "",
                        title: "",
                        company: "",
                        email: "",
                        phone: "",
                        website: "",
                        address: "",
                        city: "",
                        state: "",
                        country: "",
                        zipCode: "",
                        notes: "",
                        logoUrl: "",
                        instagram: "",
                        facebook: "",
                        twitter: "",
                        linkedin: "",
                        youtube: "",
                        tiktok: "",
                        snapchat: "",
                        telegram: "",
                        whatsapp: ""
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Update the vCard information</p>
                
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact & Company</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editFirstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                        <Input
                          id="editFirstName"
                          value={editVCard.firstName}
                          onChange={(e) => setEditVCard({ ...editVCard, firstName: e.target.value })}
                          placeholder="Enter first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editLastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                        <Input
                          id="editLastName"
                          value={editVCard.lastName}
                          onChange={(e) => setEditVCard({ ...editVCard, lastName: e.target.value })}
                          placeholder="Enter last name"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editArabicFirstName" className="text-sm font-medium text-gray-700">Arabic First Name</Label>
                        <Input
                          id="editArabicFirstName"
                          value={editVCard.arabicFirstName}
                          onChange={(e) => setEditVCard({ ...editVCard, arabicFirstName: e.target.value })}
                          placeholder="الاسم الأول"
                          className="mt-1"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editArabicLastName" className="text-sm font-medium text-gray-700">Arabic Last Name</Label>
                        <Input
                          id="editArabicLastName"
                          value={editVCard.arabicLastName}
                          onChange={(e) => setEditVCard({ ...editVCard, arabicLastName: e.target.value })}
                          placeholder="الاسم الأخير"
                          className="mt-1"
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="editTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                      <Input
                        id="editTitle"
                        value={editVCard.title}
                        onChange={(e) => setEditVCard({ ...editVCard, title: e.target.value })}
                        placeholder="e.g., Chief Operations Officer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCompany" className="text-sm font-medium text-gray-700">Company</Label>
                      <Input
                        id="editCompany"
                        value={editVCard.company}
                        onChange={(e) => setEditVCard({ ...editVCard, company: e.target.value })}
                        placeholder="e.g., TELTRA"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editLogoUrl" className="text-sm font-medium text-gray-700">Company Logo URL</Label>
                      <Input
                        id="editLogoUrl"
                        value={editVCard.logoUrl}
                        onChange={(e) => setEditVCard({ ...editVCard, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="editEmail" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editVCard.email}
                        onChange={(e) => setEditVCard({ ...editVCard, email: e.target.value })}
                        placeholder="barrak@teltra.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Phone Numbers</Label>
                      <div className="space-y-3 mt-2">
                        {editPhoneNumbers.map((phone, index) => {
                          const selectedCountry = COUNTRY_CODES.find(c => c.name === phone.country)
                          const countryCode = selectedCountry?.code
                          const validation = validatePhoneNumber(phone.number, countryCode)
                          return (
                            <div key={index} className="flex gap-3">
                              <div className="w-40">
                                <Select
                                  value={phone.country}
                                  onValueChange={(value) => {
                                    const newPhones = [...editPhoneNumbers]
                                    newPhones[index].country = value
                                    setEditPhoneNumbers(newPhones)
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Country" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60">
                                    {COUNTRY_CODES.map((country, idx) => (
                                      <SelectItem key={`${country.code}-${country.name}-${idx}`} value={country.name}>
                                        {country.flag} {country.name} ({country.code})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={phone.number}
                                  onChange={(e) => {
                                    const newPhones = [...editPhoneNumbers]
                                    newPhones[index].number = e.target.value
                                    setEditPhoneNumbers(newPhones)
                                  }}
                                  placeholder={selectedCountry ? 
                                    (selectedCountry.name === 'Kuwait' ? 
                                      `e.g., 50123456 (${selectedCountry.code} will be added automatically)` : 
                                      `e.g., 5150000 (${selectedCountry.code} will be added automatically)`
                                    ) : "Enter phone number"}
                                  className={`mt-1 ${!validation.isValid && phone.number ? 'border-red-500' : ''}`}
                                />
                                {!validation.isValid && phone.number && (
                                  <p className="text-xs text-red-500 mt-1">{validation.error}</p>
                                )}
                                {selectedCountry && phone.number && validation.isValid && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Full number: {getFullInternationalNumber(phone.number, countryCode!)}
                                  </p>
                                )}
                              </div>
                              <div className="w-24">
                                <Select
                                  value={phone.type}
                                  onValueChange={(value) => {
                                    const newPhones = [...editPhoneNumbers]
                                    newPhones[index].type = value
                                    setEditPhoneNumbers(newPhones)
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="office">Office</SelectItem>
                                    <SelectItem value="mobile">Mobile</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="fax">Fax</SelectItem>
                                    <SelectItem value="home">Home</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newPhones = editPhoneNumbers.filter((_, i) => i !== index)
                                  setEditPhoneNumbers(newPhones)
                                }}
                                className="mt-1"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditPhoneNumbers([...editPhoneNumbers, { id: "", number: "", country: "", type: "office" }])}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Phone Number
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="editWebsite" className="text-sm font-medium text-gray-700">Website</Label>
                      <Input
                        id="editWebsite"
                        value={editVCard.website}
                        onChange={(e) => setEditVCard({ ...editVCard, website: e.target.value })}
                        placeholder="https://teltra.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editAddress" className="text-sm font-medium text-gray-700">Address</Label>
                      <Input
                        id="editAddress"
                        value={editVCard.address}
                        onChange={(e) => setEditVCard({ ...editVCard, address: e.target.value })}
                        placeholder="Street address"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="editCity" className="text-sm font-medium text-gray-700">City</Label>
                        <Input
                          id="editCity"
                          value={editVCard.city}
                          onChange={(e) => setEditVCard({ ...editVCard, city: e.target.value })}
                          placeholder="City"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editState" className="text-sm font-medium text-gray-700">State</Label>
                        <Input
                          id="editState"
                          value={editVCard.state}
                          onChange={(e) => setEditVCard({ ...editVCard, state: e.target.value })}
                          placeholder="State"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editZipCode" className="text-sm font-medium text-gray-700">ZIP Code</Label>
                        <Input
                          id="editZipCode"
                          value={editVCard.zipCode}
                          onChange={(e) => setEditVCard({ ...editVCard, zipCode: e.target.value })}
                          placeholder="ZIP"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="editCountry" className="text-sm font-medium text-gray-700">Country</Label>
                      <Input
                        id="editCountry"
                        value={editVCard.country}
                        onChange={(e) => setEditVCard({ ...editVCard, country: e.target.value })}
                        placeholder="Country"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editNotes" className="text-sm font-medium text-gray-700">Notes</Label>
                      <Textarea
                        id="editNotes"
                        value={editVCard.notes}
                        onChange={(e) => setEditVCard({ ...editVCard, notes: e.target.value })}
                        placeholder="Additional notes or information"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editInstagram" className="text-sm font-medium text-gray-700">Instagram</Label>
                        <Input
                          id="editInstagram"
                          value={editVCard.instagram}
                          onChange={(e) => setEditVCard({ ...editVCard, instagram: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editFacebook" className="text-sm font-medium text-gray-700">Facebook</Label>
                        <Input
                          id="editFacebook"
                          value={editVCard.facebook}
                          onChange={(e) => setEditVCard({ ...editVCard, facebook: e.target.value })}
                          placeholder="username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editTwitter" className="text-sm font-medium text-gray-700">Twitter / X</Label>
                        <Input
                          id="editTwitter"
                          value={editVCard.twitter}
                          onChange={(e) => setEditVCard({ ...editVCard, twitter: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editLinkedin" className="text-sm font-medium text-gray-700">LinkedIn</Label>
                        <Input
                          id="editLinkedin"
                          value={editVCard.linkedin}
                          onChange={(e) => setEditVCard({ ...editVCard, linkedin: e.target.value })}
                          placeholder="username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editYoutube" className="text-sm font-medium text-gray-700">YouTube</Label>
                        <Input
                          id="editYoutube"
                          value={editVCard.youtube}
                          onChange={(e) => setEditVCard({ ...editVCard, youtube: e.target.value })}
                          placeholder="@channel or full URL"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editTiktok" className="text-sm font-medium text-gray-700">TikTok</Label>
                        <Input
                          id="editTiktok"
                          value={editVCard.tiktok}
                          onChange={(e) => setEditVCard({ ...editVCard, tiktok: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editSnapchat" className="text-sm font-medium text-gray-700">Snapchat</Label>
                        <Input
                          id="editSnapchat"
                          value={editVCard.snapchat}
                          onChange={(e) => setEditVCard({ ...editVCard, snapchat: e.target.value })}
                          placeholder="username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editTelegram" className="text-sm font-medium text-gray-700">Telegram</Label>
                        <Input
                          id="editTelegram"
                          value={editVCard.telegram}
                          onChange={(e) => setEditVCard({ ...editVCard, telegram: e.target.value })}
                          placeholder="@username or full URL"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="editWhatsapp" className="text-sm font-medium text-gray-700">WhatsApp</Label>
                      <Input
                        id="editWhatsapp"
                        value={editVCard.whatsapp}
                        onChange={(e) => setEditVCard({ ...editVCard, whatsapp: e.target.value })}
                        placeholder="+1234567890"
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-3 pt-6">
                  <Button 
                    onClick={handleUpdateVCard} 
                    className="flex-1"
                    disabled={!editVCard.firstName || !editVCard.lastName}
                  >
                    Update vCard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setSelectedVCard(null)
                      setEditVCard({
                        firstName: "",
                        lastName: "",
                        arabicFirstName: "",
                        arabicLastName: "",
                        title: "",
                        company: "",
                        email: "",
                        phone: "",
                        website: "",
                        address: "",
                        city: "",
                        state: "",
                        country: "",
                        zipCode: "",
                        notes: "",
                        logoUrl: "",
                        instagram: "",
                        facebook: "",
                        twitter: "",
                        linkedin: "",
                        youtube: "",
                        tiktok: "",
                        snapchat: "",
                        telegram: "",
                        whatsapp: ""
                      })
                      setEditPhoneNumbers([{ id: "", number: "", country: "", type: "office" }])
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!vcards || vcards.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vCards yet</h3>
            <p className="text-gray-600 mb-4">Create your first digital business card to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(vcards) && vcards.map((vcard) => (
              <Card key={vcard.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {vcard.firstName} {vcard.lastName}
                        {vcard.title && (
                          <Badge variant="secondary">{vcard.title}</Badge>
                        )}
                      </CardTitle>
                      {vcard.company && (
                        <p className="text-sm text-gray-600">{vcard.company}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVCard(vcard)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVCard(vcard.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    {vcard.qrCodeUrl ? (
                      <div className="relative group">
                        <img 
                          src={vcard.qrCodeUrl} 
                          alt="QR Code" 
                          className="w-32 h-32 border rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handlePreviewQRCode(vcard.qrCodeUrl!, `${vcard.firstName} ${vcard.lastName}`)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateQRCode(vcard.id)}
                        className="flex-1"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        {vcard.qrCodeUrl ? "Regenerate QR" : "Generate QR"}
                      </Button>
                    </div>
                    
                    {vcard.qrCodeUrl && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadQRCode(vcard.qrCodeUrl!, `${vcard.firstName} ${vcard.lastName}`)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareVCard(vcard)}
                          className="flex-1"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    )}
                    
                    <Link href={`/vcard/${vcard.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View vCard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* QR Code Preview Modal */}
        {isQRPreviewOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-2xl max-h-[90vh] w-full">
              <button
                onClick={() => setIsQRPreviewOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{previewQRTitle} - QR Code</h3>
                  <div className="flex justify-center mb-6">
                    <img
                      src={previewQRUrl}
                      alt="QR Code"
                      className="w-64 h-64 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = previewQRUrl
                        link.download = `${previewQRTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        toast.success("QR code downloaded successfully!")
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          if (navigator.clipboard && window.isSecureContext) {
                            await navigator.clipboard.writeText(previewQRUrl)
                            toast.success("QR code URL copied to clipboard!")
                          } else {
                            const textArea = document.createElement('textarea')
                            textArea.value = previewQRUrl
                            textArea.style.position = 'fixed'
                            textArea.style.left = '-999999px'
                            textArea.style.top = '-999999px'
                            document.body.appendChild(textArea)
                            textArea.focus()
                            textArea.select()
                            
                            try {
                              document.execCommand('copy')
                              toast.success("QR code URL copied to clipboard!")
                            } catch (err) {
                              toast.error("Unable to copy URL. Please copy manually: " + previewQRUrl)
                            } finally {
                              document.body.removeChild(textArea)
                            }
                          }
                        } catch (error) {
                          console.error('Copy error:', error)
                          toast.error("Error copying QR code URL")
                        }
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Image URL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
