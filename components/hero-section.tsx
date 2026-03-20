"use client"

import { storeStatus } from "@/lib/mock-data"

interface HeroSectionProps {
  onOrderClick: () => void
}

export function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-16 text-center bg-background overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md mx-auto">
        {/* Logo placeholder */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-primary-foreground">
            <path d="M6 24h28v2c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4v-2z" fill="currentColor" />
            <path d="M6 20h28v2H6v-2z" fill="currentColor" opacity="0.7" />
            <path d="M8 16c0-5.5 5.4-10 12-10s12 4.5 12 10H8z" fill="currentColor" />
            <rect x="10" y="18" width="4" height="2" rx="1" fill="currentColor" opacity="0.5" />
            <rect x="18" y="18" width="4" height="2" rx="1" fill="currentColor" opacity="0.5" />
            <rect x="26" y="18" width="4" height="2" rx="1" fill="currentColor" opacity="0.5" />
          </svg>
        </div>

        {/* Store name */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono sm:text-4xl">
            CABUS
          </h1>
          <p className="text-lg font-semibold tracking-widest text-primary font-mono">
            HAMBURGUESAS
          </p>
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
          Smash burgers artesanales hechas con fuego, amor y los mejores ingredientes.
        </p>

        {/* Store status badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              storeStatus.isOpen
                ? "bg-green-400 animate-pulse"
                : "bg-red-400"
            }`}
          />
          <span className="text-sm font-medium text-secondary-foreground">
            {storeStatus.isOpen ? "Abierto ahora" : `Cerrado - Abre a las ${storeStatus.nextOpenTime}`}
          </span>
        </div>

        {/* CTA button */}
        <button
          onClick={onOrderClick}
          disabled={!storeStatus.isOpen}
          className="w-full max-w-xs px-8 py-4 text-lg font-bold rounded-xl bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          HACER MI PEDIDO
        </button>
      </div>
    </section>
  )
}
