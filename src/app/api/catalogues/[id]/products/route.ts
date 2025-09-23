import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, description, fileUrl, image } = await request.json()
    const { id: catalogueId } = await params

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Check if catalogue exists and get current product count for ordering
    const catalogue = await db.catalogue.findUnique({
      where: { id: catalogueId },
      include: {
        products: true
      }
    })

    if (!catalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    const product = await db.product.create({
      data: {
        id: uuidv4(),
        name,
        description: description || null,
        fileUrl: fileUrl || null,
        image: image || null,
        order: catalogue.products.length, // Set order to be last
        catalogueId
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}