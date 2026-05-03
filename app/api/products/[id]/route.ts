import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { orderBy: { order: "asc" } },
        extras: { include: { extra: true } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

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

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Update product basic info
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        badge: data.badge || null,
        inStock: data.inStock,
        categoryId: data.categoryId,
      },
    })

    // Update variants: delete all and recreate
    if (data.variants !== undefined) {
      await prisma.variant.deleteMany({ where: { productId: id } })
      if (data.variants.length > 0) {
        await prisma.variant.createMany({
          data: data.variants.map((v: { name: string; price: number }, index: number) => ({
            name: v.name,
            price: v.price,
            order: index + 1,
            productId: id,
          })),
        })
      }
    }

    // Update extras: delete all and recreate
    if (data.extraIds !== undefined) {
      await prisma.productExtra.deleteMany({ where: { productId: id } })
      if (data.extraIds.length > 0) {
        await prisma.productExtra.createMany({
          data: data.extraIds.map((extraId: string) => ({
            productId: id,
            extraId,
          })),
        })
      }
    }

    // Fetch updated product
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { orderBy: { order: "asc" } },
        extras: { include: { extra: true } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

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

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
