import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: catalogueId } = await params
    const { productIds } = await request.json()

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: "productIds must be an array" }, { status: 400 })
    }

    // Update the order of products
    const updatePromises = productIds.map((productId: string, index: number) => 
      db.product.update({
        where: { 
          id: productId,
          catalogueId: catalogueId 
        },
        data: { order: index }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: "Product order updated successfully" })

  } catch (error) {
    console.error("Error updating product order:", error)
    return NextResponse.json({ error: "Failed to update product order" }, { status: 500 })
  }
}
