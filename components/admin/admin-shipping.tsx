"use client"

import { useState } from "react"
import type { ShippingMethodConfig } from "@/lib/types"
import { mockShippingMethods } from "@/lib/admin-mock-data"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdminShipping() {
  const [methods, setMethods] = useState<ShippingMethodConfig[]>(mockShippingMethods)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<ShippingMethodConfig | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formCost, setFormCost] = useState("")
  const [formActive, setFormActive] = useState(true)

  const openCreate = () => {
    setEditingMethod(null)
    setFormName("")
    setFormDescription("")
    setFormCost("")
    setFormActive(true)
    setModalOpen(true)
  }

  const openEdit = (method: ShippingMethodConfig) => {
    setEditingMethod(method)
    setFormName(method.name)
    setFormDescription(method.description)
    setFormCost(method.cost.toString())
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
                cost: parseInt(formCost) || 0,
                active: formActive,
              }
            : m
        )
      )
    } else {
      const newMethod: ShippingMethodConfig = {
        id: `ship-${Date.now()}`,
        name: formName,
        description: formDescription,
        cost: parseInt(formCost) || 0,
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
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Metodos de envio</h1>
          <p className="text-sm mt-1" style={{ color: "#999999" }}>
            Configura como se entregan los pedidos
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
              <p className="text-xs font-bold mt-1" style={{ color: "#1c1c1c" }}>
                {method.cost > 0 ? `$${method.cost.toLocaleString("es-AR")}` : "Gratis"}
              </p>
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
              {editingMethod ? "Editar metodo" : "Nuevo metodo de envio"}
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
                Costo ($)
              </label>
              <input
                type="number"
                value={formCost}
                onChange={(e) => setFormCost(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="0 para gratis"
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
