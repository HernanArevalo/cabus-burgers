"use client"

import { useCart } from "@/lib/cart-context"
import { ShoppingBag } from "lucide-react"

interface CartFloatingButtonProps {
  onClick: () => void
}

export function CartFloatingButton({ onClick }: CartFloatingButtonProps) {
  const { totalItems, subtotal } = useCart()

  if (totalItems === 0) return null

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-4 right-4 z-40 max-w-lg mx-auto flex items-center justify-between px-5 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/30 transition-all hover:brightness-110 active:scale-[0.98] sm:bottom-8"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-background text-foreground text-[10px] font-bold">
            {totalItems}
          </span>
        </div>
        <span className="text-sm font-bold">Ver mi pedido</span>
      </div>
      <span className="text-base font-bold">
        ${subtotal.toLocaleString("es-AR")}
      </span>
    </button>
  )
}
