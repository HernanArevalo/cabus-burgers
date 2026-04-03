"use client"

import { useState, type FormEvent } from "react"
import { useCart } from "@/lib/cart-context"
import type { CheckoutFormData, ShippingMethod, PaymentMethod } from "@/lib/types"
import { paymentMethods, neighborhoods } from "@/lib/mock-data"
import { CartPriceSummary } from "@/components/cart-price-summary"
import {
  Truck,
  Store,
  Banknote,
  ArrowRightLeft,
  CreditCard,
  MapPin,
  Check,
} from "lucide-react"

interface CheckoutFormProps {
  onOrderConfirmed: () => void
}

export function CheckoutForm({ onOrderConfirmed }: CheckoutFormProps) {
  const {
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    confirmOrder,
    submittingOrder,
    items,
  } = useCart()

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    email: "",
    shippingMethod: shippingMethod,
    street: "",
    number: "",
    neighborhood: "",
    paymentMethod: paymentMethod,
    cashAmount: "",
    observations: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [submitError, setSubmitError] = useState("")

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleShippingChange = (method: ShippingMethod) => {
    setShippingMethod(method)
    setFormData((prev) => ({ ...prev, shippingMethod: method }))
  }

  const handlePaymentChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setFormData((prev) => ({ ...prev, paymentMethod: method }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {}

    if (!formData.name.trim()) newErrors.name = "Ingresa tu nombre"
    if (!formData.phone.trim()) newErrors.phone = "Ingresa tu telefono"
    if (!formData.email.trim()) {
      newErrors.email = "Ingresa tu email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalido"
    }

    if (formData.shippingMethod === "delivery") {
      if (!formData.street.trim()) newErrors.street = "Ingresa la calle"
      if (!formData.number.trim()) newErrors.number = "Ingresa la altura"
      if (!formData.neighborhood.trim()) newErrors.neighborhood = "Selecciona un barrio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    if (!validate()) return

    try {
      await confirmOrder(formData)
      onOrderConfirmed()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo registrar el pedido")
    }
  }

  const shippingIcon = {
    retiro: <Store className="w-5 h-5" />,
    delivery: <Truck className="w-5 h-5" />,
  }

  const paymentIcon = {
    efectivo: <Banknote className="w-5 h-5" />,
    transferencia: <ArrowRightLeft className="w-5 h-5" />,
    mercadopago: <CreditCard className="w-5 h-5" />,
  }

  if (items.length === 0) return null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-6">
          {/* Personal info */}
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-card-foreground/40 mb-3">
              Datos personales
            </legend>
            <div className="flex flex-col gap-3">
              <FormInput
                label="Nombre"
                value={formData.name}
                onChange={(v) => updateField("name", v)}
                error={errors.name}
                placeholder="Tu nombre completo"
              />
              <FormInput
                label="Telefono"
                value={formData.phone}
                onChange={(v) => updateField("phone", v)}
                error={errors.phone}
                placeholder="Ej: 351 1234567"
                type="tel"
              />
              <FormInput
                label="Email"
                value={formData.email}
                onChange={(v) => updateField("email", v)}
                error={errors.email}
                placeholder="tu@email.com"
                type="email"
              />
            </div>
          </fieldset>

          {/* Shipping method */}
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-card-foreground/40 mb-3">
              Metodo de envio
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(["retiro", "delivery"] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => handleShippingChange(method)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.shippingMethod === method
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/30 text-card-foreground/50 hover:border-card-foreground/20"
                  }`}
                >
                  {shippingIcon[method]}
                  <span className="text-sm font-semibold">
                    {method === "retiro" ? "Retiro en local" : "Delivery"}
                  </span>
                  <span className="text-xs text-card-foreground/40">
                    {method === "retiro" ? "Gratis" : "$800"}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Delivery address */}
          {formData.shippingMethod === "delivery" && (
            <fieldset className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <legend className="text-xs font-bold uppercase tracking-wider text-card-foreground/40 mb-3">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Direccion de entrega
                </span>
              </legend>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <FormInput
                      label="Calle"
                      value={formData.street}
                      onChange={(v) => updateField("street", v)}
                      error={errors.street}
                      placeholder="Nombre de la calle"
                    />
                  </div>
                  <FormInput
                    label="Altura"
                    value={formData.number}
                    onChange={(v) => updateField("number", v)}
                    error={errors.number}
                    placeholder="1234"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-card-foreground/60 mb-1.5">
                    Barrio
                  </label>
                  <select
                    value={formData.neighborhood}
                    onChange={(e) => updateField("neighborhood", e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm text-card-foreground bg-card transition-colors appearance-none ${
                      errors.neighborhood
                        ? "border-destructive"
                        : "border-border/30 focus:border-primary"
                    } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  >
                    <option value="">Seleccionar barrio...</option>
                    {neighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  {errors.neighborhood && (
                    <p className="text-xs text-destructive mt-1">{errors.neighborhood}</p>
                  )}
                </div>
              </div>
            </fieldset>
          )}

          {/* Payment method */}
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-card-foreground/40 mb-3">
              Metodo de pago
            </legend>
            <div className="flex flex-col gap-2">
              {paymentMethods.map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => handlePaymentChange(pm.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                    formData.paymentMethod === pm.id
                      ? "border-primary bg-primary/5"
                      : "border-border/30 hover:border-card-foreground/20"
                  }`}
                >
                  <span
                    className={`shrink-0 ${
                      formData.paymentMethod === pm.id
                        ? "text-primary"
                        : "text-card-foreground/40"
                    }`}
                  >
                    {paymentIcon[pm.id]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        formData.paymentMethod === pm.id
                          ? "text-primary"
                          : "text-card-foreground/70"
                      }`}
                    >
                      {pm.label}
                    </p>
                    <p className="text-xs text-card-foreground/40">
                      {pm.description}
                    </p>
                  </div>
                  {formData.paymentMethod === pm.id && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Cash amount */}
          {formData.paymentMethod === "efectivo" && (
            <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <FormInput
                label="Con cuanto pagas?"
                value={formData.cashAmount}
                onChange={(v) => updateField("cashAmount", v)}
                placeholder="Ej: 10000"
                type="number"
              />
            </div>
          )}

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-card-foreground/60 mb-1.5">
              Observaciones generales
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => updateField("observations", e.target.value)}
              placeholder="Algun comentario sobre tu pedido..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-border/30 text-sm text-card-foreground bg-card resize-none transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-card-foreground/30"
            />
          </div>

          {/* Price summary */}
          <div className="p-4 rounded-xl bg-card-foreground/[0.02] border border-border/20">
            <CartPriceSummary />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 py-4 border-t border-border/20 bg-card">
        {submitError && (
          <p className="text-sm text-destructive mb-2">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={submittingOrder}
          className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submittingOrder ? "Confirmando..." : "Confirmar Pedido"}
        </button>
      </div>
    </form>
  )
}

function FormInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-card-foreground/60 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm text-card-foreground bg-card transition-colors ${
          error
            ? "border-destructive"
            : "border-border/30 focus:border-primary"
        } focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-card-foreground/30`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
