import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/extras - Get all extras
export async function GET() {
  try {
    const extras = await prisma.extra.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(extras)
  } catch (error) {
    console.error("Error fetching extras:", error)
    return NextResponse.json(
      { error: "Failed to fetch extras" },
      { status: 500 }
    )
  }
}

// POST /api/extras - Create an extra
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const extra = await prisma.extra.create({
      data: {
        name: data.name,
        price: data.price ?? 0,
        inStock: data.inStock ?? true,
      },
    })

    return NextResponse.json(extra, { status: 201 })
  } catch (error) {
    console.error("Error creating extra:", error)
    return NextResponse.json(
      { error: "Failed to create extra" },
      { status: 500 }
    )
  }
}
