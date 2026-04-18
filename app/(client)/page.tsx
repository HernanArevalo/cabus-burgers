"use client"

import { useState, useRef, useEffect } from "react"
import type { Product, StoreConfig, Category } from "@/lib/types"
import { getProducts, getCategories, getStoreConfig } from "@/lib/api"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductList } from "@/components/product-list"
import { ProductDetail } from "@/components/product-detail"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloatingButton } from "@/components/cart-floating-button"
import { Spinner } from "@/components/ui/spinner"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeCategory, setActiveCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [productsData, categoriesData, configData] = await Promise.all([
          getProducts(),
          getCategories(),
          getStoreConfig(),
        ])

        setProducts(productsData || [])
        setCategories(categoriesData || [])
        setStoreConfig(configData || null)
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleOrderClick = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }

  // Set default category once loaded
  const activeCategories = categories.filter((c) => c.active)
  const currentCategory = activeCategory || activeCategories[0]?.name || ""

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-card-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <HeroSection onOrderClick={handleOrderClick} storeConfig={storeConfig || undefined} />

      {/* Menu section */}
      <div ref={menuRef}>
        <CategoryNav
          categories={activeCategories}
          activeCategory={currentCategory}
          onCategoryChange={setActiveCategory}
        />
        <ProductList
          products={products}
          category={currentCategory}
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
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} storeConfig={storeConfig || undefined} />

      {/* Floating cart button */}
      <CartFloatingButton onClick={() => setIsCartOpen(true)} />
    </main>
  )
}
