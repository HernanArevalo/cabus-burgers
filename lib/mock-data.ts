import type { Product, StoreStatus, PaymentMethodOption, Variant } from "./types"

export const storeStatus: StoreStatus = {
  isOpen: true,
  nextOpenTime: "11:00",
}

export const DELIVERY_COST = 800

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "efectivo",
    label: "Efectivo",
    description: "Pagas al recibir tu pedido",
    adjustment: 0,
  },
  {
    id: "transferencia",
    label: "Transferencia",
    description: "10% de descuento",
    adjustment: -10,
  },
  {
    id: "mercadopago",
    label: "MercadoPago",
    description: "10% de recargo",
    adjustment: 10,
  },
]

export const neighborhoods = [
  "Centro",
  "Alberdi",
  "Alta Cordoba",
  "Nueva Cordoba",
  "Guemes",
  "General Paz",
  "San Vicente",
  "Cofico",
  "Otro",
]

export const categories = [
  "Hamburguesas",
  "Papas",
  "Bebidas",
  "Combos",
]

export const products: Product[] = [
  // Hamburguesas
  {
    id: "burger-1",
    name: "Clasica CABUS",
    description: "Carne smash 120g, cheddar, lechuga, tomate, cebolla caramelizada y salsa especial.",
    price: 4500,
    image: "/images/burger-clasica.jpg",
    category: "Hamburguesas",
    badge: "Mas vendido",
    inStock: true,
    variants: [
      { id: "v-burger1-simple", name: "Simple", price: 4500 },
      { id: "v-burger1-doble", name: "Doble", price: 6200 },
    ],
    extras: [
      { id: "extra-1", name: "Medallon extra", price: 1200, inStock: true },
      { id: "extra-2", name: "Bacon", price: 800, inStock: true },
      { id: "extra-3", name: "Huevo frito", price: 500, inStock: true },
      { id: "extra-4", name: "Cheddar extra", price: 400, inStock: true },
      { id: "extra-5", name: "Cebolla crispy", price: 350, inStock: false },
    ],
  },
  {
    id: "burger-2",
    name: "Doble Smash",
    description: "Doble carne smash 240g, doble cheddar, pickles, salsa CABUS y pan brioche.",
    price: 6200,
    image: "/images/burger-doble.jpg",
    category: "Hamburguesas",
    inStock: true,
    variants: [],
    extras: [
      { id: "extra-1", name: "Medallon extra", price: 1200, inStock: true },
      { id: "extra-2", name: "Bacon", price: 800, inStock: true },
      { id: "extra-3", name: "Huevo frito", price: 500, inStock: true },
      { id: "extra-4", name: "Cheddar extra", price: 400, inStock: true },
    ],
  },
  {
    id: "burger-3",
    name: "Picante Infernal",
    description: "Carne smash 120g, pepper jack, jalapenos, salsa chipotle y cebolla morada.",
    price: 5100,
    image: "/images/burger-picante.jpg",
    category: "Hamburguesas",
    badge: "Nuevo",
    inStock: true,
    variants: [
      { id: "v-burger3-simple", name: "Simple", price: 5100 },
      { id: "v-burger3-doble", name: "Doble", price: 6800 },
    ],
    extras: [
      { id: "extra-1", name: "Medallon extra", price: 1200, inStock: true },
      { id: "extra-2", name: "Bacon", price: 800, inStock: true },
      { id: "extra-6", name: "Jalapenos extra", price: 300, inStock: true },
    ],
  },
  {
    id: "burger-4",
    name: "Veggie Burger",
    description: "Medallon de lentejas y quinoa, lechuga, tomate, palta y salsa verde.",
    price: 4800,
    image: "/images/burger-clasica.jpg",
    category: "Hamburguesas",
    inStock: false,
    variants: [],
    extras: [
      { id: "extra-4", name: "Cheddar extra", price: 400, inStock: true },
      { id: "extra-7", name: "Palta extra", price: 600, inStock: true },
    ],
  },
  // Papas
  {
    id: "papas-1",
    name: "Papas Cheddar & Bacon",
    description: "Papas fritas crocantes con cheddar fundido y bacon crocante.",
    price: 2200,
    image: "/images/papas-cheddar.jpg",
    category: "Papas",
    badge: "Mas vendido",
    inStock: true,
    variants: [
      { id: "v-papas1-chica", name: "Chica", price: 2200 },
      { id: "v-papas1-grande", name: "Grande", price: 3200 },
    ],
    extras: [
      { id: "extra-8", name: "Cheddar extra", price: 400, inStock: true },
      { id: "extra-9", name: "Bacon extra", price: 600, inStock: true },
    ],
  },
  {
    id: "papas-2",
    name: "Papas Clasicas",
    description: "Papas fritas crocantes con sal marina. Simple y perfectas.",
    price: 1400,
    image: "/images/papas-clasicas.jpg",
    category: "Papas",
    inStock: true,
    variants: [
      { id: "v-papas2-chica", name: "Chica", price: 1400 },
      { id: "v-papas2-grande", name: "Grande", price: 2000 },
    ],
    extras: [
      { id: "extra-10", name: "Salsa cheddar", price: 350, inStock: true },
      { id: "extra-11", name: "Ketchup extra", price: 0, inStock: true },
    ],
  },
  // Bebidas
  {
    id: "bebida-1",
    name: "Coca-Cola",
    description: "Coca-Cola original bien helada.",
    price: 1200,
    image: "/images/bebida-cola.jpg",
    category: "Bebidas",
    inStock: true,
    variants: [
      { id: "v-cola-354", name: "354ml", price: 1200 },
      { id: "v-cola-500", name: "500ml", price: 1500 },
    ],
    extras: [],
  },
  {
    id: "bebida-2",
    name: "Limonada Natural",
    description: "Limonada casera con menta fresca y hielo.",
    price: 1800,
    image: "/images/bebida-limon.jpg",
    category: "Bebidas",
    badge: "Casera",
    inStock: true,
    variants: [],
    extras: [],
  },
  {
    id: "bebida-3",
    name: "Agua Mineral",
    description: "Agua mineral natural sin gas.",
    price: 800,
    image: "/images/bebida-agua.jpg",
    category: "Bebidas",
    inStock: true,
    variants: [
      { id: "v-agua-350", name: "350ml", price: 800 },
      { id: "v-agua-500", name: "500ml", price: 1000 },
    ],
    extras: [],
  },
  // Combos
  {
    id: "combo-1",
    name: "Combo Clasico",
    description: "Clasica CABUS + Papas Clasicas + Coca-Cola 500ml. El favorito de todos.",
    price: 7200,
    image: "/images/combo-clasico.jpg",
    category: "Combos",
    badge: "Ahorra $800",
    inStock: true,
    variants: [
      { id: "v-combo1-simple", name: "Simple", price: 7200 },
      { id: "v-combo1-doble", name: "Doble", price: 9800 },
    ],
    extras: [
      { id: "extra-1", name: "Medallon extra", price: 1200, inStock: true },
      { id: "extra-2", name: "Bacon", price: 800, inStock: true },
      { id: "extra-12", name: "Upgrade papas cheddar", price: 900, inStock: true },
    ],
  },
  {
    id: "combo-2",
    name: "Combo Doble",
    description: "Doble Smash + Papas Cheddar & Bacon + Limonada Natural.",
    price: 10500,
    image: "/images/combo-clasico.jpg",
    category: "Combos",
    badge: "Ahorra $700",
    inStock: true,
    variants: [],
    extras: [
      { id: "extra-1", name: "Medallon extra", price: 1200, inStock: true },
      { id: "extra-2", name: "Bacon", price: 800, inStock: true },
    ],
  },
]
