import type { Product, Order, Category, Extra, StoreConfig } from "./types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// ─────────────────────────────────────────────────────────────────────────────
// STORE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export function getStoreConfig() {
  return fetcher("/api/store")
}

export async function updateStoreConfig(data: Partial<StoreConfig>) {
  const res = await fetch("/api/store", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export function getCategories() {
  return fetcher("/api/categories")
}

export async function createCategory(data: Partial<Category>) {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateCategory(id: string, data: Partial<Category>) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRAS
// ─────────────────────────────────────────────────────────────────────────────

export function getExtras() {
  return fetcher("/api/extras")
}

export async function createExtra(data: Partial<Extra>) {
  const res = await fetch("/api/extras", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateExtra(id: string, data: Partial<Extra>) {
  const res = await fetch(`/api/extras/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteExtra(id: string) {
  const res = await fetch(`/api/extras/${id}`, { method: "DELETE" })
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export function getProducts() {
  return fetcher("/api/products")
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  image: string
  badge?: string
  inStock: boolean
  categoryId: string
  variants?: { name: string; price: number }[]
  extraIds?: string[]
}) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    image?: string
    badge?: string | null
    inStock?: boolean
    categoryId?: string
    variants?: { name: string; price: number }[]
    extraIds?: string[]
  }
) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteProduct(id: string) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

export function getOrders(status?: string) {
  const url = status ? `/api/orders?status=${status}` : "/api/orders"
  return fetcher(url)
}

export async function createOrder(data: {
  items: {
    product: { id: string }
    selectedVariant?: { id: string } | null
    quantity: number
    totalPrice: number
    observations?: string
    selectedExtras?: { id: string; price: number }[]
  }[]
  subtotal: number
  shippingCost: number
  paymentAdjustment: number
  total: number
  customer: {
    name: string
    phone: string
    email: string
    shippingMethod: string
    shippingMethodId?: string
    street?: string
    number?: string
    neighborhood?: string
    paymentMethod: string
    paymentMethodId?: string
    cashAmount?: string
    observations?: string
  }
}) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  return res.json()
}

export async function deleteOrder(id: string) {
  const res = await fetch(`/api/orders/${id}`, { method: "DELETE" })
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// SHIPPING METHODS
// ─────────────────────────────────────────────────────────────────────────────

export interface ShippingMethodData {
  id: string
  name: string
  description: string
  cost: number
  active: boolean
}

export function getShippingMethods(activeOnly = false) {
  const url = activeOnly ? "/api/shipping-methods?active=true" : "/api/shipping-methods"
  return fetcher(url)
}

export async function createShippingMethod(data: Partial<ShippingMethodData>) {
  const res = await fetch("/api/shipping-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateShippingMethod(id: string, data: Partial<ShippingMethodData>) {
  const res = await fetch(`/api/shipping-methods/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteShippingMethod(id: string) {
  const res = await fetch(`/api/shipping-methods/${id}`, { method: "DELETE" })
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS
// ─────────────────────────────────────────────────────────────────────────────

export interface PaymentMethodData {
  id: string
  name: string
  description: string
  adjustment: number
  active: boolean
}

export function getPaymentMethods(activeOnly = false) {
  const url = activeOnly ? "/api/payment-methods?active=true" : "/api/payment-methods"
  return fetcher(url)
}

export async function createPaymentMethod(data: Partial<PaymentMethodData>) {
  const res = await fetch("/api/payment-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethodData>) {
  const res = await fetch(`/api/payment-methods/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deletePaymentMethod(id: string) {
  const res = await fetch(`/api/payment-methods/${id}`, { method: "DELETE" })
  return res.json()
}
