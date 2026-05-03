import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/extras/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const extra = await prisma.extra.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        inStock: data.inStock,
      },
    })

    return NextResponse.json(extra)
  } catch (error) {
    console.error("Error updating extra:", error)
    return NextResponse.json(
      { error: "Failed to update extra" },
      { status: 500 }
    )
  }
}

// DELETE /api/extras/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.extra.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting extra:", error)
    return NextResponse.json(
      { error: "Failed to delete extra" },
      { status: 500 }
    )
  }
}
