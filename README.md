# CABUS Burgers 🍔

Aplicación web full-stack para una hamburguesería, con **storefront para clientes** y **panel administrativo** para gestión de catálogo, pedidos y configuración de la tienda.

---

## 🖼️ Capturas

![Portada tienda](https://res.cloudinary.com/dabmixcta/image/upload/v1777296241/cabus-burgers/402b8f5f-a45f-46f5-9dbf-c1c24ec3abb7.png)
![Detalle de producto](https://res.cloudinary.com/dabmixcta/image/upload/v1777296533/cabus-burgers/98741d70-7c1f-41ad-a851-192fbb625e44.png)
![Carrito](https://res.cloudinary.com/dabmixcta/image/upload/v1777296683/cabus-burgers/df5e9cb0-2762-421f-a3d4-bfe5e7916318.png)
![Checkout](https://res.cloudinary.com/dabmixcta/image/upload/v1777296935/cabus-burgers/837a86a1-5b7b-4ad0-97e9-e5b9ffbd2910.png)
![Panel admin - Configuración](https://res.cloudinary.com/dabmixcta/image/upload/v1777296864/cabus-burgers/046559f9-1ba6-422f-8b02-e9f3f514b482.png)
![Panel admin - Productos](https://res.cloudinary.com/dabmixcta/image/upload/v1777296808/cabus-burgers/00224bb9-a45d-4e71-ae62-2eb5820f6e8f.png)

---

## ✨ Funcionalidades principales

### Cliente (Storefront)
- Carga de categorías, productos y configuración de tienda desde API.
- Navegación por categorías.
- Detalle de producto con variantes y extras.
- Carrito lateral + botón flotante.
- Flujo de checkout y creación de pedidos.

### Admin
- Dashboard general.
- Gestión de productos.
- Gestión de categorías.
- Gestión de extras.
- Gestión de métodos de envío.
- Gestión de métodos de pago.
- Gestión de pedidos.
- Configuración de tienda (nombre, branding, estado abierto/cerrado, mensajes, etc.).

---

## 🧱 Stack técnico

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **UI:** React + componentes estilo shadcn/Radix
- **Estilos:** Tailwind CSS
- **Base de datos:** PostgreSQL
- **ORM:** Prisma

---

## 📂 Estructura relevante

- `app/(client)/page.tsx`: home del cliente.
- `app/admin/page.tsx`: punto de entrada del panel admin.
- `app/api/**`: endpoints REST (store, categories, products, extras, shipping, payment, orders).
- `prisma/schema.prisma`: modelo de datos.
- `prisma/seed.ts`: datos iniciales de ejemplo.
- `components/**`: componentes UI y pantallas.

---

## ⚙️ Requisitos

- Node.js 18+
- pnpm (recomendado) o npm
- PostgreSQL disponible

---

## 🚀 Instalación y ejecución local

1. Instalar dependencias:

```bash
pnpm install
```

2. Crear archivo de entorno (`.env`) con credenciales de base de datos.

Ejemplo mínimo:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
```

3. Generar cliente Prisma y sincronizar esquema:

```bash
pnpm db:generate
pnpm db:push
```

4. (Opcional pero recomendado) Cargar seed:

```bash
pnpm db:seed
```

5. Iniciar en desarrollo:

```bash
pnpm dev
```

6. Abrir en navegador:

- `http://localhost:3000` → tienda cliente
- `http://localhost:3000/admin` → panel admin

---

## 📜 Scripts

```bash
pnpm dev         # Next.js en modo desarrollo
pnpm build       # Build de producción (incluye prisma generate)
pnpm start       # Inicia build de producción
pnpm lint        # Linter
pnpm db:generate # Genera cliente Prisma
pnpm db:push     # Aplica esquema a la BD
pnpm db:seed     # Carga datos de ejemplo
pnpm db:studio   # Prisma Studio
```

---

## 🗄️ Modelo de datos (resumen)

Entidades principales:
- `StoreConfig`
- `Category`
- `Product`
- `Variant`
- `Extra`
- `ProductExtra`
- `ShippingMethod`
- `PaymentMethod`
- `Order`
- `OrderItem`
- `OrderItemExtra`

Incluye:
- variantes por producto,
- extras por producto,
- snapshot de precios en pedido,
- estado de pedido (`PENDIENTE`, `CONFIRMADO`, `EN_PREPARACION`, `LISTO`, `ENVIADO`, `ENTREGADO`, `CANCELADO`).

---

## 🔌 Endpoints API (principales)

- `GET /api/store`
- `GET /api/categories?active=true`
- `GET /api/products?inStock=true`
- `GET /api/extras`
- `GET /api/shipping-methods`
- `GET /api/payment-methods`
- `GET /api/orders`
- `POST /api/orders`

También hay endpoints CRUD por `id` para categorías, productos, extras, envío y pagos.

---

## 🌱 Datos iniciales (seed)

El seed crea:
- Configuración inicial de tienda CABUS.
- Categorías de ejemplo (Hamburguesas, Papas, Bebidas, Combos, etc.).
- Extras, métodos de envío y métodos de pago.
- Productos con imágenes, badges, variantes y extras.

---

## ✅ Estado del proyecto

Proyecto listo para:
- desarrollo local,
- demos funcionales,
- extensión de features (pagos reales, auth, notificaciones, analítica, etc.).

---

## 📝 Notas

- Si quieres branding propio, actualiza `StoreConfig` (logo, portada, nombre y textos).
- Reemplaza los tags de imágenes de este README por links reales cuando tengas las capturas finales.