"use client"

import type { Order } from "@/lib/types"
import { Check, MessageCircle, RotateCcw } from "lucide-react"

interface OrderConfirmationProps {
  order: Order
  onNewOrder: () => void
}

function buildWhatsAppMessage(order: Order): string {
  const lines: string[] = []

  lines.push(`*Nuevo pedido - CABUS HAMBURGUESAS*`)
  lines.push(``)
  lines.push(`*Pedido:* ${order.id}`)
  lines.push(`*Nombre:* ${order.customer.name}`)
  lines.push(`*Telefono:* ${order.customer.phone}`)
  lines.push(`*Email:* ${order.customer.email}`)
  lines.push(``)
  lines.push(`---`)
  lines.push(`*Productos:*`)

  order.items.forEach((item) => {
    const variantStr = item.selectedVariant ? ` [${item.selectedVariant.name}]` : ""
    const extrasStr =
      item.selectedExtras.length > 0
        ? ` + ${item.selectedExtras.map((e) => e.name).join(", ")}`
        : ""
    const obsStr = item.observations ? ` (${item.observations})` : ""
    lines.push(
      `- ${item.quantity}x ${item.product.name}${variantStr}${extrasStr}${obsStr} - $${(
        item.totalPrice * item.quantity
      ).toLocaleString("es-AR")}`
    )
  })

  lines.push(``)
  lines.push(`---`)
  lines.push(`*Subtotal:* $${order.subtotal.toLocaleString("es-AR")}`)

  if (order.shippingCost > 0) {
    lines.push(`*Envio (Delivery):* $${order.shippingCost.toLocaleString("es-AR")}`)
  } else {
    lines.push(`*Envio:* Retiro en local`)
  }

  if (order.paymentAdjustment !== 0) {
    const label = order.paymentAdjustment < 0 ? "Descuento" : "Recargo"
    lines.push(
      `*${label}:* ${order.paymentAdjustment < 0 ? "-" : "+"}$${Math.abs(
        order.paymentAdjustment
      ).toLocaleString("es-AR")}`
    )
  }

  lines.push(`*TOTAL: $${order.total.toLocaleString("es-AR")}*`)
  lines.push(``)

  const paymentLabels = {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    mercadopago: "MercadoPago",
  }
  lines.push(`*Metodo de pago:* ${paymentLabels[order.customer.paymentMethod]}`)

  if (
    order.customer.paymentMethod === "efectivo" &&
    order.customer.cashAmount
  ) {
    lines.push(`*Paga con:* $${order.customer.cashAmount}`)
  }

  const shippingLabels = {
    retiro: "Retiro en local",
    delivery: "Delivery",
  }
  lines.push(
    `*Metodo de envio:* ${shippingLabels[order.customer.shippingMethod]}`
  )

  if (order.customer.shippingMethod === "delivery") {
    lines.push(
      `*Direccion:* ${order.customer.street} ${order.customer.number}, ${order.customer.neighborhood}`
    )
  }

  if (order.customer.observations) {
    lines.push(``)
    lines.push(`*Observaciones:* ${order.customer.observations}`)
  }

  return lines.join("\n")
}

export function OrderConfirmation({
  order,
  onNewOrder,
}: OrderConfirmationProps) {
  const whatsappMessage = buildWhatsAppMessage(order)
  // Replace with real number
  const whatsappNumber = "5491112345678"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 px-5 py-6">
        <div className="flex flex-col items-center gap-6">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-card-foreground font-mono">
              Pedido confirmado
            </h3>
            <p className="text-sm text-card-foreground/50 mt-1">
              Pedido #{order.id}
            </p>
          </div>

          {/* Order summary */}
          <div className="w-full p-4 rounded-xl border border-border/20 bg-card-foreground/[0.02]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-card-foreground/40 mb-3">
              Resumen
            </h4>
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-card-foreground/70">
                    {item.quantity}x {item.product.name}
                    {item.selectedVariant && (
                      <span className="text-card-foreground/40 text-xs ml-1">
                        ({item.selectedVariant.name})
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-card-foreground">
                    $
                    {(item.totalPrice * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}

              <div className="border-t border-border/20 pt-2 mt-1">
                <div className="flex items-center justify-between text-sm text-card-foreground/60">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toLocaleString("es-AR")}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex items-center justify-between text-sm text-card-foreground/60">
                    <span>Envio</span>
                    <span>
                      ${order.shippingCost.toLocaleString("es-AR")}
                    </span>
                  </div>
                )}
                {order.paymentAdjustment !== 0 && (
                  <div
                    className={`flex items-center justify-between text-sm ${
                      order.paymentAdjustment < 0
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    <span>
                      {order.paymentAdjustment < 0 ? "Descuento" : "Recargo"}
                    </span>
                    <span>
                      {order.paymentAdjustment < 0 ? "-" : "+"}$
                      {Math.abs(order.paymentAdjustment).toLocaleString(
                        "es-AR"
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/20">
                <span className="font-bold text-card-foreground">Total</span>
                <span className="font-bold text-card-foreground text-lg">
                  ${order.total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="w-full p-4 rounded-xl border border-border/20 bg-card-foreground/[0.02]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-card-foreground/40 mb-3">
              Datos del pedido
            </h4>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-card-foreground/50">Nombre</span>
                <span className="text-card-foreground font-medium">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-card-foreground/50">Envio</span>
                <span className="text-card-foreground font-medium">
                  {order.customer.shippingMethod === "retiro"
                    ? "Retiro en local"
                    : "Delivery"}
                </span>
              </div>
              {order.customer.shippingMethod === "delivery" && (
                <div className="flex justify-between">
                  <span className="text-card-foreground/50">Direccion</span>
                  <span className="text-card-foreground font-medium text-right">
                    {order.customer.street} {order.customer.number},{" "}
                    {order.customer.neighborhood}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-card-foreground/50">Pago</span>
                <span className="text-card-foreground font-medium capitalize">
                  {order.customer.paymentMethod}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-5 py-4 border-t border-border/20 bg-card flex flex-col gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-6 py-4 rounded-xl bg-[#25D366] text-white font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Enviar pedido por WhatsApp
        </a>
        <button
          onClick={onNewOrder}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium text-card-foreground/50 hover:text-card-foreground hover:bg-card-foreground/5 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Hacer otro pedido
        </button>
      </div>
    </div>
  )
}
