import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/products - Get all products with variants and extras
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const inStockOnly = searchParams.get("inStock") === "true"

    const products = await prisma.product.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(inStockOnly ? { inStock: true } : {}),
      },
      include: {
        category: true,
        variants: {
          orderBy: { order: "asc" },
        },
        extras: {
          include: {
            extra: true,
          },
        },
      },
      orderBy: [
        { category: { order: "asc" } },
        { order: "asc" },
      ],
    })

    // Transform to match frontend types
    const transformed = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category.name,
      categoryId: product.categoryId,
      badge: product.badge,
      inStock: product.inStock,
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
      })),
      extras: product.extras.map((pe) => ({
        id: pe.extra.id,
        name: pe.extra.name,
        price: pe.extra.price,
        inStock: pe.extra.inStock,
      })),
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a product
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get max order for category
    const maxOrder = await prisma.product.aggregate({
      where: { categoryId: data.categoryId },
      _max: { order: true },
    })

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        price: data.price ?? 0,
        image: data.image ?? "",
        badge: data.badge || null,
        inStock: data.inStock ?? true,
        order: (maxOrder._max.order ?? 0) + 1,
        categoryId: data.categoryId,
        variants: data.variants?.length > 0
          ? {
              create: data.variants.map((v: { name: string; price: number }, index: number) => ({
                name: v.name,
                price: v.price,
                order: index + 1,
              })),
            }
          : undefined,
        extras: data.extraIds?.length > 0
          ? {
              create: data.extraIds.map((extraId: string) => ({
                extraId,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        variants: { orderBy: { order: "asc" } },
        extras: { include: { extra: true } },
      },
    })

    // Transform response
    const transformed = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category.name,
      categoryId: product.categoryId,
      badge: product.badge,
      inStock: product.inStock,
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
      })),
      extras: product.extras.map((pe) => ({
        id: pe.extra.id,
        name: pe.extra.name,
        price: pe.extra.price,
        inStock: pe.extra.inStock,
      })),
    }

    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
