import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const catalogues = await db.catalogue.findMany({
      include: {
        products: {
          orderBy: {
            order: "asc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(catalogues)
  } catch (error) {
    console.error("Error fetching catalogues:", error)
    return NextResponse.json({ error: "Failed to fetch catalogues" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const catalogue = await db.catalogue.create({
      data: {
        id: uuidv4(),
        title,
        description
      },
      include: {
        products: true
      }
    })

    return NextResponse.json(catalogue, { status: 201 })
  } catch (error) {
    console.error("Error creating catalogue:", error)
    return NextResponse.json({ error: "Failed to create catalogue" }, { status: 500 })
  }
}