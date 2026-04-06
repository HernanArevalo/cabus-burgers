"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
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
import { createOrder, getShippingMethods, getPaymentMethods } from "./api"

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
  shippingMethodLabel: string
  paymentMethodLabel: string
  total: number
  confirmedOrder: Order | null
  confirmOrder: (formData: CheckoutFormData) => Promise<boolean>
  resetOrder: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface ShippingMethodOption {
  id: string
  name: string
  cost: number
  active: boolean
}

interface PaymentMethodOption {
  id: string
  name: string
  adjustment: number
  active: boolean
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("retiro")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo")
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [shippingData, paymentData] = await Promise.all([
          getShippingMethods(true),
          getPaymentMethods(true),
        ])

        const normalizedShipping = (shippingData || []) as ShippingMethodOption[]
        const normalizedPayments = (paymentData || []) as PaymentMethodOption[]

        setShippingMethods(normalizedShipping)
        setPaymentMethods(normalizedPayments)

        if (normalizedShipping.length > 0) {
          setShippingMethod(normalizedShipping[0].id as ShippingMethod)
        }

        if (normalizedPayments.length > 0) {
          setPaymentMethod(normalizedPayments[0].id as PaymentMethod)
        }
      } catch (error) {
        console.error("Error fetching shipping/payment methods:", error)
      }
    }

    fetchOptions()
  }, [])

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
    setShippingMethod((shippingMethods[0]?.id ?? "retiro") as ShippingMethod)
    setPaymentMethod((paymentMethods[0]?.id ?? "efectivo") as PaymentMethod)
  }, [paymentMethods, shippingMethods])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0
  )

  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod)
  const shippingCost = selectedShipping?.cost ?? 0
  const shippingMethodLabel = selectedShipping?.name ?? "Sin metodo"

  const paymentOption = paymentMethods.find((p) => p.id === paymentMethod)
  const paymentAdjustmentPercent = paymentOption?.adjustment ?? 0
  const paymentMethodLabel = paymentOption?.name ?? "Sin metodo"

  const baseTotal = subtotal + shippingCost
  const paymentAdjustmentAmount = Math.round(
    (baseTotal * paymentAdjustmentPercent) / 100
  )
  const total = baseTotal + paymentAdjustmentAmount

  const confirmOrder = useCallback(
    async (formData: CheckoutFormData): Promise<boolean> => {
      try {
        const response = await createOrder({
          items: items.map((item) => ({
            product: { id: item.product.id },
            selectedVariant: item.selectedVariant ? { id: item.selectedVariant.id } : null,
            quantity: item.quantity,
            totalPrice: item.totalPrice * item.quantity,
            observations: item.observations,
            selectedExtras: item.selectedExtras.map((extra) => ({
              id: extra.id,
              price: extra.price,
            })),
          })),
          subtotal,
          shippingCost,
          paymentAdjustment: paymentAdjustmentAmount,
          total,
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            shippingMethod: formData.shippingMethod,
            shippingMethodId: formData.shippingMethod,
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            paymentMethod: formData.paymentMethod,
            paymentMethodId: formData.paymentMethod,
            cashAmount: formData.cashAmount,
            observations: formData.observations,
          },
        })

        const order: Order = {
          id: response.orderNumber ?? response.id ?? `ORD-${Date.now().toString(36).toUpperCase()}`,
          items: [...items],
          subtotal,
          shippingCost,
          paymentAdjustment: paymentAdjustmentAmount,
          total,
          customer: formData,
          status: "PENDIENTE",
          createdAt: response.createdAt ?? new Date().toISOString(),
        }

        setConfirmedOrder(order)
        return true
      } catch (error) {
        console.error("Error confirming order:", error)
        return false
      }
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
      shippingMethodLabel,
      paymentMethodLabel,
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
      shippingMethodLabel,
      paymentMethodLabel,
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
