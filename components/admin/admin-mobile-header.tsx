"use client"

import { Menu } from "lucide-react"
import { useAdminNav, type AdminSection } from "@/lib/admin-nav-context"

const sectionLabels: Record<AdminSection, string> = {
  dashboard: "Dashboard",
  productos: "Productos",
  categorias: "Categorias",
  extras: "Extras",
  envio: "Metodos de envio",
  pagos: "Metodos de pago",
  pedidos: "Pedidos",
  config: "Configuracion",
}

export function AdminMobileHeader() {
  const { activeSection, setMobileMenuOpen } = useAdminNav()

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 border-b lg:hidden"
      style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
    >
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
        style={{ background: "#f0f0ed" }}
        aria-label="Abrir menu"
      >
        <Menu className="w-[18px] h-[18px]" style={{ color: "#1c1c1c" }} />
      </button>
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black font-mono shrink-0"
          style={{ background: "#1a3a2a", color: "#d4a017" }}
        >
          C
        </div>
        <p className="text-sm font-semibold truncate" style={{ color: "#1c1c1c" }}>
          {sectionLabels[activeSection]}
        </p>
      </div>
    </header>
  )
}
