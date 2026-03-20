"use client"

import { AdminNavProvider, useAdminNav } from "@/lib/admin-nav-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileHeader } from "@/components/admin/admin-mobile-header"

function AdminShell({ children }: { children: React.ReactNode }) {
  const { mobileMenuOpen, setMobileMenuOpen, activeSection, setActiveSection } = useAdminNav()

  return (
    <div className="flex min-h-screen" style={{ background: "#f4f4f1" }}>
      {/* Desktop sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={(s) => {
          setActiveSection(s)
          setMobileMenuOpen(false)
        }}
        className="hidden lg:flex"
      />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={(s) => {
              setActiveSection(s)
              setMobileMenuOpen(false)
            }}
            className="fixed inset-y-0 left-0 z-50 lg:hidden animate-in slide-in-from-left duration-200"
          />
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminNavProvider>
      <AdminShell>{children}</AdminShell>
    </AdminNavProvider>
  )
}
