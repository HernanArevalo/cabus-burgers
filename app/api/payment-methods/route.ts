import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/payment-methods
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const methods = await prisma.paymentMethod.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { name: "asc" },
    })

    return NextResponse.json(methods)
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    )
  }
}

// POST /api/payment-methods
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const method = await prisma.paymentMethod.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        adjustment: data.adjustment ?? 0,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(method, { status: 201 })
  } catch (error) {
    console.error("Error creating payment method:", error)
    return NextResponse.json(
      { error: "Failed to create payment method" },
      { status: 500 }
    )
  }
}
