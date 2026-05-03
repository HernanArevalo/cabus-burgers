export interface Extra {
  id: string
  name: string
  price: number
  inStock: boolean
}

export interface Variant {
  id: string
  name: string
  price: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number        // base price shown when no variants; or minimum variant price
  image: string
  category: string
  badge?: string
  inStock: boolean
  extras: Extra[]
  variants: Variant[]  // if empty, no variant selection shown
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedVariant: Variant | null
  selectedExtras: Extra[]
  observations: string
  totalPrice: number
}

export interface StoreStatus {
  isOpen: boolean
  nextOpenTime?: string
}

export type ShippingMethod = "retiro" | "delivery"
export type PaymentMethod = "efectivo" | "transferencia" | "mercadopago"

export interface PaymentMethodOption {
  id: PaymentMethod
  label: string
  description: string
  adjustment: number // percentage: negative = discount, positive = surcharge
}

export interface CheckoutFormData {
  name: string
  phone: string
  email: string
  shippingMethod: ShippingMethod
  street: string
  number: string
  neighborhood: string
  paymentMethod: PaymentMethod
  cashAmount: string
  observations: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  paymentAdjustment: number
  total: number
  customer: CheckoutFormData
  status: OrderStatus
  createdAt: string
}

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "LISTO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO"

export interface Category {
  id: string
  name: string
  order: number
  active: boolean
}

export interface ShippingMethodConfig {
  id: string
  name: string
  description: string
  cost: number
  active: boolean
}

export interface PaymentMethodConfig {
  id: string
  name: string
  description: string
  adjustment: number
  active: boolean
}

export interface StoreConfig {
  name: string
  logo: string
  coverImage: string
  description: string
  tagline: string
  whatsapp: string
  isOpen: boolean
  estimatedCloseTime: string
  messageTemplates: {
    orderConfirmation: string
    orderReady: string
    orderDelivery: string
  }
}
