"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import type { Product, Variant, Category, Extra } from "@/lib/types"
import { createProduct, deleteProduct, getCategories, getExtras, getProducts, updateProduct } from "@/lib/api"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

export function AdminProducts() {
  const [productsList, setProductsList] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formCategoryId, setFormCategoryId] = useState("")
  const [formBadge, setFormBadge] = useState("")
  const [formInStock, setFormInStock] = useState(true)
  const [formExtras, setFormExtras] = useState<string[]>([])
  const [formVariants, setFormVariants] = useState<Variant[]>([])
  const [variantName, setVariantName] = useState("")
  const [variantPrice, setVariantPrice] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const [productsData, categoriesData, extrasData] = await Promise.all([getProducts(), getCategories(), getExtras()])
      setProductsList(productsData || [])
      setCategories(categoriesData || [])
      setExtras(extrasData || [])
      setFormCategoryId(categoriesData?.[0]?.id ?? "")
    }
    fetchData()
  }, [])

  const filteredProducts = useMemo(() => productsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "Todos" || p.category === filterCategory
    return matchesSearch && matchesCategory
  }), [productsList, search, filterCategory])

  const openCreate = () => {
    setEditingProduct(null)
    setFormName("")
    setFormDescription("")
    setFormPrice("")
    setFormCategoryId(categories[0]?.id ?? "")
    setFormBadge("")
    setFormInStock(true)
    setFormExtras([])
    setFormVariants([])
    setVariantName("")
    setVariantPrice("")
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormDescription(product.description)
    setFormPrice(product.price.toString())
    const category = categories.find((c) => c.name === product.category)
    setFormCategoryId(category?.id ?? "")
    setFormBadge(product.badge || "")
    setFormInStock(product.inStock)
    setFormExtras(product.extras.map((e) => e.id))
    setFormVariants(product.variants)
    setModalOpen(true)
  }

  const handleSave = async () => {
    const effectivePrice = formVariants.length > 0 ? Math.min(...formVariants.map((v) => v.price)) : parseInt(formPrice) || 0
    const payload = {
      name: formName,
      description: formDescription,
      price: effectivePrice,
      image: editingProduct?.image ?? "/images/burger-clasica.jpg",
      badge: formBadge || undefined,
      inStock: formInStock,
      categoryId: formCategoryId,
      variants: formVariants.map((v) => ({ name: v.name, price: v.price })),
      extraIds: formExtras,
    }

    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, payload)
      if (!updated?.error) setProductsList((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)))
    } else {
      const created = await createProduct(payload)
      if (!created?.error) setProductsList((prev) => [...prev, created])
    }
    setModalOpen(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Productos</h1><p className="text-sm mt-1" style={{ color: "#999999" }}>{productsList.length} productos en total</p></div><button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#1a3a2a", color: "#f5f5f0" }}><Plus className="w-4 h-4" />Agregar producto</button></div>
      <div className="flex gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" /></div><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 rounded-xl border text-sm"><option>Todos</option>{categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
      <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}><table className="w-full text-sm"><thead><tr style={{ background: "#fafaf8" }}><th className="text-left py-3 px-4">Producto</th><th className="text-left py-3 px-4 hidden sm:table-cell">Categoria</th><th className="text-right py-3 px-4">Precio</th><th className="text-center py-3 px-4">Activo</th><th className="text-center py-3 px-4">Acciones</th></tr></thead><tbody>{filteredProducts.map((product, index) => <tr key={product.id} style={{ borderTop: index > 0 ? "1px solid #f0f0ed" : "none" }}><td className="py-3 px-4"><div className="flex items-center gap-3"><div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0"><Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" /></div><p className="font-semibold">{product.name}</p></div></td><td className="py-3 px-4 hidden sm:table-cell">{product.category}</td><td className="py-3 px-4 text-right font-bold">${product.price.toLocaleString("es-AR")}</td><td className="py-3 px-4"><div className="flex justify-center"><Switch checked={product.inStock} onCheckedChange={async () => { const updated = await updateProduct(product.id, { inStock: !product.inStock }); if (!updated?.error) setProductsList((prev) => prev.map((p) => (p.id === product.id ? updated : p))) }} /></div></td><td className="py-3 px-4"><div className="flex justify-center gap-1"><button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button><button onClick={async () => { const res = await deleteProduct(product.id); if (!res?.error) setProductsList((prev) => prev.filter((p) => p.id !== product.id)) }} className="w-8 h-8 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button></div></td></tr>)}</tbody></table></div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" style={{ background: "#ffffff" }}><DialogHeader><DialogTitle>{editingProduct ? "Editar producto" : "Agregar producto"}</DialogTitle></DialogHeader><div className="flex flex-col gap-3"><input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nombre" className="border rounded-lg px-3 py-2" /><textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descripcion" className="border rounded-lg px-3 py-2" /><input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="Precio" className="border rounded-lg px-3 py-2" /><select value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} className="border rounded-lg px-3 py-2">{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input value={formBadge} onChange={(e) => setFormBadge(e.target.value)} placeholder="Etiqueta" className="border rounded-lg px-3 py-2" /><div className="flex items-center justify-between"><span>Activo</span><Switch checked={formInStock} onCheckedChange={setFormInStock} /></div><div><p className="text-xs mb-2">Extras</p><div className="grid grid-cols-2 gap-2">{extras.map((extra) => <label key={extra.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formExtras.includes(extra.id)} onChange={() => setFormExtras((prev) => prev.includes(extra.id) ? prev.filter((id) => id !== extra.id) : [...prev, extra.id])} />{extra.name}</label>)}</div></div><div><p className="text-xs mb-2">Variantes</p><div className="flex gap-2"><input value={variantName} onChange={(e) => setVariantName(e.target.value)} placeholder="Nombre" className="border rounded-lg px-3 py-2 flex-1" /><input type="number" value={variantPrice} onChange={(e) => setVariantPrice(e.target.value)} placeholder="Precio" className="border rounded-lg px-3 py-2 w-28" /><button onClick={() => { if (!variantName || !variantPrice) return; setFormVariants((prev) => [...prev, { id: `v-${Date.now()}`, name: variantName, price: parseInt(variantPrice) }]); setVariantName(""); setVariantPrice("") }} className="px-3 rounded-lg bg-gray-100">+</button></div><div className="mt-2 flex flex-wrap gap-2">{formVariants.map((v) => <button key={v.id} onClick={() => setFormVariants((prev) => prev.filter((item) => item.id !== v.id))} className="text-xs px-2 py-1 rounded bg-gray-100">{v.name} ${v.price}</button>)}</div></div><button onClick={handleSave} disabled={!formName || !formCategoryId} className="rounded-lg py-2 bg-[#1a3a2a] text-white disabled:opacity-40">Guardar</button></div></DialogContent></Dialog>
    </div>
  )
}
