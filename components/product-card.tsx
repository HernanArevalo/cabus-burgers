"use client"

import Image from "next/image"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isDisabled = !product.inStock

  return (
    <button
      onClick={() => !isDisabled && onClick(product)}
      disabled={isDisabled}
      className={`group flex gap-4 w-full p-3 rounded-xl bg-card text-card-foreground text-left transition-all ${
        isDisabled
          ? "opacity-50 cursor-not-allowed grayscale"
          : "hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99] cursor-pointer"
      }`}
    >
      {/* Product image */}
      <div className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden sm:w-28 sm:h-28">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 96px, 112px"
        />
        {product.badge && (
          <Badge className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-md">
            {product.badge}
          </Badge>
        )}
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/70">
            <span className="text-xs font-bold text-card-foreground/60 uppercase tracking-wider">Sin stock</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <h3 className="font-bold text-sm text-card-foreground leading-tight truncate sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-card-foreground/60 line-clamp-2 leading-relaxed sm:text-sm">
            {product.description}
          </p>
        </div>
        <p className="text-base font-bold text-primary mt-1 sm:text-lg">
          {product.variants.length > 0 ? (
            <>
              <span className="text-xs font-normal text-card-foreground/40 mr-0.5">Desde</span>
              ${Math.min(...product.variants.map((v) => v.price)).toLocaleString("es-AR")}
            </>
          ) : (
            `$${product.price.toLocaleString("es-AR")}`
          )}
        </p>
      </div>
    </button>
  )
}
