// Mock data based on the DB diagram schema

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
}

export interface Employee {
  id: string
  branch_id: string
  name: string
  email: string
  role: "cashier" | "manager" | "warehouse" | "admin" | "superuser"
}

export interface ProductCategory {
  id: string
  code: string
  name: string
}

export interface ProductUnit {
  id: string
  product_id: string
  name: string
  conversion_to_base: number
  is_base: boolean
  selling_price: number
  barcode: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category_id: string
  description: string
  image_url: string
  units: ProductUnit[]
}

export interface Member {
  id: string
  member_code: string
  name: string
  phone_number: string
  total_points: number
  status: "active" | "inactive" | "blocked"
}

export interface SaleItem {
  id: string
  product_unit_id: string
  product: Product
  unit: ProductUnit
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Sale {
  id: string
  branch_id: string
  employee_id: string
  items: SaleItem[]
  total_amount: number
  payment_method: "cash" | "card" | "transfer" | "ewallet"
  exchange: number | null
  created_at: string
}

// ── Mock Data ──────────────────────────────────────────────────

export const mockBranch: Branch = {
  id: "b-001",
  name: "Xaithavi Supermarket - Main Branch",
  address: "123 Main Street, Vientiane",
  phone: "020-555-0001",
}

export const mockEmployee: Employee = {
  id: "e-001",
  branch_id: "b-001",
  name: "Noy Khamphone",
  email: "noy@xaithavi.com",
  role: "cashier",
}

export const mockCategories: ProductCategory[] = [
  { id: "cat-001", code: "MEAT", name: "Meat & Poultry" },
  { id: "cat-002", code: "VEG", name: "Vegetables" },
  { id: "cat-003", code: "FRUIT", name: "Fruits" },
  { id: "cat-004", code: "DAIRY", name: "Dairy" },
  { id: "cat-005", code: "BEV", name: "Beverages" },
  { id: "cat-006", code: "SNACK", name: "Snacks" },
  { id: "cat-007", code: "FROZEN", name: "Frozen" },
  { id: "cat-008", code: "BAKERY", name: "Bakery" },
]

const makeUnit = (
  productId: string,
  price: number,
  barcode: string,
  unitName = "pc"
): ProductUnit => ({
  id: `u-${productId}-${unitName}`,
  product_id: productId,
  name: unitName,
  conversion_to_base: 1,
  is_base: true,
  selling_price: price,
  barcode,
})

export const mockProducts: Product[] = [
  {
    id: "p-001",
    name: "Pork Loin",
    sku: "MEAT-001",
    category_id: "cat-001",
    description: "Fresh pork loin, 1 kg",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
    units: [makeUnit("p-001", 120, "8850001000011")],
  },
  {
    id: "p-002",
    name: "Beef Ribs",
    sku: "MEAT-002",
    category_id: "cat-001",
    description: "Premium beef ribs, 1 kg",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    units: [makeUnit("p-002", 150, "8850001000022")],
  },
  {
    id: "p-003",
    name: "Sliced Sirloin",
    sku: "MEAT-003",
    category_id: "cat-001",
    description: "Thinly sliced sirloin steak",
    image_url: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=400&q=80",
    units: [makeUnit("p-003", 139, "8850001000033")],
  },
  {
    id: "p-004",
    name: "Bacon",
    sku: "MEAT-004",
    category_id: "cat-001",
    description: "Smoked bacon strips, 200g",
    image_url: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&q=80",
    units: [makeUnit("p-004", 169, "8850001000044")],
  },
  {
    id: "p-005",
    name: "Tenderloin Steak",
    sku: "MEAT-005",
    category_id: "cat-001",
    description: "Premium tenderloin, 200g",
    image_url: "https://images.unsplash.com/photo-1558030137-a56c1b001cb3?w=400&q=80",
    units: [makeUnit("p-005", 180, "8850001000055")],
  },
  {
    id: "p-006",
    name: "Pork Ribs",
    sku: "MEAT-006",
    category_id: "cat-001",
    description: "Fresh pork ribs, 1 kg",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    units: [makeUnit("p-006", 160, "8850001000066")],
  },
  {
    id: "p-007",
    name: "Pork Leg",
    sku: "MEAT-007",
    category_id: "cat-001",
    description: "Whole pork leg, 1.5 kg",
    image_url: "https://images.unsplash.com/photo-1625937329935-239b3bd30ffe?w=400&q=80",
    units: [makeUnit("p-007", 139, "8850001000077")],
  },
  {
    id: "p-008",
    name: "Fresh Milk 1L",
    sku: "DAIRY-001",
    category_id: "cat-004",
    description: "Full-cream fresh milk, 1 litre",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    units: [makeUnit("p-008", 35, "8850002000011")],
  },
  {
    id: "p-009",
    name: "Cheddar Cheese",
    sku: "DAIRY-002",
    category_id: "cat-004",
    description: "Aged cheddar cheese, 200g",
    image_url: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&q=80",
    units: [makeUnit("p-009", 89, "8850002000022")],
  },
  {
    id: "p-010",
    name: "Orange Juice",
    sku: "BEV-001",
    category_id: "cat-005",
    description: "Fresh squeezed orange juice, 1L",
    image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
    units: [makeUnit("p-010", 45, "8850003000011")],
  },
  {
    id: "p-011",
    name: "Sparkling Water",
    sku: "BEV-002",
    category_id: "cat-005",
    description: "Sparkling mineral water, 500ml",
    image_url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
    units: [makeUnit("p-011", 25, "8850003000022")],
  },
  {
    id: "p-012",
    name: "Potato Chips",
    sku: "SNACK-001",
    category_id: "cat-006",
    description: "Salted potato chips, 100g",
    image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
    units: [makeUnit("p-012", 29, "8850004000011")],
  },
  {
    id: "p-013",
    name: "Tomatoes",
    sku: "VEG-001",
    category_id: "cat-002",
    description: "Fresh ripe tomatoes, 500g",
    image_url: "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&q=80",
    units: [makeUnit("p-013", 28, "8850005000011")],
  },
  {
    id: "p-014",
    name: "Banana",
    sku: "FRUIT-001",
    category_id: "cat-003",
    description: "Fresh bananas, per bunch",
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    units: [makeUnit("p-014", 15, "8850006000011")],
  },
  {
    id: "p-015",
    name: "Croissant",
    sku: "BAK-001",
    category_id: "cat-008",
    description: "Buttery croissant, freshly baked",
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    units: [makeUnit("p-015", 22, "8850007000011")],
  },
  {
    id: "p-016",
    name: "Frozen Pizza",
    sku: "FROZ-001",
    category_id: "cat-007",
    description: "Margherita frozen pizza, 400g",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    units: [makeUnit("p-016", 99, "8850008000011")],
  },
]

export const mockMembers: Member[] = [
  {
    id: "m-001",
    member_code: "MEM-001",
    name: "Somchai Bounmee",
    phone_number: "020-111-2233",
    total_points: 1250,
    status: "active",
  },
  {
    id: "m-002",
    member_code: "MEM-002",
    name: "Khamla Vongsa",
    phone_number: "020-444-5566",
    total_points: 340,
    status: "active",
  },
  {
    id: "m-003",
    member_code: "MEM-003",
    name: "Bounyong Phommachan",
    phone_number: "020-777-8899",
    total_points: 90,
    status: "active",
  },
]

// ── API helpers ────────────────────────────────────────────────

export function getProductsByCategory(categoryId: string | null): Product[] {
  if (!categoryId) return mockProducts
  return mockProducts.filter((p) => p.category_id === categoryId)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.units.some((u) => u.barcode.includes(q))
  )
}

export function getProductByBarcode(barcode: string): Product | null {
  return (
    mockProducts.find((p) => p.units.some((u) => u.barcode === barcode)) ?? null
  )
}

export function getMemberByCode(code: string): Member | null {
  return (
    mockMembers.find(
      (m) => m.member_code === code || m.phone_number === code
    ) ?? null
  )
}
