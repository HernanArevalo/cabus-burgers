"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product, Variant } from "@/lib/types"
import { products as initialProducts, categories } from "@/lib/mock-data"
import { mockExtras } from "@/lib/admin-mock-data"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2, GripVertical } from "lucide-react"

export function AdminProducts() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formCategory, setFormCategory] = useState(categories[0])
  const [formBadge, setFormBadge] = useState("")
  const [formInStock, setFormInStock] = useState(true)
  const [formExtras, setFormExtras] = useState<string[]>([])
  const [formVariants, setFormVariants] = useState<Variant[]>([])

  // Variant form state
  const [newVariantName, setNewVariantName] = useState("")
  const [newVariantPrice, setNewVariantPrice] = useState("")
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null)

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      filterCategory === "Todos" || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const openCreate = () => {
    setEditingProduct(null)
    setFormName("")
    setFormDescription("")
    setFormPrice("")
    setFormCategory(categories[0])
    setFormBadge("")
    setFormInStock(true)
    setFormExtras([])
    setFormVariants([])
    resetVariantForm()
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormDescription(product.description)
    setFormPrice(product.price.toString())
    setFormCategory(product.category)
    setFormBadge(product.badge || "")
    setFormInStock(product.inStock)
    setFormExtras(product.extras.map((e) => e.id))
    setFormVariants([...product.variants])
    resetVariantForm()
    setModalOpen(true)
  }

  const resetVariantForm = () => {
    setNewVariantName("")
    setNewVariantPrice("")
    setEditingVariantId(null)
  }

  const handleAddVariant = () => {
    if (!newVariantName.trim() || !newVariantPrice) return
    if (editingVariantId) {
      setFormVariants((prev) =>
        prev.map((v) =>
          v.id === editingVariantId
            ? { ...v, name: newVariantName.trim(), price: parseInt(newVariantPrice) }
            : v
        )
      )
    } else {
      const newVariant: Variant = {
        id: `v-${Date.now()}`,
        name: newVariantName.trim(),
        price: parseInt(newVariantPrice) || 0,
      }
      setFormVariants((prev) => [...prev, newVariant])
    }
    resetVariantForm()
  }

  const handleEditVariant = (variant: Variant) => {
    setEditingVariantId(variant.id)
    setNewVariantName(variant.name)
    setNewVariantPrice(variant.price.toString())
  }

  const handleDeleteVariant = (variantId: string) => {
    setFormVariants((prev) => prev.filter((v) => v.id !== variantId))
    if (editingVariantId === variantId) resetVariantForm()
  }

  const handleSave = () => {
    const selectedExtras = mockExtras.filter((e) => formExtras.includes(e.id))
    // Effective price: min variant price if variants exist, else manual price
    const effectivePrice =
      formVariants.length > 0
        ? Math.min(...formVariants.map((v) => v.price))
        : parseInt(formPrice) || 0

    if (editingProduct) {
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formName,
                description: formDescription,
                price: effectivePrice,
                category: formCategory,
                badge: formBadge || undefined,
                inStock: formInStock,
                extras: selectedExtras,
                variants: formVariants,
              }
            : p
        )
      )
    } else {
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formName,
        description: formDescription,
        price: effectivePrice,
        image: "/images/burger-clasica.jpg",
        category: formCategory,
        badge: formBadge || undefined,
        inStock: formInStock,
        extras: selectedExtras,
        variants: formVariants,
      }
      setProductsList((prev) => [...prev, newProduct])
    }
    setModalOpen(false)
  }

  const handleDelete = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleToggleStock = (productId: string) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    )
  }

  const toggleExtra = (extraId: string) => {
    setFormExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Productos</h1>
          <p className="text-sm mt-1" style={{ color: "#999999" }}>
            {productsList.length} productos en total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#1a3a2a", color: "#f5f5f0" }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Agregar producto</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#aaaaaa" }} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ background: "#ffffff", borderColor: "#e8e8e5", color: "#1c1c1c" } as React.CSSProperties}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["Todos", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={
                filterCategory === cat
                  ? { background: "#1a3a2a", color: "#f5f5f0" }
                  : { background: "#ffffff", color: "#888888", border: "1px solid #e8e8e5" }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#fafaf8" }}>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Producto</th>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ color: "#999999" }}>Categoria</th>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "#999999" }}>Variantes</th>
                <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Precio</th>
                <th className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Activo</th>
                <th className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} style={{ borderTop: index > 0 ? "1px solid #f0f0ed" : "none" }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate" style={{ color: product.inStock ? "#1c1c1c" : "#aaaaaa" }}>
                          {product.name}
                        </p>
                        <p className="text-xs truncate sm:hidden" style={{ color: "#aaaaaa" }}>{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ background: "#f0f0ed", color: "#666666" }}>
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {product.variants.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.variants.map((v) => (
                          <span
                            key={v.id}
                            className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium"
                            style={{ background: "#e8f0eb", color: "#1a3a2a" }}
                          >
                            {v.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: "#cccccc" }}>Sin variantes</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold" style={{ color: "#1c1c1c" }}>
                    {product.variants.length > 0 ? (
                      <span>
                        <span className="text-xs font-normal mr-0.5" style={{ color: "#aaaaaa" }}>Desde</span>
                        ${Math.min(...product.variants.map((v) => v.price)).toLocaleString("es-AR")}
                      </span>
                    ) : (
                      `$${product.price.toLocaleString("es-AR")}`
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <Switch checked={product.inStock} onCheckedChange={() => handleToggleStock(product.id)} className="data-[state=checked]:bg-green-500" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100" aria-label={`Editar ${product.name}`}>
                        <Pencil className="w-3.5 h-3.5" style={{ color: "#888888" }} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50" aria-label={`Eliminar ${product.name}`}>
                        <Trash2 className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#aaaaaa" }}>
            <p className="text-sm">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" style={{ background: "#ffffff" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#1c1c1c" }}>
              {editingProduct ? "Editar producto" : "Agregar producto"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-2">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Nombre</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c" } as React.CSSProperties}
                placeholder="Nombre del producto"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Descripcion</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c" } as React.CSSProperties}
                placeholder="Descripcion breve"
              />
            </div>

            {/* Price & Category row — price hidden if variants exist */}
            <div className="grid grid-cols-2 gap-3">
              {formVariants.length === 0 && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Precio base ($)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#e8e8e5", color: "#1c1c1c" } as React.CSSProperties}
                    placeholder="4500"
                  />
                </div>
              )}
              <div className={formVariants.length > 0 ? "col-span-2" : ""}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Categoria</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 appearance-none"
                  style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#ffffff" } as React.CSSProperties}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Etiqueta (opcional)</label>
              <input
                type="text"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c" } as React.CSSProperties}
                placeholder="Ej: Mas vendido, Nuevo, Ahorra $500"
              />
            </div>

            {/* In stock toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>Producto activo</label>
              <Switch checked={formInStock} onCheckedChange={setFormInStock} className="data-[state=checked]:bg-green-500" />
            </div>

            {/* ── VARIANTS ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: "#666666" }}>
                  VARIANTES
                  <span className="ml-1.5 font-normal" style={{ color: "#bbbbbb" }}>(Ej: Simple, Doble, Chica, Grande)</span>
                </label>
                {formVariants.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: "#e8f0eb", color: "#1a3a2a" }}>
                    Precio: Desde ${Math.min(...formVariants.map((v) => v.price)).toLocaleString("es-AR")}
                  </span>
                )}
              </div>

              {/* Existing variants list */}
              {formVariants.length > 0 && (
                <div className="flex flex-col gap-1.5 mb-3">
                  {formVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{
                        borderColor: editingVariantId === variant.id ? "#1a3a2a" : "#e8e8e5",
                        background: editingVariantId === variant.id ? "#f0f5f1" : "#fafaf8",
                      }}
                    >
                      <GripVertical className="w-3.5 h-3.5 shrink-0" style={{ color: "#cccccc" }} />
                      <span className="flex-1 text-sm font-medium" style={{ color: "#1c1c1c" }}>
                        {variant.name}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "#1a3a2a" }}>
                        ${variant.price.toLocaleString("es-AR")}
                      </span>
                      <button
                        onClick={() => handleEditVariant(variant)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                        aria-label={`Editar variante ${variant.name}`}
                      >
                        <Pencil className="w-3 h-3" style={{ color: "#888888" }} />
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
                        aria-label={`Eliminar variante ${variant.name}`}
                      >
                        <Trash2 className="w-3 h-3" style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add / edit variant inline form */}
              <div className="flex gap-2 items-end p-3 rounded-xl border" style={{ borderColor: "#e8e8e5", background: "#fafaf8" }}>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1" style={{ color: "#999999" }}>Nombre</label>
                  <input
                    type="text"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    placeholder="Ej: Simple, Doble..."
                    className="w-full px-2.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#ffffff" } as React.CSSProperties}
                    onKeyDown={(e) => e.key === "Enter" && handleAddVariant()}
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-medium mb-1" style={{ color: "#999999" }}>Precio ($)</label>
                  <input
                    type="number"
                    value={newVariantPrice}
                    onChange={(e) => setNewVariantPrice(e.target.value)}
                    placeholder="4500"
                    className="w-full px-2.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#ffffff" } as React.CSSProperties}
                    onKeyDown={(e) => e.key === "Enter" && handleAddVariant()}
                  />
                </div>
                <button
                  onClick={handleAddVariant}
                  disabled={!newVariantName.trim() || !newVariantPrice}
                  className="shrink-0 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
                  style={{ background: "#1a3a2a", color: "#f5f5f0" }}
                >
                  {editingVariantId ? "Guardar" : <Plus className="w-4 h-4" />}
                </button>
                {editingVariantId && (
                  <button
                    onClick={resetVariantForm}
                    className="shrink-0 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "#e8e8e5", color: "#888888" }}
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {formVariants.length > 0 && (
                <p className="text-xs mt-1.5" style={{ color: "#aaaaaa" }}>
                  El precio del producto se calculara automaticamente desde la variante mas economica.
                </p>
              )}
            </div>

            {/* Extras selection */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#666666" }}>EXTRAS DISPONIBLES</label>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto no-scrollbar">
                {mockExtras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                    style={{ background: formExtras.includes(extra.id) ? "#f0f0ed" : "transparent" }}
                  >
                    <input
                      type="checkbox"
                      checked={formExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="w-4 h-4 rounded accent-green-700"
                    />
                    <span className="text-sm flex-1" style={{ color: "#1c1c1c" }}>{extra.name}</span>
                    <span className="text-xs font-medium" style={{ color: "#999999" }}>
                      {extra.price > 0 ? `+$${extra.price.toLocaleString("es-AR")}` : "Gratis"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
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
                disabled={!formName || (formVariants.length === 0 && !formPrice)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
                style={{ background: "#1a3a2a", color: "#f5f5f0" }}
              >
                {editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
