"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import type { BranchMapHandle } from "@/components/dashboard/branch-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Store,
  Users,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  AlertCircle,
  Info,
  Zap,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Package,
  Clock,
} from "lucide-react"
import {
  mockBranches,
  mockMonthlySales,
  mockTopProducts,
  mockRevenueByCategory,
  mockAlerts,
  mockLiveSales,
  mockPaymentBreakdown,
  mockHourlySales,
  mockLowStock,
  formatLAK,
  getTotalRevenue,
  getTotalExpense,
  getTotalProfit,
  getTotalOrders,
  getTodaySalesTotal,
} from "@/lib/mock-dashboard"
import { mockProducts, mockCategories } from "@/lib/mock-data"

const BranchMap = dynamic(() => import("@/components/dashboard/branch-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded-xl animate-pulse">
      <MapPin className="h-10 w-10 text-muted-foreground/30" />
    </div>
  ),
})

const waveSvgs: Record<string, string> = {
  green:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40'%3E%3Cpath d='M0 25 Q30 5 60 20 T120 15 T200 20 L200 40 L0 40Z' fill='%2322c55e' opacity='0.12'/%3E%3Cpath d='M0 30 Q40 12 80 25 T160 20 T200 28 L200 40 L0 40Z' fill='%2322c55e' opacity='0.08'/%3E%3C/svg%3E",
  red:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40'%3E%3Cpath d='M0 25 Q30 5 60 20 T120 15 T200 20 L200 40 L0 40Z' fill='%23ef4444' opacity='0.12'/%3E%3Cpath d='M0 30 Q40 12 80 25 T160 20 T200 28 L200 40 L0 40Z' fill='%23ef4444' opacity='0.08'/%3E%3C/svg%3E",
  blue:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40'%3E%3Cpath d='M0 25 Q30 5 60 20 T120 15 T200 20 L200 40 L0 40Z' fill='%232563eb' opacity='0.12'/%3E%3Cpath d='M0 30 Q40 12 80 25 T160 20 T200 28 L200 40 L0 40Z' fill='%232563eb' opacity='0.08'/%3E%3C/svg%3E",
  amber:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40'%3E%3Cpath d='M0 25 Q30 5 60 20 T120 15 T200 20 L200 40 L0 40Z' fill='%23f59e0b' opacity='0.15'/%3E%3Cpath d='M0 30 Q40 12 80 25 T160 20 T200 28 L200 40 L0 40Z' fill='%23f59e0b' opacity='0.10'/%3E%3C/svg%3E",
}

const statCards = [
  {
    title: "ລາຍຮັບທັງໝົດ",
    value: `₭${formatLAK(getTotalRevenue())}`,
    change: "+14.2%",
    sub: "ທຽບເດືອນກ່ອນ",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-500/10",
    wave: waveSvgs.green,
  },
  {
    title: "ລາຍຈ່າຍທັງໝົດ",
    value: `₭${formatLAK(getTotalExpense())}`,
    change: "+8.1%",
    sub: "ທຽບເດືອນກ່ອນ",
    trend: "up" as const,
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-500/10",
    wave: waveSvgs.red,
  },
  {
    title: "ກຳໄລສຸດທິ",
    value: `₭${formatLAK(getTotalProfit())}`,
    change: "+22.5%",
    sub: "ທຽບເດືອນກ່ອນ",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    wave: waveSvgs.blue,
  },
  {
    title: "ຍອດຂາຍມື້ນີ້",
    value: `₭${formatLAK(getTodaySalesTotal())}`,
    change: "+5.8%",
    sub: "ທຽບມື້ວານ",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    wave: waveSvgs.amber,
  },
]

const categoryColors = [
  "bg-primary",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-slate-400",
]

