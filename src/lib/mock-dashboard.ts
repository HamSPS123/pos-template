// Mock dashboard data for Xaithavi Supermarket branches in Vientiane, Laos

export interface BranchDashboard {
  id: string
  name: string
  address: string
  phone: string
  lat: number
  lng: number
  manager: string
  totalRevenue: number
  totalExpense: number
  profit: number
  todaySales: number
  totalOrders: number
  employeeCount: number
  status: "active" | "inactive"
}

export interface DailySales {
  date: string
  revenue: number
  expense: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  sku: string
  image_url: string
  totalSold: number
  revenue: number
  category: string
}

export interface RecentSale {
  id: string
  receipt_no: string
  cashier: string
  items: number
  total: number
  payment_method: "cash" | "card" | "transfer" | "ewallet"
  created_at: string
}

export interface BranchExpense {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

// ── Branch Data (Vientiane, Laos) ──────────────────────────────

export const mockBranches: BranchDashboard[] = [
  {
    id: "br-001",
    name: "ສາຂາຕະຫຼາດເຊົ້າ (Morning Market)",
    address: "Khouvieng Rd, Chanthabouly, Vientiane",
    phone: "021-212-001",
    lat: 17.9667,
    lng: 102.6135,
    manager: "Somchai Philavong",
    totalRevenue: 4_850_000,
    totalExpense: 2_120_000,
    profit: 2_730_000,
    todaySales: 185_000,
    totalOrders: 342,
    employeeCount: 12,
    status: "active",
  },
  {
    id: "br-002",
    name: "ສາຂາທ່າເດື່ອ (Thadeua)",
    address: "Thadeua Rd, Sisattanak, Vientiane",
    phone: "021-312-002",
    lat: 17.9411,
    lng: 102.6473,
    manager: "Khamla Souphanh",
    totalRevenue: 3_620_000,
    totalExpense: 1_780_000,
    profit: 1_840_000,
    todaySales: 142_000,
    totalOrders: 278,
    employeeCount: 9,
    status: "active",
  },
  {
    id: "br-003",
    name: "ສາຂາດົງໂດກ (Dongdok)",
    address: "13 North Rd, Xaythany, Vientiane",
    phone: "021-770-003",
    lat: 18.0204,
    lng: 102.6310,
    manager: "Bounyong Chanthavong",
    totalRevenue: 2_980_000,
    totalExpense: 1_450_000,
    profit: 1_530_000,
    todaySales: 98_000,
    totalOrders: 198,
    employeeCount: 7,
    status: "active",
  },
  {
    id: "br-004",
    name: "ສາຂາໂພນທັນ (Phontan)",
    address: "Phontan Rd, Saysettha, Vientiane",
    phone: "021-415-004",
    lat: 17.9789,
    lng: 102.6378,
    manager: "Vilay Manivong",
    totalRevenue: 3_210_000,
    totalExpense: 1_620_000,
    profit: 1_590_000,
    todaySales: 128_000,
    totalOrders: 245,
    employeeCount: 8,
    status: "active",
  },
  {
    id: "br-005",
    name: "ສາຂາສີໂຄດຕະບອງ (Sikhottabong)",
    address: "Nongbone Rd, Sikhottabong, Vientiane",
    phone: "021-250-005",
    lat: 17.9725,
    lng: 102.5892,
    manager: "Phouthone Keomany",
    totalRevenue: 2_450_000,
    totalExpense: 1_280_000,
    profit: 1_170_000,
    todaySales: 76_000,
    totalOrders: 162,
    employeeCount: 6,
    status: "active",
  },
  {
    id: "br-006",
    name: "ສາຂາວັດຕາຍ (Vat Tai)",
    address: "Samsenthai Rd, Chanthabouly, Vientiane",
    phone: "021-218-006",
    lat: 17.9612,
    lng: 102.6058,
    manager: "Noy Phommasone",
    totalRevenue: 1_890_000,
    totalExpense: 980_000,
    profit: 910_000,
    todaySales: 62_000,
    totalOrders: 134,
    employeeCount: 5,
    status: "inactive",
  },
]

// ── Monthly Sales Data (last 12 months) ────────────────────────

export const mockMonthlySales: { month: string; revenue: number; expense: number }[] = [
  { month: "Mar 2025", revenue: 14_200_000, expense: 7_800_000 },
  { month: "Apr 2025", revenue: 15_600_000, expense: 8_100_000 },
  { month: "May 2025", revenue: 13_800_000, expense: 7_500_000 },
  { month: "Jun 2025", revenue: 16_400_000, expense: 8_600_000 },
  { month: "Jul 2025", revenue: 17_200_000, expense: 9_100_000 },
  { month: "Aug 2025", revenue: 15_900_000, expense: 8_300_000 },
  { month: "Sep 2025", revenue: 14_500_000, expense: 7_900_000 },
  { month: "Oct 2025", revenue: 16_800_000, expense: 8_800_000 },
  { month: "Nov 2025", revenue: 18_200_000, expense: 9_400_000 },
  { month: "Dec 2025", revenue: 22_500_000, expense: 11_200_000 },
  { month: "Jan 2026", revenue: 17_800_000, expense: 9_200_000 },
  { month: "Feb 2026", revenue: 19_000_000, expense: 9_230_000 },
]

// ── Daily Sales (last 7 days) for branch view ──────────────────

export const mockDailySales: DailySales[] = [
  { date: "Mon", revenue: 185_000, expense: 45_000, orders: 42 },
  { date: "Tue", revenue: 198_000, expense: 38_000, orders: 48 },
  { date: "Wed", revenue: 142_000, expense: 52_000, orders: 35 },
  { date: "Thu", revenue: 225_000, expense: 41_000, orders: 56 },
  { date: "Fri", revenue: 267_000, expense: 48_000, orders: 64 },
  { date: "Sat", revenue: 312_000, expense: 55_000, orders: 78 },
  { date: "Sun", revenue: 289_000, expense: 42_000, orders: 71 },
]

// ── Top Selling Products ───────────────────────────────────────

export const mockTopProducts: TopProduct[] = [
  {
    id: "tp-001",
    name: "Pork Loin",
    sku: "MEAT-001",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
    totalSold: 1_284,
    revenue: 154_080,
    category: "Meat & Poultry",
  },
  {
    id: "tp-002",
    name: "Fresh Milk 1L",
    sku: "DAIRY-001",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    totalSold: 1_156,
    revenue: 40_460,
    category: "Dairy",
  },
  {
    id: "tp-003",
    name: "Beef Ribs",
    sku: "MEAT-002",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    totalSold: 892,
    revenue: 133_800,
    category: "Meat & Poultry",
  },
  {
    id: "tp-004",
    name: "Orange Juice",
    sku: "BEV-001",
    image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
    totalSold: 845,
    revenue: 38_025,
    category: "Beverages",
  },
  {
    id: "tp-005",
    name: "Banana",
    sku: "FRUIT-001",
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    totalSold: 780,
    revenue: 11_700,
    category: "Fruits",
  },
  {
    id: "tp-006",
    name: "Potato Chips",
    sku: "SNACK-001",
    image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
    totalSold: 724,
    revenue: 20_996,
    category: "Snacks",
  },
  {
    id: "tp-007",
    name: "Croissant",
    sku: "BAK-001",
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    totalSold: 698,
    revenue: 15_356,
    category: "Bakery",
  },
  {
    id: "tp-008",
    name: "Sparkling Water",
    sku: "BEV-002",
    image_url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
    totalSold: 612,
    revenue: 15_300,
    category: "Beverages",
  },
]

// ── Recent Sales ───────────────────────────────────────────────

export const mockRecentSales: RecentSale[] = [
  { id: "s-001", receipt_no: "RC-20260303-001", cashier: "Noy Khamphone", items: 5, total: 487.50, payment_method: "cash", created_at: "2026-03-03T14:25:00" },
  { id: "s-002", receipt_no: "RC-20260303-002", cashier: "Keo Vongsa", items: 3, total: 289.00, payment_method: "card", created_at: "2026-03-03T14:18:00" },
  { id: "s-003", receipt_no: "RC-20260303-003", cashier: "Noy Khamphone", items: 8, total: 1_245.75, payment_method: "cash", created_at: "2026-03-03T14:05:00" },
  { id: "s-004", receipt_no: "RC-20260303-004", cashier: "Dao Phimmasone", items: 2, total: 175.00, payment_method: "ewallet", created_at: "2026-03-03T13:52:00" },
  { id: "s-005", receipt_no: "RC-20260303-005", cashier: "Keo Vongsa", items: 6, total: 892.25, payment_method: "transfer", created_at: "2026-03-03T13:40:00" },
  { id: "s-006", receipt_no: "RC-20260303-006", cashier: "Noy Khamphone", items: 4, total: 356.00, payment_method: "cash", created_at: "2026-03-03T13:28:00" },
  { id: "s-007", receipt_no: "RC-20260303-007", cashier: "Dao Phimmasone", items: 1, total: 150.00, payment_method: "card", created_at: "2026-03-03T13:15:00" },
  { id: "s-008", receipt_no: "RC-20260303-008", cashier: "Keo Vongsa", items: 7, total: 1_089.50, payment_method: "cash", created_at: "2026-03-03T12:58:00" },
  { id: "s-009", receipt_no: "RC-20260303-009", cashier: "Noy Khamphone", items: 3, total: 425.00, payment_method: "ewallet", created_at: "2026-03-03T12:42:00" },
  { id: "s-010", receipt_no: "RC-20260303-010", cashier: "Dao Phimmasone", items: 5, total: 678.75, payment_method: "cash", created_at: "2026-03-03T12:30:00" },
]

// ── Branch Expenses ────────────────────────────────────────────

export const mockBranchExpenses: BranchExpense[] = [
  { id: "exp-001", title: "ค่าไฟฟ้า (Electricity)", amount: 45_000, category: "Utilities", date: "2026-03-01" },
  { id: "exp-002", title: "ค่าน้ำ (Water)", amount: 12_000, category: "Utilities", date: "2026-03-01" },
  { id: "exp-003", title: "เงินเดือนพนักงาน (Salaries)", amount: 180_000, category: "Payroll", date: "2026-02-28" },
  { id: "exp-004", title: "ค่าเช่า (Rent)", amount: 85_000, category: "Rent", date: "2026-03-01" },
  { id: "exp-005", title: "ค่าขนส่งสินค้า (Logistics)", amount: 28_000, category: "Logistics", date: "2026-03-02" },
  { id: "exp-006", title: "ค่าบำรุงรักษา (Maintenance)", amount: 15_000, category: "Maintenance", date: "2026-02-25" },
  { id: "exp-007", title: "ค่าอินเทอร์เน็ต (Internet)", amount: 8_500, category: "Utilities", date: "2026-03-01" },
  { id: "exp-008", title: "วัสดุสำนักงาน (Supplies)", amount: 6_200, category: "Supplies", date: "2026-02-27" },
]

// ── Revenue by Category (for pie chart) ────────────────────────

export const mockRevenueByCategory = [
  { category: "Meat & Poultry", revenue: 6_540_000, fill: "var(--color-chart-1)" },
  { category: "Dairy", revenue: 3_280_000, fill: "var(--color-chart-2)" },
  { category: "Beverages", revenue: 2_890_000, fill: "var(--color-chart-3)" },
  { category: "Snacks", revenue: 1_950_000, fill: "var(--color-chart-4)" },
  { category: "Fruits", revenue: 1_640_000, fill: "var(--color-chart-5)" },
  { category: "Vegetables", revenue: 1_420_000, fill: "var(--color-primary)" },
  { category: "Bakery", revenue: 980_000, fill: "var(--color-muted-foreground)" },
  { category: "Frozen", revenue: 750_000, fill: "var(--color-destructive)" },
]

// ── Alerts ─────────────────────────────────────────────────────

export interface DashboardAlert {
  id: string
  type: "warning" | "danger" | "info"
  title: string
  description: string
  branch?: string
  time: string
}

export const mockAlerts: DashboardAlert[] = [
  { id: "a-001", type: "danger",  title: "ສາຂາວັດຕາຍ ປິດໃຫ້ບໍລິການ", description: "ສາຂານີ້ຢູ່ໃນສະຖານະ inactive", branch: "ສາຂາວັດຕາຍ", time: "ມື້ນີ້" },
  { id: "a-002", type: "warning", title: "ຍອດຂາຍດົງໂດກຕ່ຳກວ່າ target", description: "ຍອດຂາຍ ₭98,000 ທຽບ target ₭150,000 (65%)", branch: "ສາຂາດົງໂດກ", time: "ມື້ນີ້" },
  { id: "a-003", type: "warning", title: "ສາຂາສີໂຄດຕະບອງ stock ໃກ້ໝົດ", description: "3 ລາຍການສິນຄ້າ stock ເຫຼືອໜ້ອຍກວ່າ 10 ຊິ້ນ", branch: "ສາຂາສີໂຄດຕະບອງ", time: "2 ຊົ່ວໂມງກ່ອນ" },
  { id: "a-004", type: "info",    title: "ພະນັກງານໃໝ່ລົງທະບຽນ", description: "Souksamone Phomvihane ໄດ້ເຂົ້າຮ່ວມ ສາຂາທ່າເດື່ອ", branch: "ສາຂາທ່າເດື່ອ", time: "3 ຊົ່ວໂມງກ່ອນ" },
  { id: "a-005", type: "info",    title: "ອໍເດີໃຫຍ່ຈາກ B2B", description: "ອໍເດີ ₭2,450,000 ລໍຖ້າການຢືນຢັນ", branch: "ສາຂາຕະຫຼາດເຊົ້າ", time: "4 ຊົ່ວໂມງກ່ອນ" },
]

// ── Live Sales Feed ─────────────────────────────────────────────

export interface LiveSale {
  id: string
  branch: string
  branchShort: string
  cashier: string
  items: number
  total: number
  payment: "cash" | "card" | "transfer" | "ewallet"
  time: string
}

export const mockLiveSales: LiveSale[] = [
  { id: "ls-001", branch: "ສາຂາຕະຫຼາດເຊົ້າ", branchShort: "ຕລດ.ເຊົ້າ", cashier: "Noy K.", items: 5, total: 487_500, payment: "cash",     time: "ດຽວນີ້" },
  { id: "ls-002", branch: "ສາຂາໂພນທັນ",       branchShort: "ໂພນທັນ",    cashier: "Keo V.",  items: 3, total: 289_000, payment: "card",     time: "2 ນທ." },
  { id: "ls-003", branch: "ສາຂາທ່າເດື່ອ",     branchShort: "ທ່າເດື່ອ",  cashier: "Dao P.",  items: 8, total: 1_245_750, payment: "cash",   time: "5 ນທ." },
  { id: "ls-004", branch: "ສາຂາດົງໂດກ",       branchShort: "ດົງໂດກ",    cashier: "Sone B.", items: 2, total: 175_000, payment: "ewallet",  time: "8 ນທ." },
  { id: "ls-005", branch: "ສາຂາຕະຫຼາດເຊົ້າ", branchShort: "ຕລດ.ເຊົ້າ", cashier: "Noy K.", items: 6, total: 892_250, payment: "transfer",  time: "12 ນທ." },
  { id: "ls-006", branch: "ສາຂາສີໂຄດຕະບອງ",  branchShort: "ສີໂຄດ",     cashier: "Phout.", items: 4, total: 356_000, payment: "cash",     time: "15 ນທ." },
  { id: "ls-007", branch: "ສາຂາໂພນທັນ",       branchShort: "ໂພນທັນ",    cashier: "Keo V.",  items: 1, total: 150_000, payment: "card",     time: "18 ນທ." },
  { id: "ls-008", branch: "ສາຂາທ່າເດື່ອ",     branchShort: "ທ່າເດື່ອ",  cashier: "Dao P.",  items: 7, total: 1_089_500, payment: "cash",  time: "21 ນທ." },
  { id: "ls-009", branch: "ສາຂາດົງໂດກ",       branchShort: "ດົງໂດກ",    cashier: "Sone B.", items: 3, total: 425_000, payment: "ewallet",  time: "25 ນທ." },
  { id: "ls-010", branch: "ສາຂາຕະຫຼາດເຊົ້າ", branchShort: "ຕລດ.ເຊົ້າ", cashier: "Noy K.", items: 5, total: 678_750, payment: "cash",     time: "28 ນທ." },
]

// ── Payment Method Breakdown ────────────────────────────────────

export const mockPaymentBreakdown = [
  { method: "cash",     label: "ເງິນສົດ",    value: 58, amount: 10_740_000, color: "#2563eb" },
  { method: "card",     label: "ບັດ",         value: 22, amount: 4_070_000,  color: "#22c55e" },
  { method: "transfer", label: "ໂອນ",         value: 14, amount: 2_590_000,  color: "#f59e0b" },
  { method: "ewallet",  label: "E-Wallet",    value: 6,  amount: 1_110_000,  color: "#a855f7" },
]

// ── Hourly Sales Today ──────────────────────────────────────────

export const mockHourlySales = [
  { hour: "07:00", revenue: 45_000 },
  { hour: "08:00", revenue: 128_000 },
  { hour: "09:00", revenue: 215_000 },
  { hour: "10:00", revenue: 189_000 },
  { hour: "11:00", revenue: 245_000 },
  { hour: "12:00", revenue: 312_000 },
  { hour: "13:00", revenue: 178_000 },
  { hour: "14:00", revenue: 267_000 },
  { hour: "15:00", revenue: 198_000 },
  { hour: "16:00", revenue: 289_000 },
  { hour: "17:00", revenue: 342_000 },
  { hour: "18:00", revenue: 224_000 },
  { hour: "19:00", revenue: 156_000 },
  { hour: "20:00", revenue: 87_000 },
]

// ── Low Stock Items ─────────────────────────────────────────────

export interface LowStockItem {
  id: string
  name: string
  sku: string
  branch: string
  stock: number
  minStock: number
  category: string
}

export const mockLowStock: LowStockItem[] = [
  { id: "ls-001", name: "Pork Loin",       sku: "MEAT-001", branch: "ສີໂຄດຕະບອງ", stock: 4,  minStock: 20, category: "Meat & Poultry" },
  { id: "ls-002", name: "Fresh Milk 1L",   sku: "DAIRY-001", branch: "ດົງໂດກ",     stock: 7,  minStock: 30, category: "Dairy" },
  { id: "ls-003", name: "Croissant",       sku: "BAK-001",   branch: "ວັດຕາຍ",      stock: 3,  minStock: 15, category: "Bakery" },
  { id: "ls-004", name: "Orange Juice",    sku: "BEV-001",   branch: "ໂພນທັນ",      stock: 9,  minStock: 25, category: "Beverages" },
  { id: "ls-005", name: "Potato Chips",    sku: "SNACK-001", branch: "ທ່າເດື່ອ",    stock: 6,  minStock: 20, category: "Snacks" },
  { id: "ls-006", name: "Banana",          sku: "FRUIT-001", branch: "ຕລດ.ເຊົ້າ",  stock: 12, minStock: 40, category: "Fruits" },
]

// ── Helpers ────────────────────────────────────────────────────

export const formatLAK = (amount: number) =>
  new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

export const formatLAKDecimal = (amount: number) =>
  new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

export const getTotalRevenue = () => mockBranches.reduce((s, b) => s + b.totalRevenue, 0)
export const getTotalExpense = () => mockBranches.reduce((s, b) => s + b.totalExpense, 0)
export const getTotalProfit = () => mockBranches.reduce((s, b) => s + b.profit, 0)
export const getTotalOrders = () => mockBranches.reduce((s, b) => s + b.totalOrders, 0)
export const getTodaySalesTotal = () => mockBranches.reduce((s, b) => s + b.todaySales, 0)
