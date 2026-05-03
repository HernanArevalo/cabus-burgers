import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.orderItemExtra.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productExtra.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.extra.deleteMany()
  await prisma.category.deleteMany()
  await prisma.shippingMethod.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.storeConfig.deleteMany()

  // Create Store Config
  await prisma.storeConfig.create({
    data: {
      id: "store-config",
      name: "CABUS HAMBURGUESAS",
      logo: "/images/hero-burger.jpg",
      coverImage: "/images/hero-burger.jpg",
      description: "Las mejores smash burgers de la ciudad. Ingredientes frescos, sabor inigualable.",
      tagline: "Smash Burgers de Verdad",
      whatsapp: "5493511234567",
      isOpen: true,
      estimatedCloseTime: "23:00",
      messageTemplates: {
        orderConfirmation: "Hola {{nombre}}! Tu pedido #{{pedido_id}} fue confirmado. Estamos preparandolo.",
        orderReady: "{{nombre}}, tu pedido #{{pedido_id}} esta listo! {{metodo_envio}}",
        orderDelivery: "{{nombre}}, tu pedido #{{pedido_id}} esta en camino! Llega en aprox. 30 min.",
      },
    },
  })
  console.log("Store config created")

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Hamburguesas", order: 1, active: true } }),
    prisma.category.create({ data: { name: "Papas", order: 2, active: true } }),
    prisma.category.create({ data: { name: "Bebidas", order: 3, active: true } }),
    prisma.category.create({ data: { name: "Combos", order: 4, active: true } }),
    prisma.category.create({ data: { name: "Postres", order: 5, active: false } }),
  ])
  console.log("Categories created:", categories.length)

  const [hamburguesas, papas, bebidas, combos] = categories

  // Create Extras
  const extras = await Promise.all([
    prisma.extra.create({ data: { name: "Medallon extra", price: 1200, inStock: true } }),
    prisma.extra.create({ data: { name: "Bacon", price: 800, inStock: true } }),
    prisma.extra.create({ data: { name: "Huevo frito", price: 500, inStock: true } }),
    prisma.extra.create({ data: { name: "Cheddar extra", price: 400, inStock: true } }),
    prisma.extra.create({ data: { name: "Cebolla crispy", price: 350, inStock: false } }),
    prisma.extra.create({ data: { name: "Jalapenos extra", price: 300, inStock: true } }),
    prisma.extra.create({ data: { name: "Palta extra", price: 600, inStock: true } }),
    prisma.extra.create({ data: { name: "Salsa cheddar", price: 350, inStock: true } }),
    prisma.extra.create({ data: { name: "Bacon extra", price: 600, inStock: true } }),
    prisma.extra.create({ data: { name: "Ketchup extra", price: 0, inStock: true } }),
    prisma.extra.create({ data: { name: "Upgrade papas cheddar", price: 900, inStock: true } }),
  ])
  console.log("Extras created:", extras.length)

  const [medallon, bacon, huevo, cheddar, cebollaCrispy, jalapenos, palta, salsaCheddar, baconExtra, ketchup, upgradePapas] = extras

  // Create Shipping Methods
  await prisma.shippingMethod.createMany({
    data: [
      { name: "Retiro en local", description: "El cliente retira en el local", cost: 0, active: true },
      { name: "Delivery", description: "Envio a domicilio", cost: 800, active: true },
    ],
  })
  console.log("Shipping methods created")

  // Create Payment Methods
  await prisma.paymentMethod.createMany({
    data: [
      { name: "Efectivo", description: "Pago al recibir", adjustment: 0, active: true },
      { name: "Transferencia", description: "10% de descuento", adjustment: -10, active: true },
      { name: "MercadoPago", description: "10% de recargo", adjustment: 10, active: true },
    ],
  })
  console.log("Payment methods created")

  // Create Products with Variants and Extras

  // Burger 1: Clasica CABUS
  const burger1 = await prisma.product.create({
    data: {
      name: "Clasica CABUS",
      description: "Carne smash 120g, cheddar, lechuga, tomate, cebolla caramelizada y salsa especial.",
      price: 4500,
      image: "/images/burger-clasica.jpg",
      badge: "Mas vendido",
      inStock: true,
      order: 1,
      categoryId: hamburguesas.id,
      variants: {
        create: [
          { name: "Simple", price: 4500, order: 1 },
          { name: "Doble", price: 6200, order: 2 },
        ],
      },
      extras: {
        create: [
          { extraId: medallon.id },
          { extraId: bacon.id },
          { extraId: huevo.id },
          { extraId: cheddar.id },
          { extraId: cebollaCrispy.id },
        ],
      },
    },
  })

  // Burger 2: Doble Smash
  const burger2 = await prisma.product.create({
    data: {
      name: "Doble Smash",
      description: "Doble carne smash 240g, doble cheddar, pickles, salsa CABUS y pan brioche.",
      price: 6200,
      image: "/images/burger-doble.jpg",
      inStock: true,
      order: 2,
      categoryId: hamburguesas.id,
      extras: {
        create: [
          { extraId: medallon.id },
          { extraId: bacon.id },
          { extraId: huevo.id },
          { extraId: cheddar.id },
        ],
      },
    },
  })

  // Burger 3: Picante Infernal
  const burger3 = await prisma.product.create({
    data: {
      name: "Picante Infernal",
      description: "Carne smash 120g, pepper jack, jalapenos, salsa chipotle y cebolla morada.",
      price: 5100,
      image: "/images/burger-picante.jpg",
      badge: "Nuevo",
      inStock: true,
      order: 3,
      categoryId: hamburguesas.id,
      variants: {
        create: [
          { name: "Simple", price: 5100, order: 1 },
          { name: "Doble", price: 6800, order: 2 },
        ],
      },
      extras: {
        create: [
          { extraId: medallon.id },
          { extraId: bacon.id },
          { extraId: jalapenos.id },
        ],
      },
    },
  })

  // Burger 4: Veggie Burger
  const burger4 = await prisma.product.create({
    data: {
      name: "Veggie Burger",
      description: "Medallon de lentejas y quinoa, lechuga, tomate, palta y salsa verde.",
      price: 4800,
      image: "/images/burger-clasica.jpg",
      inStock: false,
      order: 4,
      categoryId: hamburguesas.id,
      extras: {
        create: [
          { extraId: cheddar.id },
          { extraId: palta.id },
        ],
      },
    },
  })

  // Papas 1: Cheddar & Bacon
  const papas1 = await prisma.product.create({
    data: {
      name: "Papas Cheddar & Bacon",
      description: "Papas fritas crocantes con cheddar fundido y bacon crocante.",
      price: 2200,
      image: "/images/papas-cheddar.jpg",
      badge: "Mas vendido",
      inStock: true,
      order: 1,
      categoryId: papas.id,
      variants: {
        create: [
          { name: "Chica", price: 2200, order: 1 },
          { name: "Grande", price: 3200, order: 2 },
        ],
      },
      extras: {
        create: [
          { extraId: cheddar.id },
          { extraId: baconExtra.id },
        ],
      },
    },
  })

  // Papas 2: Clasicas
  const papas2 = await prisma.product.create({
    data: {
      name: "Papas Clasicas",
      description: "Papas fritas crocantes con sal marina. Simple y perfectas.",
      price: 1400,
      image: "/images/papas-clasicas.jpg",
      inStock: true,
      order: 2,
      categoryId: papas.id,
      variants: {
        create: [
          { name: "Chica", price: 1400, order: 1 },
          { name: "Grande", price: 2000, order: 2 },
        ],
      },
      extras: {
        create: [
          { extraId: salsaCheddar.id },
          { extraId: ketchup.id },
        ],
      },
    },
  })

  // Bebida 1: Coca-Cola
  const bebida1 = await prisma.product.create({
    data: {
      name: "Coca-Cola",
      description: "Coca-Cola original bien helada.",
      price: 1200,
      image: "/images/bebida-cola.jpg",
      inStock: true,
      order: 1,
      categoryId: bebidas.id,
      variants: {
        create: [
          { name: "354ml", price: 1200, order: 1 },
          { name: "500ml", price: 1500, order: 2 },
        ],
      },
    },
  })

  // Bebida 2: Limonada Natural
  const bebida2 = await prisma.product.create({
    data: {
      name: "Limonada Natural",
      description: "Limonada casera con menta fresca y hielo.",
      price: 1800,
      image: "/images/bebida-limon.jpg",
      badge: "Casera",
      inStock: true,
      order: 2,
      categoryId: bebidas.id,
    },
  })

  // Bebida 3: Agua Mineral
  const bebida3 = await prisma.product.create({
    data: {
      name: "Agua Mineral",
      description: "Agua mineral natural sin gas.",
      price: 800,
      image: "/images/bebida-agua.jpg",
      inStock: true,
      order: 3,
      categoryId: bebidas.id,
      variants: {
        create: [
          { name: "350ml", price: 800, order: 1 },
          { name: "500ml", price: 1000, order: 2 },
        ],
      },
    },
  })

  // Combo 1: Clasico
  const combo1 = await prisma.product.create({
    data: {
      name: "Combo Clasico",
      description: "Clasica CABUS + Papas Clasicas + Coca-Cola 500ml. El favorito de todos.",
      price: 7200,
      image: "/images/combo-clasico.jpg",
      badge: "Ahorra $800",
      inStock: true,
      order: 1,
      categoryId: combos.id,
      variants: {
        create: [
          { name: "Simple", price: 7200, order: 1 },
          { name: "Doble", price: 9800, order: 2 },
        ],
      },
      extras: {
        create: [
          { extraId: medallon.id },
          { extraId: bacon.id },
          { extraId: upgradePapas.id },
        ],
      },
    },
  })

  // Combo 2: Doble
  const combo2 = await prisma.product.create({
    data: {
      name: "Combo Doble",
      description: "Doble Smash + Papas Cheddar & Bacon + Limonada Natural.",
      price: 10500,
      image: "/images/combo-clasico.jpg",
      badge: "Ahorra $700",
      inStock: true,
      order: 2,
      categoryId: combos.id,
      extras: {
        create: [
          { extraId: medallon.id },
          { extraId: bacon.id },
        ],
      },
    },
  })

  console.log("Products created")

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
