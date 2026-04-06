"use client"

import { useEffect, useMemo, useState } from "react"
import { DollarSign, ShoppingBag, TrendingUp, CreditCard, Clock, Check, ChefHat, Truck } from "lucide-react"
import { getOrders } from "@/lib/api"
import type { Order } from "@/lib/types"

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    getOrders().then((data) => setOrders(data || []))
  }, [])

  const stats = useMemo(() => {
    const totalSales = orders.reduce((acc, o) => acc + o.total, 0)
    const totalOrders = orders.length
    const productCounts: Record<string, number> = {}
    const payCounts: Record<string, number> = {}

    orders.forEach((o) => {
      o.items.forEach((item) => {
        productCounts[item.product.name] = (productCounts[item.product.name] || 0) + item.quantity
      })
      payCounts[o.customer.paymentMethod] = (payCounts[o.customer.paymentMethod] || 0) + 1
    })

    const mostSold = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-"
    const mostUsedPay = Object.entries(payCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-"

    return [
      { label: "Ventas hoy", value: `$${totalSales.toLocaleString("es-AR")}`, icon: DollarSign, color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.08)" },
      { label: "Total pedidos", value: totalOrders, icon: ShoppingBag, color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.08)" },
      { label: "Mas vendido", value: mostSold, icon: TrendingUp, color: "#d4a017", bgColor: "rgba(212, 160, 23, 0.08)" },
      { label: "Pago favorito", value: mostUsedPay, icon: CreditCard, color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.08)" },
    ]
  }, [orders])

  const statusGroups = {
    PENDIENTE: { label: "Pendientes", icon: Clock, color: "#d4a017" },
    CONFIRMADO: { label: "Confirmados", icon: Check, color: "#3b82f6" },
    EN_PREPARACION: { label: "Preparando", icon: ChefHat, color: "#f97316" },
    LISTO: { label: "Listos", icon: Check, color: "#22c55e" },
    ENVIADO: { label: "Enviados", icon: Truck, color: "#8b5cf6" },
  } as const

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6"><h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Dashboard</h1><p className="text-sm mt-1" style={{ color: "#999999" }}>Resumen del dia</p></div>
      <div className="grid grid-cols-2 gap-3 mb-8 lg:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="flex flex-col gap-3 p-4 rounded-xl border" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}><div className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ background: stat.bgColor }}><stat.icon className="w-[18px] h-[18px]" style={{ color: stat.color }} /></div><div><p className="text-lg font-bold truncate" style={{ color: "#1c1c1c" }}>{stat.value}</p><p className="text-xs font-medium" style={{ color: "#999999" }}>{stat.label}</p></div></div>)}</div>
      <div className="mb-2"><h2 className="text-base font-bold mb-4" style={{ color: "#1c1c1c" }}>Pedidos activos</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(statusGroups).map(([status, config]) => { const count = orders.filter((o) => o.status === status).length; return <div key={status} className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}><div className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0" style={{ background: `${config.color}10` }}><config.icon className="w-5 h-5" style={{ color: config.color }} /></div><div className="min-w-0"><p className="text-xl font-bold" style={{ color: "#1c1c1c" }}>{count}</p><p className="text-xs font-medium" style={{ color: "#999999" }}>{config.label}</p></div></div> })}</div></div>
    </div>
  )
}
