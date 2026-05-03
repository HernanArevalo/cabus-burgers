import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/payment-methods/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const method = await prisma.paymentMethod.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        adjustment: data.adjustment,
        active: data.active,
      },
    })

    return NextResponse.json(method)
  } catch (error) {
    console.error("Error updating payment method:", error)
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    )
  }
}

// DELETE /api/payment-methods/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.paymentMethod.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 }
    )
  }
}
