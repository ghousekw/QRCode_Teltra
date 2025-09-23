"use client"

import { useEffect, useState } from "react"
import { safeFetchJson } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Image as ImageIcon, FileText } from "lucide-react"
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

export default function CataloguePage() {
  const params = useParams()
  const router = useRouter()
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [loading, setLoading] = useState(true)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState("")
  const [previewImageAlt, setPreviewImageAlt] = useState("")

  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        const data = await safeFetchJson(`/api/catalogues/${params.id}`)
        setCatalogue(data)
      } catch (error) {
        console.error('Error loading catalogue', error)
        toast.error("Catalogue not found")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCatalogue()
    }
  }, [params.id, router])

  const handleDownload = (product: Product) => {
    if (product.fileUrl) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading catalogue...</p>
        </div>
      </div>
    )
  }

  if (!catalogue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Catalogue Not Found</h1>
          <p className="text-gray-600 mb-4">The requested catalogue could not be found.</p>
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
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{catalogue.title}</h1>
            <p className="text-lg text-gray-600">{catalogue.description}</p>
            <Badge variant="secondary" className="mt-2">
              {catalogue.products.length} products
            </Badge>
          </div>
        </div>

        {catalogue.products.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">This catalogue doesn't have any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogue.products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.description && (
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  {product.fileUrl && (
                    <Button 
                      onClick={() => handleDownload(product)}
                      className="w-full"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Product
                    </Button>
                  )}
                  
                  {!product.fileUrl && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No download available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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