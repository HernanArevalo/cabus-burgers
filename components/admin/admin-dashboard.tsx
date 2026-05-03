"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Clock,
  Check,
  ChefHat,
  Truck,
  Store,
} from "lucide-react"
import { mockOrders, mockStoreConfig } from "@/lib/admin-mock-data"
import type { StoreConfig } from "@/lib/types"
import { getStoreConfig, updateStoreConfig } from "@/lib/api"

export function AdminDashboard() {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(mockStoreConfig)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    getStoreConfig().then((data) => {
      if (data && !data.error) setStoreConfig(data)
    }).catch(() => {})
  }, [])

  async function toggleStoreOpen() {
    setIsUpdating(true)
    try {
      const newIsOpen = !storeConfig.isOpen
      await updateStoreConfig({ isOpen: newIsOpen })
      setStoreConfig((prev) => ({ ...prev, isOpen: newIsOpen }))
    } catch (err) {
      console.error("Failed to update store status", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const todayOrders = mockOrders
  const totalSales = todayOrders.reduce((acc, o) => acc + o.total, 0)
  const totalOrders = todayOrders.length

  // Most sold product (simulated from order items)
  const productCounts: Record<string, { name: string; count: number }> = {}
  todayOrders.forEach((o) =>
    o.items.forEach((item) => {
      const name = item.product.name
      if (!productCounts[name]) productCounts[name] = { name, count: 0 }
      productCounts[name].count += item.quantity
    })
  )
  const mostSold = Object.values(productCounts).sort((a, b) => b.count - a.count)[0]

  // Most used payment method
  const payCounts: Record<string, number> = {}
  todayOrders.forEach((o) => {
    const m = o.customer.paymentMethod
    payCounts[m] = (payCounts[m] || 0) + 1
  })
  const mostUsedPay = Object.entries(payCounts).sort(([, a], [, b]) => b - a)[0]
  const payLabels: Record<string, string> = {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    mercadopago: "MercadoPago",
  }

  const stats = [
    {
      label: "Ventas hoy",
      value: `$${totalSales.toLocaleString("es-AR")}`,
      icon: DollarSign,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.08)",
    },
    {
      label: "Total pedidos",
      value: totalOrders,
      icon: ShoppingBag,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.08)",
    },
    {
      label: "Mas vendido",
      value: mostSold?.name ?? "-",
      icon: TrendingUp,
      color: "#d4a017",
      bgColor: "rgba(212, 160, 23, 0.08)",
    },
    {
      label: "Pago favorito",
      value: mostUsedPay ? payLabels[mostUsedPay[0]] || mostUsedPay[0] : "-",
      icon: CreditCard,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.08)",
    },
  ]

  // Orders by status
  const statusGroups = {
    PENDIENTE: { label: "Pendientes", icon: Clock, color: "#d4a017" },
    CONFIRMADO: { label: "Confirmados", icon: Check, color: "#3b82f6" },
    EN_PREPARACION: { label: "Preparando", icon: ChefHat, color: "#f97316" },
    LISTO: { label: "Listos", icon: Check, color: "#22c55e" },
    ENVIADO: { label: "Enviados", icon: Truck, color: "#8b5cf6" },
  } as const

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#999999" }}>Resumen del dia</p>
      </div>

      {/* Store info card */}
      <div
        className="rounded-xl border p-4 mb-6 flex items-center justify-between gap-4"
        style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
            style={{ background: storeConfig.isOpen ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)" }}
          >
            <Store
              className="w-5 h-5"
              style={{ color: storeConfig.isOpen ? "#22c55e" : "#ef4444" }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "#1c1c1c" }}>
              {storeConfig.name}
            </p>
            <p className="text-xs truncate" style={{ color: "#999999" }}>
              {storeConfig.description || storeConfig.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: storeConfig.isOpen ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
              color: storeConfig.isOpen ? "#22c55e" : "#ef4444",
            }}
          >
            {storeConfig.isOpen ? "Abierta" : "Cerrada"}
          </span>
          <button
            onClick={toggleStoreOpen}
            disabled={isUpdating}
            className="relative w-11 h-6 rounded-full transition-colors disabled:opacity-50"
            style={{ background: storeConfig.isOpen ? "#1a3a2a" : "#d4d4d4" }}
            role="switch"
            aria-checked={storeConfig.isOpen}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
              style={{
                background: "#ffffff",
                left: storeConfig.isOpen ? "calc(100% - 22px)" : "2px",
              }}
            />
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 p-4 rounded-xl border"
            style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: stat.bgColor }}
            >
              <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-lg font-bold truncate" style={{ color: "#1c1c1c" }}>
                {stat.value}
              </p>
              <p className="text-xs font-medium" style={{ color: "#999999" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders by status */}
      <div className="mb-2">
        <h2 className="text-base font-bold mb-4" style={{ color: "#1c1c1c" }}>
          Pedidos activos
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(statusGroups) as [keyof typeof statusGroups, typeof statusGroups[keyof typeof statusGroups]][]).map(
            ([status, config]) => {
              const count = todayOrders.filter((o) => o.status === status).length
              return (
                <div
                  key={status}
                  className="flex items-center gap-3 p-4 rounded-xl border"
                  style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
                    style={{ background: `${config.color}10` }}
                  >
                    <config.icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-bold" style={{ color: "#1c1c1c" }}>{count}</p>
                    <p className="text-xs font-medium" style={{ color: "#999999" }}>
                      {config.label}
                    </p>
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
