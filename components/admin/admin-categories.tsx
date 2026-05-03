"use client"

import { useState } from "react"
import type { Category } from "@/lib/types"
import { mockCategories } from "@/lib/admin-mock-data"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"

export function AdminCategories() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(mockCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formName, setFormName] = useState("")
  const [formActive, setFormActive] = useState(true)

  const openCreate = () => {
    setEditingCategory(null)
    setFormName("")
    setFormActive(true)
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setFormName(cat.name)
    setFormActive(cat.active)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingCategory) {
      setCategoriesList((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: formName, active: formActive }
            : c
        )
      )
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formName,
        order: categoriesList.length + 1,
        active: formActive,
      }
      setCategoriesList((prev) => [...prev, newCat])
    }
    setModalOpen(false)
  }

  const handleDelete = (catId: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== catId))
  }

  const handleToggle = (catId: string) => {
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, active: !c.active } : c))
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Categorias</h1>
          <p className="text-sm mt-1" style={{ color: "#999999" }}>
            Organiza tus productos por categoria
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

      <div className="flex flex-col gap-2">
        {categoriesList
          .sort((a, b) => a.order - b.order)
          .map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-4 rounded-xl border transition-colors"
              style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
            >
              <GripVertical
                className="w-4 h-4 shrink-0 cursor-grab"
                style={{ color: "#cccccc" }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: cat.active ? "#1c1c1c" : "#aaaaaa" }}
                >
                  {cat.name}
                </p>
                <p className="text-xs" style={{ color: "#999999" }}>
                  Orden: {cat.order}
                </p>
              </div>
              <Switch
                checked={cat.active}
                onCheckedChange={() => handleToggle(cat.id)}
                className="data-[state=checked]:bg-green-500"
              />
              <button
                onClick={() => openEdit(cat)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                aria-label={`Editar ${cat.name}`}
              >
                <Pencil className="w-3.5 h-3.5" style={{ color: "#888888" }} />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"
                aria-label={`Eliminar ${cat.name}`}
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
              {editingCategory ? "Editar categoria" : "Nueva categoria"}
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
                placeholder="Nombre de la categoria"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
                Activa
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
                {editingCategory ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
