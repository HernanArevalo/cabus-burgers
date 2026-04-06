import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { OrderStatus } from "@prisma/client"

// GET /api/orders/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shippingMethod: true,
        paymentMethod: true,
        items: {
          include: {
            product: true,
            variant: true,
            extras: { include: { extra: true } },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const transformed = {
      id: order.id,
      orderNumber: order.orderNumber,
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          image: item.product.image,
          category: "",
          inStock: item.product.inStock,
          extras: [],
          variants: [],
        },
        quantity: item.quantity,
        selectedVariant: item.variant
          ? { id: item.variant.id, name: item.variant.name, price: item.variant.price }
          : null,
        selectedExtras: item.extras.map((e) => ({
          id: e.extra.id,
          name: e.extra.name,
          price: e.price,
          inStock: e.extra.inStock,
        })),
        observations: item.observations,
        totalPrice: item.totalPrice,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      paymentAdjustment: order.paymentAdjustment,
      total: order.total,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        shippingMethod: order.shippingMethod?.name.toLowerCase().includes("delivery")
          ? "delivery"
          : "retiro",
        street: order.street,
        number: order.streetNumber,
        neighborhood: order.neighborhood,
        paymentMethod: order.paymentMethod?.name.toLowerCase() ?? "efectivo",
        cashAmount: order.cashAmount,
        observations: order.observations,
      },
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const validStatuses: OrderStatus[] = [
      "PENDIENTE",
      "CONFIRMADO",
      "EN_PREPARACION",
      "LISTO",
      "ENVIADO",
      "ENTREGADO",
      "CANCELADO",
    ]

    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
      },
    })

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      updatedAt: order.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.order.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    )
  }
}
