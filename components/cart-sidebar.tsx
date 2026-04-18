"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderConfirmation } from "@/components/order-confirmation"
import { CartPriceSummary } from "@/components/cart-price-summary"
import { StoreConfig } from "@/lib/types"

type Step = "cart" | "checkout" | "confirmation"

interface CartSidebarProps {
  open: boolean
  onClose: () => void
  storeConfig?: StoreConfig
  
}

export function CartSidebar({ open, onClose, storeConfig }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, confirmedOrder, resetOrder } =
    useCart()
  const [step, setStep] = useState<Step>("cart")
  const isOpen = storeConfig?.isOpen ?? true

  const handleClose = () => {
    if (step === "confirmation") {
      resetOrder()
      setStep("cart")
    }
    onClose()
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) handleClose()
  }

  const handleProceedToCheckout = () => {
    setStep("checkout")
  }

  const handleBackToCart = () => {
    setStep("cart")
  }

  const handleOrderConfirmed = () => {
    setStep("confirmation")
  }

  const handleNewOrder = () => {
    resetOrder()
    setStep("cart")
    onClose()
  }

  const stepTitle = {
    cart: "Tu Pedido",
    checkout: "Datos del Pedido",
    confirmation: "Pedido Confirmado",
  }

  const stepDescription = {
    cart:
      items.length === 0
        ? "Tu carrito esta vacio"
        : `${totalItems} ${totalItems === 1 ? "producto" : "productos"} en tu carrito`,
    checkout: "Completa tus datos para finalizar",
    confirmation: "Tu pedido fue registrado con exito",
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col bg-card border-l-border/30 p-0 w-full sm:max-w-md">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/20">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button
                onClick={handleBackToCart}
                className="p-1.5 -ml-1.5 rounded-lg text-card-foreground/50 hover:text-card-foreground hover:bg-card-foreground/5 transition-colors"
                aria-label="Volver al carrito"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <SheetTitle className="text-lg font-bold text-card-foreground font-mono flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {stepTitle[step]}
            </SheetTitle>
          </div>
          <SheetDescription className="text-sm text-card-foreground/50">
            {stepDescription[step]}
          </SheetDescription>
        </SheetHeader>

        {/* Step: Cart */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-card-foreground/30">
                  <ShoppingBag className="w-16 h-16" />
                  <p className="text-sm font-medium">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 p-3 rounded-xl border border-border/20 bg-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-card-foreground truncate">
                            {item.product.name}
                            {item.selectedVariant && (
                              <span className="ml-1.5 text-xs font-normal text-card-foreground/50">
                                ({item.selectedVariant.name})
                              </span>
                            )}
                          </h4>
                          {item.selectedExtras.length > 0 && (
                            <p className="text-xs text-card-foreground/50 mt-0.5">
                              +{" "}
                              {item.selectedExtras
                                .map((e) => e.name)
                                .join(", ")}
                            </p>
                          )}
                          {item.observations && (
                            <p className="text-xs text-card-foreground/40 mt-0.5 italic">
                              {`"${item.observations}"`}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1.5 rounded-lg text-card-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label={`Eliminar ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/30 text-card-foreground/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-card-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/30 text-card-foreground/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary">
                          $
                          {(item.totalPrice * item.quantity).toLocaleString(
                            "es-AR"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-border/20 bg-card">
                <CartPriceSummary />
                <button
                  disabled={!isOpen}
                  onClick={handleProceedToCheckout}
                  className="w-full mt-4 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed "
                >
                  {isOpen ? "Continuar" : "Cerrado"}
                  
                  {isOpen && <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-2 px-4 py-2 rounded-xl text-sm font-medium text-card-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </>
        )}

        {/* Step: Checkout */}
        {step === "checkout" && (
          <CheckoutForm onOrderConfirmed={handleOrderConfirmed} />
        )}

        {/* Step: Confirmation */}
        {step === "confirmation" && confirmedOrder && (
          <OrderConfirmation
            order={confirmedOrder}
            onNewOrder={handleNewOrder}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