export default function SuperAdminDashboard() {
  const mapRef = useRef<BranchMapHandle>(null)
  const maxMonthlyRevenue = Math.max(...mockMonthlySales.map((m) => m.revenue))
  const totalCategoryRevenue = mockRevenueByCategory.reduce((s, c) => s + c.revenue, 0)
  const maxCategoryRevenue = Math.max(...mockRevenueByCategory.map((c) => c.revenue))

  return (
    <div className="space-y-5">
      {/* Stat cards with wave graphic */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="shadow-none hover:shadow-md transition-shadow overflow-hidden relative">
              <CardContent className="pt-4 pb-6 px-5">
                <div className="flex items-start gap-3">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight mt-0.5">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-1">{stat.sub}</span>
                </div>
              </CardContent>
              <div
                className="absolute bottom-0 left-0 right-0 h-10 bg-no-repeat bg-bottom bg-cover pointer-events-none"
                style={{ backgroundImage: `url("${stat.wave}")` }}
              />
            </Card>
          )
        })}
      </div>

      {/* Map + Branch List side by side */}
        <Card className="lg:col-span-3 shadow-none overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              ສະຖານທີ່ສາຂາ
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              ວຽງຈັນ, ລາວ · {mockBranches.filter(b => b.status === "active").length} ສາຂາເປີດໃຫ້ບໍລິການ
            </p>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="grid gap-4 lg:grid-cols-5">
              <div className="h-full rounded-xl overflow-hidden border lg:col-span-4">
                <BranchMap ref={mapRef} branches={mockBranches} />
              </div>
              <div className="divide-y lg:col-span-1">
                  <ScrollArea className="h-[600px]">
                    {mockBranches.map((branch) => (
                      <div
                        key={branch.id}
                        className="px-4 py-3.5 hover:bg-muted/30 border-b border-muted transition-colors cursor-pointer"
                        onClick={() => mapRef.current?.flyTo(branch.lat, branch.lng)}
                      >
                        {/* Row 1: Name + Status */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <p className="text-sm font-bold leading-tight">{branch.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{branch.address}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${branch.status === "active" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                            {branch.status}
                          </span>
                        </div>
                        {/* Row 2: Revenue / Expense / Profit */}
                        <div className="flex items-center gap-6 mt-2.5 text-xs">
                          <div>
                            <p className="text-muted-foreground text-[10px]">Revenue</p>
                            <p className="font-bold text-green-600">₭{formatLAK(branch.totalRevenue)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-[10px]">Expense</p>
                            <p className="font-bold text-red-500">₭{formatLAK(branch.totalExpense)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-[10px]">Profit</p>
                            <p className="font-bold text-primary">₭{formatLAK(branch.profit)}</p>
                          </div>
                        </div>
                        {/* Row 3: Staff / Orders / Manager */}
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {branch.employeeCount} staff</span>
                          <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> {branch.totalOrders} orders</span>
                          <span className="flex items-center gap-1 ml-auto"><Users className="h-3 w-3" /> {branch.manager}</span>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
            </div>
          </CardContent>
        </Card>
      {/* Revenue Overview Chart — Image 1 style with Y-axis + paired bars */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="shadow-none lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">ຍອດຂາຍມື້ນີ້</CardTitle>
                <p className="text-2xl font-bold mt-1">₭{formatLAK(getTotalRevenue())}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> ຍອດຂາຍ</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-orange-400" /> ຕົ້ນທຶນ</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {(() => {
              const chartMax = maxMonthlyRevenue
              const steps = 5
              const stepValue = Math.ceil(chartMax / steps / 100_000) * 100_000
              const yLabels = Array.from({ length: steps + 1 }, (_, i) => stepValue * (steps - i))
              const chartHeight = 240
  
              return (
                <div className="flex gap-2">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between pr-1 shrink-0" style={{ height: `${chartHeight}px` }}>
                    {yLabels.map((v) => (
                      <span key={v} className="text-[10px] text-muted-foreground tabular-nums text-right w-8 leading-none">
                        {v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}k`}
                      </span>
                    ))}
                  </div>
  
                  {/* Chart area */}
                  <div className="flex-1 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {yLabels.map((v) => (
                        <div key={v} className="border-b border-dashed border-muted-foreground/10 w-full h-0" />
                      ))}
                    </div>
  
                    {/* Bars */}
                    <div className="flex items-end gap-2 relative z-10" style={{ height: `${chartHeight}px` }}>
                      {mockMonthlySales.map((m) => {
                        const revH = (m.revenue / (stepValue * steps)) * chartHeight
                        const expH = (m.expense / (stepValue * steps)) * chartHeight
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group/bar">
                            <div className="w-full flex items-end justify-center gap-[3px]" style={{ height: `${chartHeight - 20}px` }}>
                              <div
                                className="w-[40%] rounded-t-md bg-primary hover:bg-primary/85 transition-all cursor-default"
                                style={{ height: `${revH}px` }}
                                title={`ລາຍຮັບ: ₭${formatLAK(m.revenue)}`}
                              />
                              <div
                                className="w-[40%] rounded-t-md bg-orange-400 hover:bg-orange-400/85 transition-all cursor-default"
                                style={{ height: `${expH}px` }}
                                title={`ລາຍຈ່າຍ: ₭${formatLAK(m.expense)}`}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground font-medium">{m.month.slice(0, 3)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
  
        <Card className="shadow-none lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                ສິນຄ້າຂາຍດີ
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">ທຸກສາຂາ ເດືອນນີ້</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[340px]">
                <div className="divide-y">
                  {mockTopProducts.map((product, i) => (
                    <div key={product.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors">
                      <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">{product.totalSold.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">ຊິ້ນ</span></p>
                        <p className="text-[11px] text-muted-foreground font-medium">₭{formatLAK(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
      </div>

      {/* Revenue by Category + Top Selling Products */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue by Category */}
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">ລາຍຮັບຕາມໝວດໝູ່</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">ການແບ່ງຕາມປະເພດສິນຄ້າ</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {mockRevenueByCategory.map((cat, i) => {
                const pct = (cat.revenue / totalCategoryRevenue) * 100
                const widthPct = (cat.revenue / maxCategoryRevenue) * 100
                return (
                  <div key={cat.category} className="group/cat">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${categoryColors[i]}`} />
                      <span className="text-xs font-medium flex-1">{cat.category}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">{pct.toFixed(1)}%</span>
                      <span className="text-[11px] font-bold tabular-nums w-20 text-right">₭{formatLAK(cat.revenue)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden ml-4">
                      <div
                        className={`h-full rounded-full ${categoryColors[i]} transition-all group-hover/cat:opacity-80`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">ລວມທັງໝົດ</span>
              <span className="font-bold">₭{formatLAK(totalCategoryRevenue)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products — LIST format */}
        <div className="grid gap-3 grid-cols-2">
        <div>
          <Card className="shadow-none">
            <CardContent className="py-4 px-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <ShoppingCart className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ອໍເດີທັງໝົດ</p>
                <p className="text-lg font-bold">{getTotalOrders().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-none">
            <CardContent className="py-4 px-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                <Store className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ສາຂາເປີດບໍລິການ</p>
                <p className="text-lg font-bold">{mockBranches.filter(b => b.status === "active").length}/{mockBranches.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-none">
            <CardContent className="py-4 px-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ພະນັກງານທັງໝົດ</p>
                <p className="text-lg font-bold">{mockBranches.reduce((s, b) => s + b.employeeCount, 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-none">
            <CardContent className="py-4 px-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ອັດຕາກຳໄລ</p>
                <p className="text-lg font-bold">{((getTotalProfit() / getTotalRevenue()) * 100).toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-none">
            <CardContent className="py-4 px-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ຈຳນວນສິນຄ້າທັງໝົດ</p>
                <p className="text-lg font-bold">{mockProducts.length.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-none">
            <CardContent className="py-4 px-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                <Store className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ປະເພດສິນຄ້າທັງໝົດ</p>
                <p className="text-lg font-bold">{mockCategories.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* ── Alert Panel ── */}
      {/* <Card className="shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            ການແຈ້ງເຕືອນ
            <span className="ml-auto text-[10px] font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">
              {mockAlerts.filter(a => a.type !== "info").length} ດ່ວນ
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockAlerts.map((alert) => {
              const cfg = {
                danger:  { icon: AlertCircle,   bg: "bg-red-50 dark:bg-red-950/20",    border: "border-l-red-500",    iconColor: "text-red-500",    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
                warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-l-amber-500", iconColor: "text-amber-500",  badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
                info:    { icon: Info,           bg: "bg-blue-50 dark:bg-blue-950/20",   border: "border-l-blue-400",  iconColor: "text-blue-500",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
              }[alert.type]
              const Icon = cfg.icon
              return (
                <div key={alert.id} className={`flex items-start gap-3 px-4 py-3 border-l-4 ${cfg.border} ${cfg.bg}`}>
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{alert.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {alert.branch && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>{alert.branch}</span>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card> */}

      {/* ── Hourly Sales + Payment Breakdown ── */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Hourly Sales Chart */}
        <Card className="shadow-none lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              ຍອດຂາຍລາຍຊົ່ວໂມງ (ມື້ນີ້)
            </CardTitle>
            <p className="text-xs text-muted-foreground">ທຸກສາຂາ · ຊົ່ວໂມງເລີ່ມຈາກ 07:00</p>
          </CardHeader>
          <CardContent className="pt-2">
            {(() => {
              const maxH = Math.max(...mockHourlySales.map(h => h.revenue))
              const chartH = 160
              return (
                <div className="flex gap-1 items-end" style={{ height: `${chartH + 24}px` }}>
                  {mockHourlySales.map((h) => {
                    const barH = (h.revenue / maxH) * chartH
                    const isPeak = h.revenue === maxH
                    return (
                      <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group/hbar">
                        <div className="w-full flex items-end justify-center" style={{ height: `${chartH}px` }}>
                          <div
                            className={`w-full rounded-t-sm transition-all cursor-default ${isPeak ? "bg-primary" : "bg-primary/30 group-hover/hbar:bg-primary/60"}`}
                            style={{ height: `${barH}px` }}
                            title={`${h.hour}: ₭${formatLAK(h.revenue)}`}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground leading-none">{h.hour.slice(0, 2)}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground border-t pt-2">
              <span>Peak: <span className="font-semibold text-foreground">17:00 — ₭{formatLAK(mockHourlySales.find(h => h.revenue === Math.max(...mockHourlySales.map(x => x.revenue)))!.revenue)}</span></span>
              <span>ລວມ: <span className="font-semibold text-foreground">₭{formatLAK(mockHourlySales.reduce((s, h) => s + h.revenue, 0))}</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card className="shadow-none lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />
              ການຊຳລະເງິນ
            </CardTitle>
            <p className="text-xs text-muted-foreground">ສັດສ່ວນຕາມວິທີຊຳລະ</p>
          </CardHeader>
          <CardContent>
            {/* Donut-style bar */}
            <div className="flex rounded-full overflow-hidden h-4 mb-4 gap-[2px]">
              {mockPaymentBreakdown.map((p) => (
                <div
                  key={p.method}
                  className="h-full transition-all"
                  style={{ width: `${p.value}%`, background: p.color }}
                  title={`${p.label}: ${p.value}%`}
                />
              ))}
            </div>
            <div className="space-y-2.5">
              {mockPaymentBreakdown.map((p) => {
                const Icon = p.method === "cash" ? Banknote : p.method === "card" ? CreditCard : p.method === "transfer" ? Building2 : Smartphone
                return (
                  <div key={p.method} className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs flex-1">{p.label}</span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: p.color }}>{p.value}%</span>
                    <span className="text-[11px] text-muted-foreground tabular-nums w-24 text-right">₭{formatLAK(p.amount)}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 pt-2 border-t flex justify-between text-xs">
              <span className="text-muted-foreground">ລວມທຸລະກຳ</span>
              <span className="font-bold">₭{formatLAK(mockPaymentBreakdown.reduce((s, p) => s + p.amount, 0))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Live Sales Feed + Low Stock ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Live Sales Feed */}
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              ການຂາຍລ່າສຸດ
              <span className="ml-1 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Real-time · ທຸກສາຂາ</p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="divide-y">
                {mockLiveSales.map((sale, i) => {
                  const payIcon = { cash: Banknote, card: CreditCard, transfer: Building2, ewallet: Smartphone }[sale.payment]
                  const PayIcon = payIcon
                  const payColor = { cash: "text-blue-500", card: "text-green-500", transfer: "text-amber-500", ewallet: "text-purple-500" }[sale.payment]
                  return (
                    <div key={sale.id} className={`flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors ${i === 0 ? "bg-green-50/50 dark:bg-green-950/10" : ""}`}>
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold text-muted-foreground">
                        {sale.branchShort.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{sale.branch}</p>
                        <p className="text-[10px] text-muted-foreground">{sale.cashier} · {sale.items} ລາຍການ</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">₭{formatLAK(sale.total)}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <PayIcon className={`h-3 w-3 ${payColor}`} />
                          <span className="text-[10px] text-muted-foreground">{sale.time}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Low Stock Warning */}
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-red-500" />
              ສິນຄ້າໃກ້ໝົດ
              <span className="ml-auto text-[10px] font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">
                {mockLowStock.length} ລາຍການ
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">stock ຕ່ຳກວ່າ minimum</p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="divide-y">
                {mockLowStock.map((item) => {
                  const pct = Math.round((item.stock / item.minStock) * 100)
                  const barColor = pct <= 30 ? "bg-red-500" : pct <= 60 ? "bg-amber-500" : "bg-green-500"
                  return (
                    <div key={item.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.sku} · {item.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-bold ${pct <= 30 ? "text-red-500" : "text-amber-500"}`}>{item.stock} ຊິ້ນ</p>
                          <p className="text-[10px] text-muted-foreground">min: {item.minStock}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-16 text-right">{item.branch}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
