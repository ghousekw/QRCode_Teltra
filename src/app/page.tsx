"use client"

import { useState, useEffect } from "react"
import { safeFetchJson } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, QrCode, Package, Image as ImageIcon, Edit, Trash2 } from "lucide-react"
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
  qrCodeUrl?: string
}

export default function Home() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditCatalogueDialogOpen, setIsEditCatalogueDialogOpen] = useState(false)
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState("")
  const [previewImageAlt, setPreviewImageAlt] = useState("")
  const [selectedCatalogue, setSelectedCatalogue] = useState<Catalogue | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newCatalogue, setNewCatalogue] = useState({
    title: "",
    description: ""
  })
  const [editCatalogue, setEditCatalogue] = useState({
    title: "",
    description: ""
  })
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    fileUrl: "",
    image: ""
  })
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    fileUrl: "",
    image: ""
  })

  useEffect(() => {
    fetchCatalogues()
  }, [])

  const fetchCatalogues = async () => {
    try {
      const data = await safeFetchJson('/api/catalogues')
      setCatalogues(data)
    } catch (error) {
      console.error("Error fetching catalogues:", error)
    }
  }

  const handleCreateCatalogue = async () => {
    if (!newCatalogue.title || !newCatalogue.description) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const catalogue = await safeFetchJson('/api/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCatalogue)
      })
      setCatalogues([...catalogues, catalogue])
      setNewCatalogue({ title: "", description: "" })
      setIsCreateDialogOpen(false)
      toast.success("Catalogue created successfully!")
    } catch (error: any) {
      console.error("Error creating catalogue:", error)
      toast.error(error?.message || "Error creating catalogue")
    }
  }

  const handleAddProduct = async () => {
    if (!selectedCatalogue || !newProduct.name) {
      toast.error("Please fill in the product name")
      return
    }

    try {
      const product = await safeFetchJson(`/api/catalogues/${selectedCatalogue.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      })
      const updatedCatalogues = catalogues.map(cat => 
        cat.id === selectedCatalogue.id 
          ? { ...cat, products: [...cat.products, product] }
          : cat
      )
      setCatalogues(updatedCatalogues)
      setNewProduct({ name: "", description: "", fileUrl: "", image: "" })
      setIsAddProductDialogOpen(false)
      toast.success("Product added successfully!")
    } catch (error: any) {
      console.error('Error adding product', error)
      toast.error(error?.message || "Error adding product")
    }
  }

  const handleEditProduct = (catalogue: Catalogue, product: Product) => {
    setSelectedCatalogue(catalogue)
    setSelectedProduct(product)
    setEditProduct({
      name: product.name,
      description: product.description || "",
      fileUrl: product.fileUrl || "",
      image: product.image || ""
    })
    setIsEditProductDialogOpen(true)
  }

  const handleUpdateProduct = async () => {
    if (!selectedCatalogue || !selectedProduct || !editProduct.name) {
      toast.error("Please fill in the product name")
      return
    }

    try {
      const updatedProduct = await safeFetchJson(`/api/catalogues/${selectedCatalogue.id}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct)
      })
      const updatedCatalogues = catalogues.map(cat => 
        cat.id === selectedCatalogue.id 
          ? { 
              ...cat, 
              products: cat.products.map(p => 
                p.id === selectedProduct.id ? updatedProduct : p
              ) 
            }
          : cat
      )
      setCatalogues(updatedCatalogues)
      setIsEditProductDialogOpen(false)
      setSelectedCatalogue(null)
      setSelectedProduct(null)
      setEditProduct({ name: "", description: "", fileUrl: "", image: "" })
      toast.success("Product updated successfully!")
    } catch (error: any) {
      console.error('Error updating product', error)
      toast.error(error?.message || "Error updating product")
    }
  }

  const handleDeleteProduct = async (catalogueId: string, productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/catalogues/${catalogueId}/products/${productId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        const updatedCatalogues = catalogues.map(cat => 
          cat.id === catalogueId 
            ? { 
                ...cat, 
                products: cat.products.filter(p => p.id !== productId)
              }
            : cat
        )
        setCatalogues(updatedCatalogues)
        toast.success("Product deleted successfully!")
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      toast.error("Error deleting product")
    }
  }

  const handleGenerateQRCode = async (catalogueId: string) => {
    try {
      const { qrCodeUrl } = await safeFetchJson(`/api/catalogues/${catalogueId}/qrcode`, { method: 'POST' })
      const updatedCatalogues = catalogues.map(cat => 
        cat.id === catalogueId 
          ? { ...cat, qrCodeUrl }
          : cat
      )
      setCatalogues(updatedCatalogues)
      toast.success("QR code generated successfully!")
    } catch (error) {
      toast.error("Error generating QR code")
    }
  }

  const handleEditCatalogue = (catalogue: Catalogue) => {
    setSelectedCatalogue(catalogue)
    setEditCatalogue({
      title: catalogue.title,
      description: catalogue.description
    })
    setIsEditCatalogueDialogOpen(true)
  }

  const handleUpdateCatalogue = async () => {
    if (!selectedCatalogue || !editCatalogue.title || !editCatalogue.description) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const updatedCatalogue = await safeFetchJson(`/api/catalogues/${selectedCatalogue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCatalogue)
      })
      const updatedCatalogues = catalogues.map(cat => 
        cat.id === selectedCatalogue.id ? updatedCatalogue : cat
      )
      setCatalogues(updatedCatalogues)
      setIsEditCatalogueDialogOpen(false)
      setSelectedCatalogue(null)
      setEditCatalogue({ title: "", description: "" })
      toast.success("Catalogue updated successfully!")
    } catch (error: any) {
      console.error('Error updating catalogue', error)
      toast.error(error?.message || "Error updating catalogue")
    }
  }

  const handleDeleteCatalogue = async (catalogueId: string) => {
    if (!confirm("Are you sure you want to delete this catalogue? This will also delete all products in it.")) {
      return
    }

    try {
      const response = await fetch(`/api/catalogues/${catalogueId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setCatalogues(catalogues.filter(cat => cat.id !== catalogueId))
        toast.success("Catalogue deleted successfully!")
      } else {
        toast.error("Failed to delete catalogue")
      }
    } catch (error) {
      toast.error("Error deleting catalogue")
    }
  }

  const handleImagePreview = (imageUrl: string, imageAlt: string) => {
    setPreviewImageUrl(imageUrl)
    setPreviewImageAlt(imageAlt)
    setIsImagePreviewOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Catalogue Manager</h1>
          <p className="text-lg text-gray-600">Create digital catalogues with QR codes for easy sharing</p>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Create New Catalogue
          </Button>
        </div>

        {isCreateDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Catalogue</h2>
                  <button
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Create a new product catalogue that users can access via QR code</p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Catalogue Title</Label>
                    <Input
                      id="title"
                      value={newCatalogue.title}
                      onChange={(e) => setNewCatalogue({ ...newCatalogue, title: e.target.value })}
                      placeholder="Enter catalogue title"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      value={newCatalogue.description}
                      onChange={(e) => setNewCatalogue({ ...newCatalogue, description: e.target.value })}
                      placeholder="Enter catalogue description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreateCatalogue} 
                      className="flex-1"
                      disabled={!newCatalogue.title || !newCatalogue.description}
                    >
                      Create Catalogue
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
          </div>
        )}

        {isEditCatalogueDialogOpen && selectedCatalogue && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Catalogue</h2>
                  <button
                    onClick={() => {
                      setIsEditCatalogueDialogOpen(false)
                      setSelectedCatalogue(null)
                      setEditCatalogue({ title: "", description: "" })
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Update the catalogue information</p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editTitle" className="text-sm font-medium text-gray-700">Catalogue Title</Label>
                    <Input
                      id="editTitle"
                      value={editCatalogue.title}
                      onChange={(e) => setEditCatalogue({ ...editCatalogue, title: e.target.value })}
                      placeholder="Enter catalogue title"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDescription" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={editCatalogue.description}
                      onChange={(e) => setEditCatalogue({ ...editCatalogue, description: e.target.value })}
                      placeholder="Enter catalogue description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleUpdateCatalogue} 
                      className="flex-1"
                      disabled={!editCatalogue.title || !editCatalogue.description}
                    >
                      Update Catalogue
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditCatalogueDialogOpen(false)
                        setSelectedCatalogue(null)
                        setEditCatalogue({ title: "", description: "" })
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {catalogues.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No catalogues yet</h3>
            <p className="text-gray-600 mb-4">Create your first catalogue to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogues.map((catalogue) => (
              <Card key={catalogue.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {catalogue.title}
                        <Badge variant="secondary">
                          {catalogue.products.length} products
                        </Badge>
                      </CardTitle>
                      <CardDescription>{catalogue.description}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCatalogue(catalogue)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCatalogue(catalogue.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    {catalogue.qrCodeUrl ? (
                      <img 
                        src={catalogue.qrCodeUrl} 
                        alt="QR Code" 
                        className="w-32 h-32 border rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateQRCode(catalogue.id)}
                      className="flex-1"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      {catalogue.qrCodeUrl ? "Regenerate QR" : "Generate QR"}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCatalogue(catalogue)
                        setIsAddProductDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  {isAddProductDialogOpen && selectedCatalogue?.id === catalogue.id && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Add Product to {catalogue.title}</h2>
                            <button
                              onClick={() => setIsAddProductDialogOpen(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-gray-600 mb-6">Add a new product to this catalogue</p>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="productName" className="text-sm font-medium text-gray-700">Product Name</Label>
                              <Input
                                id="productName"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                placeholder="Enter product name"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="productDescription" className="text-sm font-medium text-gray-700">Description</Label>
                              <Textarea
                                id="productDescription"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                placeholder="Enter product description"
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="productImage" className="text-sm font-medium text-gray-700">Image URL (optional)</Label>
                              <Input
                                id="productImage"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="productFile" className="text-sm font-medium text-gray-700">Download URL (optional)</Label>
                              <Input
                                id="productFile"
                                value={newProduct.fileUrl}
                                onChange={(e) => setNewProduct({ ...newProduct, fileUrl: e.target.value })}
                                placeholder="https://example.com/file.pdf"
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-3 pt-4">
                              <Button 
                                onClick={handleAddProduct} 
                                className="flex-1"
                                disabled={!newProduct.name}
                              >
                                Add Product
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setIsAddProductDialogOpen(false)} 
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {catalogue.products.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Products:</h4>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {catalogue.products.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm group">
                            <div className="flex items-center gap-2 flex-1">
                              {product.image && (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-8 h-8 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleImagePreview(product.image!, product.name)}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              )}
                              <span className="font-medium">{product.name}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(catalogue, product)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(catalogue.id, product.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isEditProductDialogOpen && selectedCatalogue && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                <button
                  onClick={() => {
                    setIsEditProductDialogOpen(false)
                    setSelectedCatalogue(null)
                    setSelectedProduct(null)
                    setEditProduct({ name: "", description: "", fileUrl: "", image: "" })
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">Update the product information</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editProductName" className="text-sm font-medium text-gray-700">Product Name</Label>
                  <Input
                    id="editProductName"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    placeholder="Enter product name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="editProductDescription" className="text-sm font-medium text-gray-700">Description</Label>
                  <Textarea
                    id="editProductDescription"
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    placeholder="Enter product description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="editProductImage" className="text-sm font-medium text-gray-700">Image URL (optional)</Label>
                  <Input
                    id="editProductImage"
                    value={editProduct.image}
                    onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="editProductFile" className="text-sm font-medium text-gray-700">Download URL (optional)</Label>
                  <Input
                    id="editProductFile"
                    value={editProduct.fileUrl}
                    onChange={(e) => setEditProduct({ ...editProduct, fileUrl: e.target.value })}
                    placeholder="https://example.com/file.pdf"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleUpdateProduct} 
                    className="flex-1"
                    disabled={!editProduct.name}
                  >
                    Update Product
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditProductDialogOpen(false)
                      setSelectedCatalogue(null)
                      setSelectedProduct(null)
                      setEditProduct({ name: "", description: "", fileUrl: "", image: "" })
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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