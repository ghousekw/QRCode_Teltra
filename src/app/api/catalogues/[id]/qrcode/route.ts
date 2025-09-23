import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import QRCode from "qrcode"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: catalogueId } = await params

    // Check if catalogue exists
    const catalogue = await db.catalogue.findUnique({
      where: { id: catalogueId },
      include: {
        products: true
      }
    })

    if (!catalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    // Generate QR code with catalogue URL - use the request host to determine the base URL
    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = `${protocol}://${host}`
    const catalogueUrl = `${baseUrl}/catalogue/${catalogueId}`
    const qrCodeDataUrl = await QRCode.toDataURL(catalogueUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Update catalogue with QR code URL
    const updatedCatalogue = await db.catalogue.update({
      where: { id: catalogueId },
      data: {
        qrCodeUrl: qrCodeDataUrl
      },
      include: {
        products: true
      }
    })

    return NextResponse.json({ 
      qrCodeUrl: qrCodeDataUrl,
      catalogue: updatedCatalogue 
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}