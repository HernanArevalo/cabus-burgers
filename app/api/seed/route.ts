import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log("[v0] Starting database seed...")
    
    // Clear existing data in correct order (respecting foreign keys)
    await prisma.orderItemExtra.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.productExtra.deleteMany()
    await prisma.variant.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.extra.deleteMany()
    await prisma.shippingMethod.deleteMany()
    await prisma.paymentMethod.deleteMany()
    await prisma.storeConfig.deleteMany()

    console.log("[v0] Cleared existing data")

    // Create Store Config
    await prisma.storeConfig.create({
      data: {
        id: "store-1",
        name: "CABUS HAMBURGUESAS",
        tagline: "Las mejores smash burgers de la ciudad",
        description: "Hamburguesas artesanales hechas con ingredientes frescos y de primera calidad.",
        logo: "/images/hero-burger.jpg",
        coverImage: "/images/hero-burger.jpg",
        whatsapp: "5493512345678",
        isOpen: true,
        estimatedCloseTime: "23:00",
        messageTemplates: {
          orderConfirmation: "Hola {nombre}! Tu pedido #{numero} fue confirmado.",
          orderReady: "Hola {nombre}! Tu pedido #{numero} esta listo.",
          orderDelivery: "Hola {nombre}! Tu pedido #{numero} esta en camino."
        }
      }
    })

    console.log("[v0] Created store config")

    // Create Categories
    const categories = await Promise.all([
      prisma.category.create({ data: { id: "cat-1", name: "Hamburguesas", order: 1, active: true } }),
      prisma.category.create({ data: { id: "cat-2", name: "Papas", order: 2, active: true } }),
      prisma.category.create({ data: { id: "cat-3", name: "Bebidas", order: 3, active: true } }),
      prisma.category.create({ data: { id: "cat-4", name: "Combos", order: 4, active: true } }),
    ])

    console.log("[v0] Created categories")

    // Create Extras
    const extras = await Promise.all([
      prisma.extra.create({ data: { id: "extra-1", name: "Medallon extra", price: 1200, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-2", name: "Bacon", price: 800, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-3", name: "Huevo frito", price: 500, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-4", name: "Cheddar extra", price: 400, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-5", name: "Cebolla crispy", price: 350, inStock: false } }),
      prisma.extra.create({ data: { id: "extra-6", name: "Jalapenos extra", price: 300, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-7", name: "Palta extra", price: 600, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-8", name: "Salsa cheddar", price: 350, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-9", name: "Ketchup extra", price: 0, inStock: true } }),
      prisma.extra.create({ data: { id: "extra-10", name: "Upgrade papas cheddar", price: 900, inStock: true } }),
    ])

    console.log("[v0] Created extras")

    // Create Products with variants
    const burger1 = await prisma.product.create({
      data: {
        id: "burger-1",
        name: "Clasica CABUS",
        description: "Carne smash 120g, cheddar, lechuga, tomate, cebolla caramelizada y salsa especial.",
        price: 4500,
        image: "/images/burger-clasica.jpg",
        categoryId: "cat-1",
        badge: "Mas vendido",
        inStock: true,
        order: 1,
        variants: {
          create: [
            { id: "v-burger1-simple", name: "Simple", price: 4500, order: 1 },
            { id: "v-burger1-doble", name: "Doble", price: 6200, order: 2 },
          ]
        },
        extras: {
          create: [
            { extraId: "extra-1" },
            { extraId: "extra-2" },
            { extraId: "extra-3" },
            { extraId: "extra-4" },
            { extraId: "extra-5" },
          ]
        }
      }
    })

    const burger2 = await prisma.product.create({
      data: {
        id: "burger-2",
        name: "Doble Smash",
        description: "Doble carne smash 240g, doble cheddar, pickles, salsa CABUS y pan brioche.",
        price: 6200,
        image: "/images/burger-doble.jpg",
        categoryId: "cat-1",
        inStock: true,
        order: 2,
        extras: {
          create: [
            { extraId: "extra-1" },
            { extraId: "extra-2" },
            { extraId: "extra-3" },
            { extraId: "extra-4" },
          ]
        }
      }
    })

    const burger3 = await prisma.product.create({
      data: {
        id: "burger-3",
        name: "Picante Infernal",
        description: "Carne smash 120g, pepper jack, jalapenos, salsa chipotle y cebolla morada.",
        price: 5100,
        image: "/images/burger-picante.jpg",
        categoryId: "cat-1",
        badge: "Nuevo",
        inStock: true,
        order: 3,
        variants: {
          create: [
            { id: "v-burger3-simple", name: "Simple", price: 5100, order: 1 },
            { id: "v-burger3-doble", name: "Doble", price: 6800, order: 2 },
          ]
        },
        extras: {
          create: [
            { extraId: "extra-1" },
            { extraId: "extra-2" },
            { extraId: "extra-6" },
          ]
        }
      }
    })

    const papas1 = await prisma.product.create({
      data: {
        id: "papas-1",
        name: "Papas Cheddar & Bacon",
        description: "Papas fritas crocantes con cheddar fundido y bacon crocante.",
        price: 2200,
        image: "/images/papas-cheddar.jpg",
        categoryId: "cat-2",
        badge: "Mas vendido",
        inStock: true,
        order: 1,
        variants: {
          create: [
            { id: "v-papas1-chica", name: "Chica", price: 2200, order: 1 },
            { id: "v-papas1-grande", name: "Grande", price: 3200, order: 2 },
          ]
        },
        extras: {
          create: [
            { extraId: "extra-4" },
            { extraId: "extra-2" },
          ]
        }
      }
    })

    const papas2 = await prisma.product.create({
      data: {
        id: "papas-2",
        name: "Papas Clasicas",
        description: "Papas fritas crocantes con sal marina. Simple y perfectas.",
        price: 1400,
        image: "/images/papas-clasicas.jpg",
        categoryId: "cat-2",
        inStock: true,
        order: 2,
        variants: {
          create: [
            { id: "v-papas2-chica", name: "Chica", price: 1400, order: 1 },
            { id: "v-papas2-grande", name: "Grande", price: 2000, order: 2 },
          ]
        },
        extras: {
          create: [
            { extraId: "extra-8" },
            { extraId: "extra-9" },
          ]
        }
      }
    })

    const bebida1 = await prisma.product.create({
      data: {
        id: "bebida-1",
        name: "Coca-Cola",
        description: "Coca-Cola original bien helada.",
        price: 1200,
        image: "/images/bebida-cola.jpg",
        categoryId: "cat-3",
        inStock: true,
        order: 1,
        variants: {
          create: [
            { id: "v-cola-354", name: "354ml", price: 1200, order: 1 },
            { id: "v-cola-500", name: "500ml", price: 1500, order: 2 },
          ]
        }
      }
    })

    const bebida2 = await prisma.product.create({
      data: {
        id: "bebida-2",
        name: "Limonada Natural",
        description: "Limonada casera con menta fresca y hielo.",
        price: 1800,
        image: "/images/bebida-limon.jpg",
        categoryId: "cat-3",
        badge: "Casera",
        inStock: true,
        order: 2
      }
    })

    const bebida3 = await prisma.product.create({
      data: {
        id: "bebida-3",
        name: "Agua Mineral",
        description: "Agua mineral natural sin gas.",
        price: 800,
        image: "/images/bebida-agua.jpg",
        categoryId: "cat-3",
        inStock: true,
        order: 3,
        variants: {
          create: [
            { id: "v-agua-350", name: "350ml", price: 800, order: 1 },
            { id: "v-agua-500", name: "500ml", price: 1000, order: 2 },
          ]
        }
      }
    })

    const combo1 = await prisma.product.create({
      data: {
        id: "combo-1",
        name: "Combo Clasico",
        description: "Clasica CABUS + Papas Clasicas + Coca-Cola 500ml. El favorito de todos.",
        price: 7200,
        image: "/images/combo-clasico.jpg",
        categoryId: "cat-4",
        badge: "Ahorra $800",
        inStock: true,
        order: 1,
        variants: {
          create: [
            { id: "v-combo1-simple", name: "Simple", price: 7200, order: 1 },
            { id: "v-combo1-doble", name: "Doble", price: 9800, order: 2 },
          ]
        },
        extras: {
          create: [
            { extraId: "extra-1" },
            { extraId: "extra-2" },
            { extraId: "extra-10" },
          ]
        }
      }
    })

    const combo2 = await prisma.product.create({
      data: {
        id: "combo-2",
        name: "Combo Doble",
        description: "Doble Smash + Papas Cheddar & Bacon + Limonada Natural.",
        price: 10500,
        image: "/images/combo-clasico.jpg",
        categoryId: "cat-4",
        badge: "Ahorra $700",
        inStock: true,
        order: 2,
        extras: {
          create: [
            { extraId: "extra-1" },
            { extraId: "extra-2" },
          ]
        }
      }
    })

    console.log("[v0] Created products with variants and extras")

    // Create Shipping Methods
    await prisma.shippingMethod.createMany({
      data: [
        { id: "ship-1", name: "Retiro en local", description: "Retiras tu pedido en nuestro local", cost: 0, active: true },
        { id: "ship-2", name: "Delivery", description: "Te lo llevamos a tu casa", cost: 800, active: true },
      ]
    })

    console.log("[v0] Created shipping methods")

    // Create Payment Methods
    await prisma.paymentMethod.createMany({
      data: [
        { id: "pay-1", name: "Efectivo", description: "Pagas al recibir tu pedido", adjustment: 0, active: true },
        { id: "pay-2", name: "Transferencia", description: "10% de descuento", adjustment: -10, active: true },
        { id: "pay-3", name: "MercadoPago", description: "10% de recargo", adjustment: 10, active: true },
      ]
    })

    console.log("[v0] Created payment methods")
    console.log("[v0] Database seeded successfully!")

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("[v0] Seed error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "POST to this endpoint to seed the database" })
}
