"use client"

import { useEffect, useState } from "react"
import { Save, Store, MessageSquare, Clock, Phone, Image as ImageIcon } from "lucide-react"
import type { StoreConfig } from "@/lib/types"
import { getStoreConfig, updateStoreConfig } from "@/lib/api"

const defaultConfig: StoreConfig = {
  name: "",
  logo: "",
  coverImage: "",
  description: "",
  tagline: "",
  whatsapp: "",
  isOpen: true,
  estimatedCloseTime: "23:00",
  messageTemplates: {
    orderConfirmation: "",
    orderReady: "",
    orderDelivery: "",
  },
}

export function AdminStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getStoreConfig()
      if (data) setConfig(data)
    }
    fetchConfig()
  }, [])

  function handleChange(field: keyof StoreConfig, value: string | boolean) {
    setConfig((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleTemplateChange(
    key: keyof StoreConfig["messageTemplates"],
    value: string
  ) {
    setConfig((prev) => ({
      ...prev,
      messageTemplates: { ...prev.messageTemplates, [key]: value },
    }))
    setSaved(false)
  }

  async function handleSave() {
    await updateStoreConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Configuracion de la tienda</h1>
          <p className="text-sm mt-0.5" style={{ color: "#999999" }}>Datos generales, horarios y plantillas de mensajes.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all" style={{ background: "#1a3a2a", color: "#d4a017" }}>
          <Save className="w-4 h-4" />
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2"><Store className="w-4 h-4" style={{ color: "#1a3a2a" }} /><h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>Informacion general</h2></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre de la tienda" value={config.name} onChange={(v) => handleChange("name", v)} />
          <Input label="Slogan" value={config.tagline} onChange={(v) => handleChange("tagline", v)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "#777777" }}>Descripcion</label>
          <textarea value={config.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 resize-none" style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#fafaf8" }} />
        </div>
      </div>

      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: "#1a3a2a" }} /><h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>Contacto y horarios</h2></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="WhatsApp (con codigo de pais)" value={config.whatsapp} onChange={(v) => handleChange("whatsapp", v)} />
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>Horario de cierre estimado</label>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" style={{ color: "#aaaaaa" }} /><input type="time" value={config.estimatedCloseTime} onChange={(e) => handleChange("estimatedCloseTime", e.target.value)} className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2" style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#fafaf8" }} /></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#fafaf8" }}>
          <div><p className="text-sm font-medium" style={{ color: "#1c1c1c" }}>Tienda abierta</p></div>
          <button onClick={() => handleChange("isOpen", !config.isOpen)} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: config.isOpen ? "#1a3a2a" : "#d4d4d4" }} role="switch" aria-checked={config.isOpen}><span className="absolute top-0.5 w-5 h-5 rounded-full transition-transform" style={{ background: "#ffffff", left: config.isOpen ? "calc(100% - 22px)" : "2px" }} /></button>
        </div>
      </div>

      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4" style={{ color: "#1a3a2a" }} /><h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>Imagenes</h2></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Logo (URL)" value={config.logo} onChange={(v) => handleChange("logo", v)} />
          <Input label="Imagen de portada (URL)" value={config.coverImage} onChange={(v) => handleChange("coverImage", v)} />
        </div>
      </div>

      <div className="rounded-xl border p-5 space-y-4" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" style={{ color: "#1a3a2a" }} /><h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>Plantillas de mensajes</h2></div>
        <MessageInput label="Confirmacion" value={config.messageTemplates.orderConfirmation} onChange={(v) => handleTemplateChange("orderConfirmation", v)} />
        <MessageInput label="Pedido listo" value={config.messageTemplates.orderReady} onChange={(v) => handleTemplateChange("orderReady", v)} />
        <MessageInput label="En camino" value={config.messageTemplates.orderDelivery} onChange={(v) => handleTemplateChange("orderDelivery", v)} />
      </div>
    </div>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-1.5"><label className="text-xs font-medium" style={{ color: "#777777" }}>{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2" style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#fafaf8" }} /></div>
}

function MessageInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-1.5"><label className="text-xs font-medium" style={{ color: "#777777" }}>{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 resize-none" style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#fafaf8" }} /></div>
}
