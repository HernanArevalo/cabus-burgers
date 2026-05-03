import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/shipping-methods
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const methods = await prisma.shippingMethod.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { name: "asc" },
    })

    return NextResponse.json(methods)
  } catch (error) {
    console.error("Error fetching shipping methods:", error)
    return NextResponse.json(
      { error: "Failed to fetch shipping methods" },
      { status: 500 }
    )
  }
}

// POST /api/shipping-methods
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const method = await prisma.shippingMethod.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        cost: data.cost ?? 0,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(method, { status: 201 })
  } catch (error) {
    console.error("Error creating shipping method:", error)
    return NextResponse.json(
      { error: "Failed to create shipping method" },
      { status: 500 }
    )
  }
}
