"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import type {
  CartItem,
  Product,
  Extra,
  Variant,
  ShippingMethod,
  PaymentMethod,
  Order,
  CheckoutFormData,
} from "./types"
import { DELIVERY_COST, paymentMethods } from "./mock-data"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, selectedVariant: Variant | null, selectedExtras: Extra[], observations: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  shippingMethod: ShippingMethod
  setShippingMethod: (method: ShippingMethod) => void
  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void
  shippingCost: number
  paymentAdjustmentAmount: number
  paymentAdjustmentPercent: number
  total: number
  confirmedOrder: Order | null
  confirmOrder: (formData: CheckoutFormData) => void
  resetOrder: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("retiro")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo")
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  const addItem = useCallback(
    (product: Product, selectedVariant: Variant | null, selectedExtras: Extra[], observations: string) => {
      const basePrice = selectedVariant ? selectedVariant.price : product.price
      const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
      const totalPrice = basePrice + extrasTotal

      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        selectedVariant,
        selectedExtras,
        observations,
        totalPrice,
      }

      setItems((prev) => [...prev, newItem])
    },
    []
  )

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId))
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setShippingMethod("retiro")
    setPaymentMethod("efectivo")
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0
  )

  const shippingCost = shippingMethod === "delivery" ? DELIVERY_COST : 0

  const paymentOption = paymentMethods.find((p) => p.id === paymentMethod)
  const paymentAdjustmentPercent = paymentOption?.adjustment ?? 0

  const baseTotal = subtotal + shippingCost
  const paymentAdjustmentAmount = Math.round(
    (baseTotal * paymentAdjustmentPercent) / 100
  )
  const total = baseTotal + paymentAdjustmentAmount

  const confirmOrder = useCallback(
    (formData: CheckoutFormData) => {
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        items: [...items],
        subtotal,
        shippingCost,
        paymentAdjustment: paymentAdjustmentAmount,
        total,
        customer: formData,
        status: "PENDIENTE",
        createdAt: new Date().toISOString(),
      }
      setConfirmedOrder(order)
    },
    [items, subtotal, shippingCost, paymentAdjustmentAmount, total]
  )

  const resetOrder = useCallback(() => {
    setConfirmedOrder(null)
    clearCart()
  }, [clearCart])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      shippingMethod,
      setShippingMethod,
      paymentMethod,
      setPaymentMethod,
      shippingCost,
      paymentAdjustmentAmount,
      paymentAdjustmentPercent,
      total,
      confirmedOrder,
      confirmOrder,
      resetOrder,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      shippingMethod,
      paymentMethod,
      shippingCost,
      paymentAdjustmentAmount,
      paymentAdjustmentPercent,
      total,
      confirmedOrder,
      confirmOrder,
      resetOrder,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
