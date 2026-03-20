"use client"

import { useState } from "react"
import type { Order, OrderStatus } from "@/lib/types"
import { mockOrders as initialOrders, mockStoreConfig } from "@/lib/admin-mock-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Clock,
  Check,
  ChefHat,
  Truck,
  Package,
  XCircle,
  MessageCircle,
  Eye,
} from "lucide-react"

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  PENDIENTE: { label: "Pendiente", icon: Clock, color: "#d4a017", bgColor: "rgba(212, 160, 23, 0.08)" },
  CONFIRMADO: { label: "Confirmado", icon: Check, color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.08)" },
  EN_PREPARACION: { label: "Preparando", icon: ChefHat, color: "#f97316", bgColor: "rgba(249, 115, 22, 0.08)" },
  LISTO: { label: "Listo", icon: Package, color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.08)" },
  ENVIADO: { label: "Enviado", icon: Truck, color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.08)" },
  ENTREGADO: { label: "Entregado", icon: Check, color: "#16a34a", bgColor: "rgba(22, 163, 74, 0.08)" },
  CANCELADO: { label: "Cancelado", icon: XCircle, color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.08)" },
}

const statusFlow: OrderStatus[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_PREPARACION",
  "LISTO",
  "ENVIADO",
  "ENTREGADO",
]

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = statusFlow.indexOf(current)
  if (idx === -1 || idx >= statusFlow.length - 1) return null
  return statusFlow[idx + 1]
}

const nextStatusLabel: Record<string, string> = {
  PENDIENTE: "Confirmar",
  CONFIRMADO: "Preparando",
  EN_PREPARACION: "Marcar listo",
  LISTO: "Enviar",
  ENVIADO: "Entregado",
}

