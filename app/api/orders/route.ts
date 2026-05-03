import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { OrderStatus } from "@prisma/client"

// Helper to generate order number
function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `ORD-${dateStr}-${random}`
}

// GET /api/orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as OrderStatus | null
    const limit = parseInt(searchParams.get("limit") ?? "50")

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        shippingMethod: true,
        paymentMethod: true,
        items: {
          include: {
            product: true,
            variant: true,
            extras: {
              include: {
                extra: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    // Transform to match frontend types
    const transformed = orders.map((order) => ({
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
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Find shipping method
    let shippingMethodId: string | null = null
    if (data.customer.shippingMethod) {
      const shippingMethod = await prisma.shippingMethod.findFirst({
        where: {
          OR: [
            { name: { contains: data.customer.shippingMethod, mode: "insensitive" } },
            { id: data.customer.shippingMethodId },
          ],
        },
      })
      shippingMethodId = shippingMethod?.id ?? null
    }

    // Find payment method
    let paymentMethodId: string | null = null
    if (data.customer.paymentMethod) {
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          OR: [
            { name: { contains: data.customer.paymentMethod, mode: "insensitive" } },
            { id: data.customer.paymentMethodId },
          ],
        },
      })
      paymentMethodId = paymentMethod?.id ?? null
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        paymentAdjustment: data.paymentAdjustment,
        total: data.total,
        customerName: data.customer.name,
        customerPhone: data.customer.phone,
        customerEmail: data.customer.email ?? "",
        shippingMethodId,
        street: data.customer.street ?? "",
        streetNumber: data.customer.number ?? "",
        neighborhood: data.customer.neighborhood ?? "",
        paymentMethodId,
        cashAmount: data.customer.cashAmount ?? "",
        observations: data.customer.observations ?? "",
        status: "PENDIENTE",
        items: {
          create: data.items.map((item: {
            product: { id: string }
            selectedVariant?: { id: string } | null
            quantity: number
            totalPrice: number
            observations?: string
            selectedExtras?: { id: string; price: number }[]
          }) => ({
            productId: item.product.id,
            variantId: item.selectedVariant?.id ?? null,
            quantity: item.quantity,
            unitPrice: item.totalPrice / item.quantity,
            totalPrice: item.totalPrice,
            observations: item.observations ?? "",
            extras: item.selectedExtras?.length
              ? {
                  create: item.selectedExtras.map((e) => ({
                    extraId: e.id,
                    price: e.price,
                  })),
                }
              : undefined,
          })),
        },
      },
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

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
