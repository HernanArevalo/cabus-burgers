import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/categories - Get all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const categories = await prisma.category.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { order: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a category
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get max order
    const maxOrder = await prisma.category.aggregate({
      _max: { order: true },
    })

    const category = await prisma.category.create({
      data: {
        name: data.name,
        order: (maxOrder._max.order ?? 0) + 1,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
