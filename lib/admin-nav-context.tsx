"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type AdminSection =
  | "dashboard"
  | "productos"
  | "categorias"
  | "extras"
  | "envio"
  | "pagos"
  | "pedidos"
  | "config"

interface AdminNavContextType {
  activeSection: AdminSection
  setActiveSection: (s: AdminSection) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void
}

const AdminNavContext = createContext<AdminNavContextType | null>(null)

export function useAdminNav() {
  const ctx = useContext(AdminNavContext)
  if (!ctx) throw new Error("useAdminNav must be inside AdminNavProvider")
  return ctx
}

export function AdminNavProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <AdminNavContext.Provider
      value={{ activeSection, setActiveSection, mobileMenuOpen, setMobileMenuOpen }}
    >
      {children}
    </AdminNavContext.Provider>
  )
}
