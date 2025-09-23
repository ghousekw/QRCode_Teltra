import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import QRCode from "qrcode"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const { id: catalogueId, productId } = await params

    // Find the product with its catalogue
    const product = await db.product.findFirst({
      where: {
        id: productId,
        catalogueId: catalogueId
      },
      include: {
        catalogue: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Create the product URL
    const productUrl = `${request.nextUrl.origin}/catalogue/${catalogueId}?product=${productId}`
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(productUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({
      qrCodeUrl: qrCodeDataURL,
      productUrl: productUrl,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image
      },
      catalogue: {
        id: product.catalogue.id,
        title: product.catalogue.title
      }
    })

  } catch (error) {
    console.error("Error generating product QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
