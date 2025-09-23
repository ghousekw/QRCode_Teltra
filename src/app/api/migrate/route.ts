import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to run database migrations
    // You can call it once after deployment: POST /api/migrate
    
    // Test database connection
    await db.catalogue.findMany({ take: 1 })
    
    return NextResponse.json({ 
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database migration error:", error)
    return NextResponse.json({ 
      error: "Database migration failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
