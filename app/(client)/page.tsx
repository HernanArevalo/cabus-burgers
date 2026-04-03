"use client"

import { useState, useRef, useEffect } from "react"
import type { Product, Category, StoreConfig } from "@/lib/types"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductList } from "@/components/product-list"
import { ProductDetail } from "@/components/product-detail"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloatingButton } from "@/components/cart-floating-button"

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [activeCategory, setActiveCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadStorefront = async () => {
      try {
        setLoadError("")
        const [categoriesRes, productsRes, storeRes] = await Promise.all([
          fetch("/api/categories?active=true"),
          fetch("/api/products?inStock=true"),
          fetch("/api/store"),
        ])

        if (!categoriesRes.ok || !productsRes.ok || !storeRes.ok) {
          throw new Error("No se pudo cargar la informacion de la tienda")
        }

        const [categoriesData, productsData, storeData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
          storeRes.json(),
        ])

        setCategories(categoriesData)
        setProducts(productsData)
        setStoreConfig(storeData)
        setActiveCategory(categoriesData[0]?.name ?? "")
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Error cargando datos")
      } finally {
        setLoading(false)
      }
    }

    loadStorefront()
  }, [])

  const handleOrderClick = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <HeroSection
        onOrderClick={handleOrderClick}
        storeName={storeConfig?.name}
        storeTagline={storeConfig?.description}
        isOpen={storeConfig?.isOpen}
        estimatedCloseTime={storeConfig?.estimatedCloseTime}
      />

      {loading && (
        <p className="text-center text-sm text-muted-foreground py-8">Cargando menu...</p>
      )}

      {loadError && (
        <p className="text-center text-sm text-destructive py-8">{loadError}</p>
      )}

      {!loading && !loadError && (
        <div ref={menuRef}>
          <CategoryNav
            categories={categories.map((c) => c.name)}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <ProductList
            products={products}
            category={activeCategory}
            onProductClick={handleProductClick}
          />
        </div>
      )}

      <ProductDetail
        product={selectedProduct}
        open={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false)
          setSelectedProduct(null)
        }}
      />

      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <CartFloatingButton onClick={() => setIsCartOpen(true)} />
    </main>
  )
}
