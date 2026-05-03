"use client"

import { useCart } from "@/lib/cart-context"

export function CartPriceSummary() {
  const {
    subtotal,
    shippingMethod,
    shippingCost,
    paymentMethod,
    paymentAdjustmentPercent,
    paymentAdjustmentAmount,
    total,
  } = useCart()

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between text-card-foreground/60">
        <span>Subtotal productos</span>
        <span>${subtotal.toLocaleString("es-AR")}</span>
      </div>

      <div className="flex items-center justify-between text-card-foreground/60">
        <span>
          Envio{" "}
          <span className="text-card-foreground/40">
            ({shippingMethod === "delivery" ? "Delivery" : "Retiro en local"})
          </span>
        </span>
        <span>
          {shippingCost === 0
            ? "Gratis"
            : `$${shippingCost.toLocaleString("es-AR")}`}
        </span>
      </div>

      {paymentAdjustmentPercent !== 0 && (
        <div
          className={`flex items-center justify-between ${
            paymentAdjustmentPercent < 0
              ? "text-green-600"
              : "text-orange-500"
          }`}
        >
          <span>
            {paymentAdjustmentPercent < 0 ? "Descuento" : "Recargo"}{" "}
            {paymentMethod === "transferencia"
              ? "transferencia"
              : "MercadoPago"}{" "}
            ({Math.abs(paymentAdjustmentPercent)}%)
          </span>
          <span>
            {paymentAdjustmentAmount < 0 ? "-" : "+"}$
            {Math.abs(paymentAdjustmentAmount).toLocaleString("es-AR")}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/20">
        <span className="font-bold text-card-foreground text-base">Total</span>
        <span className="font-bold text-card-foreground text-xl">
          ${total.toLocaleString("es-AR")}
        </span>
      </div>
    </div>
  )
}
