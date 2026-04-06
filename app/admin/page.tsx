"use client"

import { useAdminNav } from "@/lib/admin-nav-context"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminProducts } from "@/components/admin/admin-products"
import { AdminCategories } from "@/components/admin/admin-categories"
import { AdminExtras } from "@/components/admin/admin-extras"
import { AdminShipping } from "@/components/admin/admin-shipping"
import { AdminPayments } from "@/components/admin/admin-payments"
import { AdminOrders } from "@/components/admin/admin-orders"
import { AdminStoreConfig } from "@/components/admin/admin-store-config"

export default function AdminPage() {
  const { activeSection } = useAdminNav()

  return (
    <>
      {activeSection === "dashboard" && <AdminDashboard />}
      {activeSection === "productos" && <AdminProducts />}
      {activeSection === "categorias" && <AdminCategories />}
      {activeSection === "extras" && <AdminExtras />}
      {activeSection === "envio" && <AdminShipping />}
      {activeSection === "pagos" && <AdminPayments />}
      {activeSection === "pedidos" && <AdminOrders />}
      {activeSection === "config" && <AdminStoreConfig />}
    </>
  )
}
