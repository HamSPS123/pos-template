"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Receipt,
  ArrowUpRight,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Clock,
  ScanBarcode,
  Search,
  Package,
  Users,
  FileText,
  PauseCircle,
  Tag,
  RotateCcw,
  Keyboard,
  Zap,
} from "lucide-react"
import {
  mockRecentSales,
  mockTopProducts,
  formatLAK,
  formatLAKDecimal,
} from "@/lib/mock-dashboard"
import { mockProducts } from "@/lib/mock-data"

const quickActions = [
  { label: "New Sale (POS)", href: "/sales/pos", icon: ShoppingCart, color: "bg-primary text-primary-foreground", shortcut: "F1" },
  { label: "Scan Barcode", href: "/sales/pos", icon: ScanBarcode, color: "bg-green-600 text-white", shortcut: "F2" },
  { label: "Hold Sale", href: "#", icon: PauseCircle, color: "bg-amber-500 text-white", shortcut: "F3" },
  { label: "Returns", href: "#", icon: RotateCcw, color: "bg-red-500 text-white", shortcut: "F4" },
  { label: "Customer Lookup", href: "#", icon: Users, color: "bg-violet-600 text-white", shortcut: "F5" },
  { label: "Discount", href: "#", icon: Tag, color: "bg-pink-500 text-white", shortcut: "F6" },
  { label: "Daily Report", href: "#", icon: FileText, color: "bg-sky-600 text-white", shortcut: "F7" },
  { label: "Shortcuts", href: "#", icon: Keyboard, color: "bg-slate-600 text-white", shortcut: "F8" },
]

const paymentIcons: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-3.5 w-3.5" />,
  card: <CreditCard className="h-3.5 w-3.5" />,
  transfer: <Building2 className="h-3.5 w-3.5" />,
  ewallet: <Smartphone className="h-3.5 w-3.5" />,
}

const todayStats = {
  totalSales: 185_000,
  totalOrders: 42,
  avgOrderValue: 4_405,
  itemsSold: 186,
}

export default function CashierDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cashier Dashboard</h1>
          <p className="text-muted-foreground">
            ສາຂາຕະຫຼາດເຊົ້າ (Morning Market) · Cashier: Noy Khamphone
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 text-base font-semibold">
          <Link href="/sales/pos">
            <ShoppingCart className="h-5 w-5" />
            Open POS
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-xl border p-3 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {action.shortcut}
                  </kbd>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Today&apos;s Sales</span>
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Banknote className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-xl font-bold">฿{formatLAK(todayStats.totalSales)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+5.3% vs yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Orders Today</span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-xl font-bold">{todayStats.totalOrders}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+8 from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Avg. Order Value</span>
              <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-violet-600" />
              </div>
            </div>
            <p className="text-xl font-bold">฿{formatLAK(todayStats.avgOrderValue)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+2.1%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Items Sold</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-bold">{todayStats.itemsSold}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+14 from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales + Product Inventory */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              My Recent Sales
            </CardTitle>
            <p className="text-xs text-muted-foreground">Your latest transactions today</p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y">
                {mockRecentSales.map((sale) => {
                  const time = new Date(sale.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                  return (
                    <div key={sale.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Receipt className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{sale.receipt_no}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                            {paymentIcons[sale.payment_method]}
                            {sale.payment_method}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {sale.items} items · {time}
                        </p>
                      </div>
                      <span className="text-sm font-bold">฿{formatLAKDecimal(sale.total)}</span>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Product Quick View */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Products
              </CardTitle>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Quick search products..." className="pl-9 h-8 text-xs" readOnly />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[360px]">
              <div className="divide-y">
                {mockProducts.slice(0, 12).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">฿{formatLAKDecimal(product.units[0].selling_price)}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{product.units[0].barcode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling - horizontal row */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Hot Products Today
          </CardTitle>
          <p className="text-xs text-muted-foreground">Most sold items — click to quick-add in POS</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {mockTopProducts.slice(0, 6).map((product, i) => (
              <Link
                key={product.id}
                href="/sales/pos"
                className="flex flex-col items-center shrink-0 w-28 rounded-xl border p-3 text-center hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="relative mb-2">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs font-medium line-clamp-1 w-full">{product.name}</p>
                <p className="text-[10px] text-muted-foreground">{product.totalSold.toLocaleString()} sold</p>
                <Separator className="my-1 w-8" />
                <p className="text-xs font-bold text-primary">฿{formatLAK(product.revenue)}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}