"use client"

import { categories } from "@/lib/mock-data"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border" aria-label="Categorias de productos">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar max-w-3xl mx-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  )
}
