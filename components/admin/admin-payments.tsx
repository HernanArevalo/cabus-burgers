"use client"

import { useState } from "react"
import type { PaymentMethodConfig } from "@/lib/types"
import { mockPaymentMethods } from "@/lib/admin-mock-data"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdminPayments() {
  const [methods, setMethods] = useState<PaymentMethodConfig[]>(mockPaymentMethods)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethodConfig | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formAdjustment, setFormAdjustment] = useState("")
  const [formActive, setFormActive] = useState(true)

  const openCreate = () => {
    setEditingMethod(null)
    setFormName("")
    setFormDescription("")
    setFormAdjustment("0")
    setFormActive(true)
    setModalOpen(true)
  }

  const openEdit = (method: PaymentMethodConfig) => {
    setEditingMethod(method)
    setFormName(method.name)
    setFormDescription(method.description)
    setFormAdjustment(method.adjustment.toString())
    setFormActive(method.active)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingMethod) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editingMethod.id
            ? {
                ...m,
                name: formName,
                description: formDescription,
                adjustment: parseInt(formAdjustment) || 0,
                active: formActive,
              }
            : m
        )
      )
    } else {
      const newMethod: PaymentMethodConfig = {
        id: `pay-${Date.now()}`,
        name: formName,
        description: formDescription,
        adjustment: parseInt(formAdjustment) || 0,
        active: formActive,
      }
      setMethods((prev) => [...prev, newMethod])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id))
  }

  const handleToggle = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Metodos de pago</h1>
          <p className="text-sm mt-1" style={{ color: "#999999" }}>
            Configura descuentos y recargos por medio de pago
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#1a3a2a", color: "#f5f5f0" }}
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center gap-4 p-4 rounded-xl border"
            style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold"
                style={{ color: method.active ? "#1c1c1c" : "#aaaaaa" }}
              >
                {method.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#999999" }}>
                {method.description}
              </p>
              {method.adjustment !== 0 && (
                <span
                  className="inline-flex px-2 py-0.5 rounded-md text-xs font-bold mt-1"
                  style={{
                    background: method.adjustment < 0 ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                    color: method.adjustment < 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {method.adjustment > 0 ? "+" : ""}{method.adjustment}%
                </span>
              )}
            </div>
            <Switch
              checked={method.active}
              onCheckedChange={() => handleToggle(method.id)}
              className="data-[state=checked]:bg-green-500"
            />
            <button
              onClick={() => openEdit(method)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              aria-label={`Editar ${method.name}`}
            >
              <Pencil className="w-3.5 h-3.5" style={{ color: "#888888" }} />
            </button>
            <button
              onClick={() => handleDelete(method.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"
              aria-label={`Eliminar ${method.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent style={{ background: "#ffffff" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#1c1c1c" }}>
              {editingMethod ? "Editar metodo" : "Nuevo metodo de pago"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                Nombre
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                Descripcion
              </label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="Descripcion breve"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                Ajuste (%) - negativo = descuento, positivo = recargo
              </label>
              <input
                type="number"
                value={formAdjustment}
                onChange={(e) => setFormAdjustment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="Ej: -10 para 10% descuento"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
                Activo
              </label>
              <Switch
                checked={formActive}
                onCheckedChange={setFormActive}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
                style={{ borderColor: "#e8e8e5", color: "#666666" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formName}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
                style={{ background: "#1a3a2a", color: "#f5f5f0" }}
              >
                {editingMethod ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
