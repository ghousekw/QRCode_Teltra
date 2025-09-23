"use client"

import { useEffect, useState } from "react"
import { safeFetchJson } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Image as ImageIcon, FileText, QrCode, Share2, Copy } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  image?: string
  fileUrl?: string
}

interface Catalogue {
  id: string
  title: string
  description: string
  products: Product[]
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState("")
  const [previewImageAlt, setPreviewImageAlt] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catalogueData = await safeFetchJson(`/api/catalogues/${params.id}`)
        setCatalogue(catalogueData)
        
        // Find the specific product
        const foundProduct = catalogueData.products.find((p: Product) => p.id === params.productId)
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          toast.error("Product not found")
          router.push(`/catalogue/${params.id}`)
        }
      } catch (error) {
        console.error('Error loading data', error)
        toast.error("Product not found")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (params.id && params.productId) {
      fetchData()
    }
  }, [params.id, params.productId, router])

  const handleDownload = () => {
    if (product?.fileUrl) {
      window.open(product.fileUrl, '_blank')
    } else {
      toast.error("No download file available for this product")
    }
  }

  const handleImagePreview = (imageUrl: string, imageAlt: string) => {
    setPreviewImageUrl(imageUrl)
    setPreviewImageAlt(imageAlt)
    setIsImagePreviewOpen(true)
  }

  const handleCopyProductUrl = async () => {
    const productUrl = window.location.href
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(productUrl)
        toast.success("Product URL copied to clipboard!")
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = productUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          toast.success("Product URL copied to clipboard!")
        } catch (err) {
          toast.error("Unable to copy URL. Please copy manually: " + productUrl)
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (error) {
      console.error('Copy error:', error)
      toast.error("Error copying product URL")
    }
  }

  const handleShare = async () => {
    const productUrl = window.location.href
    const shareData = {
      title: `${product?.name} - ${catalogue?.title}`,
      text: `Check out this product: ${product?.name}`,
      url: productUrl
    }
    
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Product shared successfully!")
      } else {
        // Fallback: copy URL to clipboard
        await handleCopyProductUrl()
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error("Unable to share. URL copied to clipboard instead.")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product || !catalogue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The requested product could not be found.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/catalogue/${catalogue.id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              View All Products
            </Button>
          </div>
          
          <div className="text-center">
            <Badge variant="secondary" className="mb-2">
              {catalogue.title}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{product.description}</p>
            )}
          </div>
        </div>

        {/* Product Card */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Product Image */}
              {product.image && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onClick={() => handleImagePreview(product.image!, product.name)}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5NSAxNDVIMjA1VjE1NUgxOTVWMTQ1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                      e.currentTarget.alt = 'Image failed to load'
                    }}
                  />
                </div>
              )}

              {/* Product Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {product.fileUrl && (
                  <Button 
                    onClick={handleDownload}
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Product
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={handleCopyProductUrl}
                  className="flex-1"
                  size="lg"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copy URL
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                  size="lg"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>

              {/* QR Code Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">QR Code Access</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  This product was accessed via QR code. You can share this direct link or generate a new QR code for this specific product.
                </p>
              </div>

              {/* No Download Available */}
              {!product.fileUrl && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No download file available for this product</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setIsImagePreviewOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={previewImageUrl}
                alt={previewImageAlt}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5NSAxNDVIMjA1VjE1NUgxOTVWMTQ1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                  e.currentTarget.alt = 'Image failed to load'
                }}
              />
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-sm text-gray-600 text-center">{previewImageAlt}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
