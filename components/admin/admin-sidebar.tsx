"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Puzzle,
  Truck,
  CreditCard,
  ClipboardList,
  Settings,
  ArrowLeft,
} from "lucide-react"
import type { AdminSection } from "@/lib/admin-nav-context"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  activeSection: AdminSection
  onSectionChange: (s: AdminSection) => void
  className?: string
}

const navItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "productos", label: "Productos", icon: Package },
  { id: "categorias", label: "Categorias", icon: FolderOpen },
  { id: "extras", label: "Extras", icon: Puzzle },
  { id: "envio", label: "Metodos de envio", icon: Truck },
  { id: "pagos", label: "Metodos de pago", icon: CreditCard },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList },
  { id: "config", label: "Configuracion", icon: Settings },
]

export function AdminSidebar({ activeSection, onSectionChange, className }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 flex-col shrink-0 border-r",
        className
      )}
      style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
    >
      {/* Logo section */}
      <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: "#e8e8e5" }}>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black font-mono"
          style={{ background: "#1a3a2a", color: "#d4a017" }}
        >
          C
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold font-mono truncate" style={{ color: "#1c1c1c" }}>
            CABUS
          </p>
          <p className="text-[11px] font-medium" style={{ color: "#999999" }}>
            Panel Admin
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full",
                isActive ? "font-semibold" : "hover:opacity-80"
              )}
              style={
                isActive
                  ? { background: "#f0f0ed", color: "#1c1c1c" }
                  : { color: "#777777" }
              }
            >
              <item.icon
                className="w-[18px] h-[18px] shrink-0"
                style={{ color: isActive ? "#1a3a2a" : "#aaaaaa" }}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Back to store */}
      <div className="p-3 border-t" style={{ borderColor: "#e8e8e5" }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
          style={{ color: "#777777" }}
        >
          <ArrowLeft className="w-[18px] h-[18px] shrink-0" style={{ color: "#aaaaaa" }} />
          Volver a la tienda
        </Link>
      </div>
    </aside>
  )
}
