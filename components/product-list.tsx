"use client"

import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

interface ProductListProps {
  products: Product[]
  category: string
  onProductClick: (product: Product) => void
}

export function ProductList({ products, category, onProductClick }: ProductListProps) {
  const filteredProducts = products.filter((p) => p.category === category)

  if (filteredProducts.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        <p>No hay productos en esta categoria.</p>
      </div>
    )
  }

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-4 font-mono">{category}</h2>
      <div className="flex flex-col gap-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>
    </section>
  )
}