function generateWhatsAppMessage(order: Order): string {
  const template = mockStoreConfig.messageTemplates.orderConfirmation
  return template
    .replace("{{nombre}}", order.customer.name)
    .replace("{{pedido_id}}", order.id)
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filterStatus, setFilterStatus] = useState<"todos" | OrderStatus>("todos")
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)

  const filteredOrders =
    filterStatus === "todos"
      ? orders
      : orders.filter((o) => o.status === filterStatus)

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    if (detailOrder?.id === orderId) {
      setDetailOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleCancel = (orderId: string) => {
    handleStatusChange(orderId, "CANCELADO")
  }

  const openWhatsApp = (order: Order) => {
    const message = generateWhatsAppMessage(order)
    const url = `https://wa.me/${order.customer.phone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Pedidos</h1>
          <p className="text-sm mt-1" style={{ color: "#999999" }}>
            {orders.length} pedidos del dia
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        <button
          onClick={() => setFilterStatus("todos")}
          className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          style={
            filterStatus === "todos"
              ? { background: "#1a3a2a", color: "#f5f5f0" }
              : { background: "#ffffff", color: "#888888", border: "1px solid #e8e8e5" }
          }
        >
          Todos ({orders.length})
        </button>
        {(Object.entries(statusConfig) as [OrderStatus, typeof statusConfig[OrderStatus]][]).map(
          ([status, config]) => {
            const count = orders.filter((o) => o.status === status).length
            if (count === 0) return null
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={
                  filterStatus === status
                    ? { background: config.color, color: "#ffffff" }
                    : { background: "#ffffff", color: "#888888", border: "1px solid #e8e8e5" }
                }
              >
                {config.label} ({count})
              </button>
            )
          }
        )}
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-3">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status]
          const StatusIcon = status.icon
          const next = getNextStatus(order.status)

          return (
            <div
              key={order.id}
              className="rounded-xl border p-4"
              style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
            >
              {/* Top row: id, time, status */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm" style={{ color: "#1c1c1c" }}>
                      {order.id}
                    </p>
                    <span className="text-xs" style={{ color: "#aaaaaa" }}>
                      {formatTime(order.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-0.5" style={{ color: "#888888" }}>
                    {order.customer.name} - {order.customer.shippingMethod === "delivery" ? "Delivery" : "Retiro"}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0"
                  style={{ background: status.bgColor, color: status.color }}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>

              {/* Items summary */}
              <div className="flex flex-col gap-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span style={{ color: "#555555" }}>
                      {item.quantity}x {item.product.name}
                      {item.selectedExtras.length > 0 && (
                        <span className="text-xs ml-1" style={{ color: "#aaaaaa" }}>
                          (+{item.selectedExtras.map((e) => e.name).join(", ")})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom actions */}
              <div
                className="flex items-center justify-between pt-3 flex-wrap gap-2"
                style={{ borderTop: "1px solid #f0f0ed" }}
              >
                <span className="text-sm font-bold" style={{ color: "#1c1c1c" }}>
                  Total: ${order.total.toLocaleString("es-AR")}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailOrder(order)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                    aria-label="Ver detalle"
                  >
                    <Eye className="w-4 h-4" style={{ color: "#888888" }} />
                  </button>

                  <button
                    onClick={() => openWhatsApp(order)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-green-50"
                    aria-label="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
                  </button>

                  {next && (
                    <button
                      onClick={() => handleStatusChange(order.id, next)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:brightness-110"
                      style={{ background: status.color, color: "#ffffff" }}
                    >
                      {nextStatusLabel[order.status]}
                    </button>
                  )}

                  {order.status !== "CANCELADO" && order.status !== "ENTREGADO" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-red-50"
                      style={{ color: "#ef4444", border: "1px solid #fecaca" }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filteredOrders.length === 0 && (
          <div
            className="py-12 text-center rounded-xl border"
            style={{ background: "#ffffff", borderColor: "#e8e8e5", color: "#aaaaaa" }}
          >
            <p className="text-sm">No hay pedidos con este estado</p>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          style={{ background: "#ffffff" }}
        >
          {detailOrder && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: "#1c1c1c" }}>
                  Pedido {detailOrder.id}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-2">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: statusConfig[detailOrder.status].bgColor,
                      color: statusConfig[detailOrder.status].color,
                    }}
                  >
                    {statusConfig[detailOrder.status].label}
                  </span>
                  <span className="text-xs" style={{ color: "#aaaaaa" }}>
                    {formatTime(detailOrder.createdAt)}
                  </span>
                </div>

                {/* Customer info */}
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "#fafaf8" }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: "#999999" }}>
                    CLIENTE
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
                    {detailOrder.customer.name}
                  </p>
                  <p className="text-sm" style={{ color: "#666666" }}>
                    {detailOrder.customer.phone}
                  </p>
                  {detailOrder.customer.email && (
                    <p className="text-sm" style={{ color: "#666666" }}>
                      {detailOrder.customer.email}
                    </p>
                  )}
                  {detailOrder.customer.shippingMethod === "delivery" && (
                    <p className="text-sm mt-1" style={{ color: "#666666" }}>
                      {detailOrder.customer.street} {detailOrder.customer.number},{" "}
                      {detailOrder.customer.neighborhood}
                    </p>
                  )}
                  {detailOrder.customer.observations && (
                    <p className="text-sm mt-1 italic" style={{ color: "#999999" }}>
                      {`"${detailOrder.customer.observations}"`}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#999999" }}>
                    ITEMS
                  </p>
                  <div className="flex flex-col gap-2">
                    {detailOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span style={{ color: "#1c1c1c" }}>
                            {item.quantity}x {item.product.name}
                          </span>
                          {item.selectedExtras.length > 0 && (
                            <p className="text-xs" style={{ color: "#aaaaaa" }}>
                              +{item.selectedExtras.map((e) => e.name).join(", ")}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold" style={{ color: "#1c1c1c" }}>
                          ${item.totalPrice.toLocaleString("es-AR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div
                  className="p-3 rounded-lg flex flex-col gap-1.5"
                  style={{ background: "#fafaf8" }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#666666" }}>Subtotal</span>
                    <span style={{ color: "#1c1c1c" }}>
                      ${detailOrder.subtotal.toLocaleString("es-AR")}
                    </span>
                  </div>
                  {detailOrder.shippingCost > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#666666" }}>Envio</span>
                      <span style={{ color: "#1c1c1c" }}>
                        ${detailOrder.shippingCost.toLocaleString("es-AR")}
                      </span>
                    </div>
                  )}
                  {detailOrder.paymentAdjustment !== 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#666666" }}>
                        {detailOrder.paymentAdjustment < 0 ? "Descuento" : "Recargo"}
                      </span>
                      <span
                        style={{
                          color: detailOrder.paymentAdjustment < 0 ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {detailOrder.paymentAdjustment < 0 ? "-" : "+"}$
                        {Math.abs(detailOrder.paymentAdjustment).toLocaleString("es-AR")}
                      </span>
                    </div>
                  )}
                  <div
                    className="flex items-center justify-between text-sm font-bold pt-2 mt-1"
                    style={{ borderTop: "1px solid #e8e8e5", color: "#1c1c1c" }}
                  >
                    <span>Total</span>
                    <span>${detailOrder.total.toLocaleString("es-AR")}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#999999" }}>
                    Pago: {detailOrder.customer.paymentMethod}
                    {detailOrder.customer.cashAmount &&
                      ` (con $${parseInt(detailOrder.customer.cashAmount).toLocaleString("es-AR")})`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      openWhatsApp(detailOrder)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: "#22c55e", color: "#ffffff" }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  {getNextStatus(detailOrder.status) && (
                    <button
                      onClick={() => {
                        const next = getNextStatus(detailOrder.status)
                        if (next) handleStatusChange(detailOrder.id, next)
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                      style={{ background: "#1a3a2a", color: "#f5f5f0" }}
                    >
                      {nextStatusLabel[detailOrder.status]}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
