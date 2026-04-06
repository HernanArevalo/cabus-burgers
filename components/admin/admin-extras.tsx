"use client"

import { useEffect, useState } from "react"
import type { Extra } from "@/lib/types"
import { createExtra, deleteExtra, getExtras, updateExtra } from "@/lib/api"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdminExtras() {
  const [extrasList, setExtrasList] = useState<Extra[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null)
  const [formName, setFormName] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formInStock, setFormInStock] = useState(true)

  useEffect(() => {
    const fetchData = async () => setExtrasList((await getExtras()) || [])
    fetchData()
  }, [])

  const openCreate = () => { setEditingExtra(null); setFormName(""); setFormPrice(""); setFormInStock(true); setModalOpen(true) }
  const openEdit = (extra: Extra) => { setEditingExtra(extra); setFormName(extra.name); setFormPrice(extra.price.toString()); setFormInStock(extra.inStock); setModalOpen(true) }

  const handleSave = async () => {
    if (editingExtra) {
      const updated = await updateExtra(editingExtra.id, { name: formName, price: parseInt(formPrice) || 0, inStock: formInStock })
      if (!updated?.error) setExtrasList((prev) => prev.map((e) => (e.id === editingExtra.id ? updated : e)))
    } else {
      const created = await createExtra({ name: formName, price: parseInt(formPrice) || 0, inStock: formInStock })
      if (!created?.error) setExtrasList((prev) => [...prev, created])
    }
    setModalOpen(false)
  }

  const handleDelete = async (extraId: string) => {
    const response = await deleteExtra(extraId)
    if (!response?.error) setExtrasList((prev) => prev.filter((e) => e.id !== extraId))
  }

  const handleToggleStock = async (extra: Extra) => {
    const updated = await updateExtra(extra.id, { inStock: !extra.inStock })
    if (!updated?.error) setExtrasList((prev) => prev.map((e) => (e.id === extra.id ? updated : e)))
  }

  return <div className="max-w-2xl mx-auto">{/* kept existing UI structure */}
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Extras</h1><p className="text-sm mt-1" style={{ color: "#999999" }}>Agregados disponibles para tus productos</p></div><button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110" style={{ background: "#1a3a2a", color: "#f5f5f0" }}><Plus className="w-4 h-4" />Agregar</button></div>
    <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}><table className="w-full text-sm"><thead><tr style={{ background: "#fafaf8" }}><th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Nombre</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Precio</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Stock</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#999999" }}>Acciones</th></tr></thead><tbody>{extrasList.map((extra, index) => <tr key={extra.id} style={{ borderTop: index > 0 ? "1px solid #f0f0ed" : "none" }}><td className="py-3 px-4"><span className="font-semibold" style={{ color: extra.inStock ? "#1c1c1c" : "#aaaaaa" }}>{extra.name}</span></td><td className="py-3 px-4 text-right font-bold" style={{ color: "#1c1c1c" }}>{extra.price > 0 ? `$${extra.price.toLocaleString("es-AR")}` : "Gratis"}</td><td className="py-3 px-4"><div className="flex items-center justify-center"><Switch checked={extra.inStock} onCheckedChange={() => handleToggleStock(extra)} className="data-[state=checked]:bg-green-500" /></div></td><td className="py-3 px-4"><div className="flex items-center justify-center gap-1"><button onClick={() => openEdit(extra)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"><Pencil className="w-3.5 h-3.5" style={{ color: "#888888" }} /></button><button onClick={() => handleDelete(extra.id)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" style={{ color: "#ef4444" }} /></button></div></td></tr>)}</tbody></table></div>
    <Dialog open={modalOpen} onOpenChange={setModalOpen}><DialogContent style={{ background: "#ffffff" }}><DialogHeader><DialogTitle style={{ color: "#1c1c1c" }}>{editingExtra ? "Editar extra" : "Nuevo extra"}</DialogTitle></DialogHeader><div className="flex flex-col gap-4 mt-2"><div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Nombre</label><input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#e8e8e5", color: "#1c1c1c" }} /></div><div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>Precio</label><input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#e8e8e5", color: "#1c1c1c" }} /></div><div className="flex items-center justify-between"><label className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>Disponible</label><Switch checked={formInStock} onCheckedChange={setFormInStock} className="data-[state=checked]:bg-green-500" /></div><div className="flex gap-3 pt-2"><button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: "#e8e8e5", color: "#666666" }}>Cancelar</button><button onClick={handleSave} disabled={!formName} className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40" style={{ background: "#1a3a2a", color: "#f5f5f0" }}>{editingExtra ? "Guardar" : "Crear"}</button></div></div></DialogContent></Dialog>
  </div>
}
