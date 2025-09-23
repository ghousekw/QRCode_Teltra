import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const { name, description, fileUrl, image } = await request.json()
    const { id: catalogueId, productId } = await params

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Check if catalogue exists
    const catalogue = await db.catalogue.findUnique({
      where: { id: catalogueId }
    })

    if (!catalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    // Check if product exists and belongs to the catalogue
    const existingProduct = await db.product.findFirst({
      where: {
        id: productId,
        catalogueId: catalogueId
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        name,
        description: description || null,
        fileUrl: fileUrl || null,
        image: image || null
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const { id: catalogueId, productId } = await params

    // Check if catalogue exists
    const catalogue = await db.catalogue.findUnique({
      where: { id: catalogueId }
    })

    if (!catalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    // Check if product exists and belongs to the catalogue
    const existingProduct = await db.product.findFirst({
      where: {
        id: productId,
        catalogueId: catalogueId
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete the product
    await db.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}