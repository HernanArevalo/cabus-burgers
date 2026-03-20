"use client"

import { useState, useRef } from "react"
import type { Product } from "@/lib/types"
import { products } from "@/lib/mock-data"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductList } from "@/components/product-list"
import { ProductDetail } from "@/components/product-detail"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloatingButton } from "@/components/cart-floating-button"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Hamburguesas")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleOrderClick = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <HeroSection onOrderClick={handleOrderClick} />

      {/* Menu section */}
      <div ref={menuRef}>
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <ProductList
          products={products}
          category={activeCategory}
          onProductClick={handleProductClick}
        />
      </div>

      {/* Product detail drawer */}
      <ProductDetail
        product={selectedProduct}
        open={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false)
          setSelectedProduct(null)
        }}
      />

      {/* Cart sidebar */}
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating cart button */}
      <CartFloatingButton onClick={() => setIsCartOpen(true)} />
    </main>
  )
}
