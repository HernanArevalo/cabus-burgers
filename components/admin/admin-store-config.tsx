"use client"

import { useState } from "react"
import { Save, Store, MessageSquare, Clock, Phone, Image as ImageIcon } from "lucide-react"
import { mockStoreConfig } from "@/lib/admin-mock-data"
import type { StoreConfig } from "@/lib/types"

export function AdminStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(mockStoreConfig)
  const [saved, setSaved] = useState(false)

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

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>
            Configuracion de la tienda
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#999999" }}>
            Datos generales, horarios y plantillas de mensajes.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "#1a3a2a", color: "#d4a017" }}
        >
          <Save className="w-4 h-4" />
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      {/* General info card */}
      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4" style={{ color: "#1a3a2a" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
            Informacion general
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>
              Nombre de la tienda
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
              style={{
                borderColor: "#e8e8e5",
                color: "#1c1c1c",
                background: "#fafaf8",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>
              Slogan
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
              style={{
                borderColor: "#e8e8e5",
                color: "#1c1c1c",
                background: "#fafaf8",
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "#777777" }}>
            Descripcion
          </label>
          <textarea
            value={config.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 resize-none"
            style={{
              borderColor: "#e8e8e5",
              color: "#1c1c1c",
              background: "#fafaf8",
            }}
          />
        </div>
      </div>

      {/* Contact & hours */}
      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" style={{ color: "#1a3a2a" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
            Contacto y horarios
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>
              WhatsApp (con codigo de pais)
            </label>
            <input
              type="text"
              value={config.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="5493511234567"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
              style={{
                borderColor: "#e8e8e5",
                color: "#1c1c1c",
                background: "#fafaf8",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>
              Horario de cierre estimado
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" style={{ color: "#aaaaaa" }} />
              <input
                type="time"
                value={config.estimatedCloseTime}
                onChange={(e) => handleChange("estimatedCloseTime", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
                style={{
                  borderColor: "#e8e8e5",
                  color: "#1c1c1c",
                  background: "#fafaf8",
                }}
              />
            </div>
          </div>
        </div>

        {/* Store open toggle */}
        <div
          className="flex items-center justify-between p-3 rounded-lg"
          style={{ background: "#fafaf8" }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "#1c1c1c" }}>
              Tienda abierta
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#999999" }}>
              {config.isOpen
                ? "Los clientes pueden hacer pedidos"
                : "Los clientes NO pueden hacer pedidos"}
            </p>
          </div>
          <button
            onClick={() => handleChange("isOpen", !config.isOpen)}
            className="relative w-11 h-6 rounded-full transition-colors"
            style={{ background: config.isOpen ? "#1a3a2a" : "#d4d4d4" }}
            role="switch"
            aria-checked={config.isOpen}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
              style={{
                background: "#ffffff",
                left: config.isOpen ? "calc(100% - 22px)" : "2px",
              }}
            />
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" style={{ color: "#1a3a2a" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
            Imagenes
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>
              Logo (URL)
            </label>
            <input
              type="text"
              value={config.logo}
              onChange={(e) => handleChange("logo", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
              style={{
                borderColor: "#e8e8e5",
                color: "#1c1c1c",
                background: "#fafaf8",
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#777777" }}>
              Imagen de portada (URL)
            </label>
            <input
              type="text"
              value={config.coverImage}
              onChange={(e) => handleChange("coverImage", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
              style={{
                borderColor: "#e8e8e5",
                color: "#1c1c1c",
                background: "#fafaf8",
              }}
            />
          </div>
        </div>
      </div>

      {/* Message templates */}
      <div className="rounded-xl border p-5 space-y-5" style={{ background: "#ffffff", borderColor: "#e8e8e5" }}>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" style={{ color: "#1a3a2a" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
            Plantillas de mensajes
          </h2>
        </div>

        <p className="text-xs" style={{ color: "#999999" }}>
          {'Variables disponibles: {{nombre}}, {{pedido_id}}, {{metodo_envio}}'}
        </p>

        <div className="space-y-4">
          {(
            [
              ["orderConfirmation", "Confirmacion de pedido"],
              ["orderReady", "Pedido listo"],
              ["orderDelivery", "Pedido en camino"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "#777777" }}>
                {label}
              </label>
              <textarea
                value={config.messageTemplates[key]}
                onChange={(e) => handleTemplateChange(key, e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 resize-none"
                style={{
                  borderColor: "#e8e8e5",
                  color: "#1c1c1c",
                  background: "#fafaf8",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
