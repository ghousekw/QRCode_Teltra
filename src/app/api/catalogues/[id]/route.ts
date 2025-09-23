import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const catalogue = await db.catalogue.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: {
            order: "asc"
          }
        }
      }
    })

    if (!catalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    return NextResponse.json(catalogue)
  } catch (error) {
    console.error("Error fetching catalogue:", error)
    return NextResponse.json({ error: "Failed to fetch catalogue" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { title, description } = await request.json()
    const { id: catalogueId } = await params

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Check if catalogue exists
    const existingCatalogue = await db.catalogue.findUnique({
      where: { id: catalogueId }
    })

    if (!existingCatalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    const updatedCatalogue = await db.catalogue.update({
      where: { id: catalogueId },
      data: {
        title,
        description
      },
      include: {
        products: true
      }
    })

    return NextResponse.json(updatedCatalogue)
  } catch (error) {
    console.error("Error updating catalogue:", error)
    return NextResponse.json({ error: "Failed to update catalogue" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: catalogueId } = await params

    // Check if catalogue exists
    const existingCatalogue = await db.catalogue.findUnique({
      where: { id: catalogueId }
    })

    if (!existingCatalogue) {
      return NextResponse.json({ error: "Catalogue not found" }, { status: 404 })
    }

    // Delete the catalogue (this will also delete associated products due to cascade)
    await db.catalogue.delete({
      where: { id: catalogueId }
    })

    return NextResponse.json({ message: "Catalogue deleted successfully" })
  } catch (error) {
    console.error("Error deleting catalogue:", error)
    return NextResponse.json({ error: "Failed to delete catalogue" }, { status: 500 })
  }
}