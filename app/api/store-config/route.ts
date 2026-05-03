import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let config = await prisma.storeConfig.findUnique({
      where: { id: "store-config" },
    })

    if (!config) {
      config = await prisma.storeConfig.create({
        data: {
          id: "store-config",
          name: "CABUS HAMBURGUESAS",
          whatsapp: "5493511234567",
        },
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

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const config = await prisma.storeConfig.upsert({
      where: { id: "store-config" },
      update: {
        name: body.name,
        tagline: body.tagline,
        description: body.description,
        logo: body.logo,
        coverImage: body.coverImage,
        whatsapp: body.whatsapp,
        isOpen: body.isOpen,
        estimatedCloseTime: body.estimatedCloseTime,
        messageTemplates: body.messageTemplates,
      },
      create: {
        id: "store-config",
        name: body.name,
        tagline: body.tagline,
        description: body.description,
        logo: body.logo,
        coverImage: body.coverImage,
        whatsapp: body.whatsapp,
        isOpen: body.isOpen,
        estimatedCloseTime: body.estimatedCloseTime,
        messageTemplates: body.messageTemplates,
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
