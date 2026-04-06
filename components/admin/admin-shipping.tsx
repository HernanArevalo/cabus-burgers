"use client"

import { useEffect, useState } from "react"
import type { ShippingMethodConfig } from "@/lib/types"
import { createShippingMethod, deleteShippingMethod, getShippingMethods, updateShippingMethod } from "@/lib/api"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdminShipping() {
  const [methods, setMethods] = useState<ShippingMethodConfig[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ShippingMethodConfig | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")
  const [active, setActive] = useState(true)

  useEffect(() => { getShippingMethods().then((d) => setMethods(d || [])) }, [])

  const openCreate = () => { setEditing(null); setName(""); setDescription(""); setCost(""); setActive(true); setModalOpen(true) }
  const openEdit = (m: ShippingMethodConfig) => { setEditing(m); setName(m.name); setDescription(m.description); setCost(m.cost.toString()); setActive(m.active); setModalOpen(true) }

  const handleSave = async () => {
    if (editing) {
      const updated = await updateShippingMethod(editing.id, { name, description, cost: parseInt(cost) || 0, active })
      if (!updated?.error) setMethods((prev) => prev.map((m) => (m.id === editing.id ? updated : m)))
    } else {
      const created = await createShippingMethod({ name, description, cost: parseInt(cost) || 0, active })
      if (!created?.error) setMethods((prev) => [...prev, created])
    }
    setModalOpen(false)
  }

  return <AdminMethodTable title="Envios" subtitle="Configura los metodos de envio" methods={methods} onCreate={openCreate} onEdit={openEdit} onDelete={async (id: string) => { const r = await deleteShippingMethod(id); if (!r?.error) setMethods((prev) => prev.filter((m) => m.id !== id)) }} onToggle={async (item: ShippingMethodConfig) => { const u = await updateShippingMethod(item.id, { active: !item.active }); if (!u?.error) setMethods((prev) => prev.map((m) => (m.id === item.id ? u : m))) }} isPercent={false} modal={{ modalOpen, setModalOpen, editing, name, setName, description, setDescription, value: cost, setValue: setCost, active, setActive, handleSave }} />
}

function AdminMethodTable({ title, subtitle, methods, onCreate, onEdit, onDelete, onToggle, isPercent, modal }: any) {
  return <div className="max-w-3xl mx-auto"><div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>{title}</h1><p className="text-sm mt-1" style={{ color: "#999999" }}>{subtitle}</p></div><button onClick={onCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#1a3a2a", color: "#f5f5f0" }}><Plus className="w-4 h-4" />Agregar</button></div><div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}><table className="w-full text-sm"><thead><tr style={{ background: "#fafaf8" }}><th className="text-left py-3 px-4 text-xs" style={{ color: "#999999" }}>Metodo</th><th className="text-right py-3 px-4 text-xs" style={{ color: "#999999" }}>{isPercent ? "Ajuste" : "Costo"}</th><th className="text-center py-3 px-4 text-xs" style={{ color: "#999999" }}>Activo</th><th className="text-center py-3 px-4 text-xs" style={{ color: "#999999" }}>Acciones</th></tr></thead><tbody>{methods.map((m: any, i: number) => <tr key={m.id} style={{ borderTop: i > 0 ? "1px solid #f0f0ed" : "none" }}><td className="py-3 px-4"><p className="font-semibold">{m.name}</p><p className="text-xs text-gray-500">{m.description}</p></td><td className="py-3 px-4 text-right font-bold">{isPercent ? `${m.adjustment}%` : m.cost === 0 ? "Gratis" : `$${m.cost.toLocaleString("es-AR")}`}</td><td className="py-3 px-4"><div className="flex justify-center"><Switch checked={m.active} onCheckedChange={() => onToggle(m)} /></div></td><td className="py-3 px-4"><div className="flex justify-center gap-1"><button onClick={() => onEdit(m)} className="w-8 h-8 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => onDelete(m.id)} className="w-8 h-8 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button></div></td></tr>)}</tbody></table></div><Dialog open={modal.modalOpen} onOpenChange={modal.setModalOpen}><DialogContent style={{ background: "#fff" }}><DialogHeader><DialogTitle>{modal.editing ? "Editar metodo" : "Nuevo metodo"}</DialogTitle></DialogHeader><div className="flex flex-col gap-3"><input value={modal.name} onChange={(e) => modal.setName(e.target.value)} placeholder="Nombre" className="border rounded-lg px-3 py-2" /><input value={modal.description} onChange={(e) => modal.setDescription(e.target.value)} placeholder="Descripcion" className="border rounded-lg px-3 py-2" /><input type="number" value={modal.value} onChange={(e) => modal.setValue(e.target.value)} placeholder={isPercent ? "10" : "800"} className="border rounded-lg px-3 py-2" /><div className="flex items-center justify-between"><span>Activo</span><Switch checked={modal.active} onCheckedChange={modal.setActive} /></div><button onClick={modal.handleSave} className="rounded-lg py-2 bg-[#1a3a2a] text-white">Guardar</button></div></DialogContent></Dialog></div>
}
