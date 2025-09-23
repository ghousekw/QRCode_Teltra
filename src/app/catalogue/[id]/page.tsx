"use client"

import { useEffect, useState } from "react"
import { safeFetchJson } from "@/lib/utils"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Image as ImageIcon, FileText, GripVertical } from "lucide-react"
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
  const searchParams = useSearchParams()
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [loading, setLoading] = useState(true)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState("")
  const [previewImageAlt, setPreviewImageAlt] = useState("")
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null)
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null)

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

  // Handle product parameter for individual product QR codes
  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId && catalogue) {
      setHighlightedProductId(productId)
      
      // Scroll to the specific product after a short delay to ensure DOM is ready
      setTimeout(() => {
        const productElement = document.getElementById(`product-${productId}`)
        if (productElement) {
          productElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
          
          // Add a temporary highlight effect
          productElement.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50')
          setTimeout(() => {
            productElement.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50')
          }, 3000)
        }
      }, 500)
    }
  }, [searchParams, catalogue])

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

  const handleDragStart = (e: React.DragEvent, productId: string) => {
    setDraggedProductId(productId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', productId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetProductId: string) => {
    e.preventDefault()
    
    if (!draggedProductId || draggedProductId === targetProductId || !catalogue) {
      setDraggedProductId(null)
      return
    }

    const products = [...catalogue.products]
    const draggedIndex = products.findIndex(p => p.id === draggedProductId)
    const targetIndex = products.findIndex(p => p.id === targetProductId)
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedProductId(null)
      return
    }

    // Remove dragged product and insert at new position
    const [draggedProduct] = products.splice(draggedIndex, 1)
    products.splice(targetIndex, 0, draggedProduct)

    // Update local state immediately for better UX
    setCatalogue({ ...catalogue, products })

    // Update order in database
    try {
      const productIds = products.map(p => p.id)
      await safeFetchJson(`/api/catalogues/${catalogue.id}/products/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ productIds })
      })
      toast.success("Product order updated!")
    } catch (error) {
      console.error('Error updating product order:', error)
      toast.error("Failed to save product order")
    }
    
    setDraggedProductId(null)
  }

  const handleDragEnd = () => {
    setDraggedProductId(null)
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
            
            {highlightedProductId && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  📱 You're viewing a specific product from a QR code. The product is highlighted below.
                </p>
              </div>
            )}
          </div>
        </div>

        {catalogue.products.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">This catalogue doesn't have any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalogue.products.map((product) => (
              <Card 
                key={product.id} 
                id={`product-${product.id}`}
                className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col ${
                  highlightedProductId === product.id 
                    ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                    : ''
                } ${
                  draggedProductId === product.id ? 'opacity-50 scale-95' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, product.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, product.id)}
                onDragEnd={handleDragEnd}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      {product.description && (
                        <CardDescription className="text-sm line-clamp-3">
                          {product.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  {product.image && (
                    <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onClick={() => handleImagePreview(product.image!, product.name)}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5NSAxNDVIMjA1VjE1NUgxOTVWMTQ1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                          e.currentTarget.alt = 'Image failed to load'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="mt-auto">
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
                  </div>
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