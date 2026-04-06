"use client"

import { useEffect, useState } from "react"
import type { PaymentMethodConfig } from "@/lib/types"
import { createPaymentMethod, deletePaymentMethod, getPaymentMethods, updatePaymentMethod } from "@/lib/api"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdminPayments() {
  const [methods, setMethods] = useState<PaymentMethodConfig[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentMethodConfig | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [adjustment, setAdjustment] = useState("0")
  const [active, setActive] = useState(true)

  useEffect(() => { getPaymentMethods().then((d) => setMethods(d || [])) }, [])

  const openCreate = () => { setEditing(null); setName(""); setDescription(""); setAdjustment("0"); setActive(true); setModalOpen(true) }
  const openEdit = (m: PaymentMethodConfig) => { setEditing(m); setName(m.name); setDescription(m.description); setAdjustment(m.adjustment.toString()); setActive(m.active); setModalOpen(true) }

  const handleSave = async () => {
    if (editing) {
      const updated = await updatePaymentMethod(editing.id, { name, description, adjustment: parseInt(adjustment) || 0, active })
      if (!updated?.error) setMethods((prev) => prev.map((m) => (m.id === editing.id ? updated : m)))
    } else {
      const created = await createPaymentMethod({ name, description, adjustment: parseInt(adjustment) || 0, active })
      if (!created?.error) setMethods((prev) => [...prev, created])
    }
    setModalOpen(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Pagos</h1><p className="text-sm mt-1" style={{ color: "#999999" }}>Configura metodos de pago y ajustes</p></div><button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#1a3a2a", color: "#f5f5f0" }}><Plus className="w-4 h-4" />Agregar</button></div>
      <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}><table className="w-full text-sm"><thead><tr style={{ background: "#fafaf8" }}><th className="text-left py-3 px-4 text-xs" style={{ color: "#999999" }}>Metodo</th><th className="text-right py-3 px-4 text-xs" style={{ color: "#999999" }}>Ajuste</th><th className="text-center py-3 px-4 text-xs" style={{ color: "#999999" }}>Activo</th><th className="text-center py-3 px-4 text-xs" style={{ color: "#999999" }}>Acciones</th></tr></thead><tbody>{methods.map((m, i) => <tr key={m.id} style={{ borderTop: i > 0 ? "1px solid #f0f0ed" : "none" }}><td className="py-3 px-4"><p className="font-semibold">{m.name}</p><p className="text-xs text-gray-500">{m.description}</p></td><td className="py-3 px-4 text-right font-bold">{m.adjustment}%</td><td className="py-3 px-4"><div className="flex justify-center"><Switch checked={m.active} onCheckedChange={async () => { const updated = await updatePaymentMethod(m.id, { active: !m.active }); if (!updated?.error) setMethods((prev) => prev.map((item) => (item.id === m.id ? updated : item))) }} /></div></td><td className="py-3 px-4"><div className="flex justify-center gap-1"><button onClick={() => openEdit(m)} className="w-8 h-8 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button><button onClick={async () => { const r = await deletePaymentMethod(m.id); if (!r?.error) setMethods((prev) => prev.filter((item) => item.id !== m.id)) }} className="w-8 h-8 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button></div></td></tr>)}</tbody></table></div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}><DialogContent style={{ background: "#fff" }}><DialogHeader><DialogTitle>{editing ? "Editar metodo" : "Nuevo metodo"}</DialogTitle></DialogHeader><div className="flex flex-col gap-3"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="border rounded-lg px-3 py-2" /><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripcion" className="border rounded-lg px-3 py-2" /><input type="number" value={adjustment} onChange={(e) => setAdjustment(e.target.value)} placeholder="10" className="border rounded-lg px-3 py-2" /><div className="flex items-center justify-between"><span>Activo</span><Switch checked={active} onCheckedChange={setActive} /></div><button onClick={handleSave} className="rounded-lg py-2 bg-[#1a3a2a] text-white">Guardar</button></div></DialogContent></Dialog>
    </div>
  )
}
