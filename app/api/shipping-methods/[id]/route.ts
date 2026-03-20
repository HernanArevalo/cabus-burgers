import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/shipping-methods/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const method = await prisma.shippingMethod.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        cost: data.cost,
        active: data.active,
      },
    })

    return NextResponse.json(method)
  } catch (error) {
    console.error("Error updating shipping method:", error)
    return NextResponse.json(
      { error: "Failed to update shipping method" },
      { status: 500 }
    )
  }
}

// DELETE /api/shipping-methods/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.shippingMethod.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting shipping method:", error)
    return NextResponse.json(
      { error: "Failed to delete shipping method" },
      { status: 500 }
    )
  }
}
