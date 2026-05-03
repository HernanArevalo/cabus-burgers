import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/store - Get store configuration
export async function GET() {
  try {
    let config = await prisma.storeConfig.findUnique({
      where: { id: "store-config" },
    })

    // Create default config if it doesn't exist
    if (!config) {
      config = await prisma.storeConfig.create({
        data: { id: "store-config" },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching store config:", error)
    return NextResponse.json(
      { error: "Failed to fetch store config" },
      { status: 500 }
    )
  }
}

// PUT /api/store - Update store configuration
export async function PUT(request: Request) {
  try {
    const data = await request.json()

    const config = await prisma.storeConfig.upsert({
      where: { id: "store-config" },
      update: {
        name: data.name,
        logo: data.logo,
        coverImage: data.coverImage,
        description: data.description,
        tagline: data.tagline,
        whatsapp: data.whatsapp,
        isOpen: data.isOpen,
        estimatedCloseTime: data.estimatedCloseTime,
        messageTemplates: data.messageTemplates,
      },
      create: {
        id: "store-config",
        ...data,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error updating store config:", error)
    return NextResponse.json(
      { error: "Failed to update store config" },
      { status: 500 }
    )
  }
}
