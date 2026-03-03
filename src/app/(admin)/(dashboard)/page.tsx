"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  Package,
} from "lucide-react"
import {
  mockBranches,
  mockMonthlySales,
  mockTopProducts,
  mockRevenueByCategory,
  formatLAK,
  getTotalRevenue,
  getTotalExpense,
  getTotalProfit,
  getTotalOrders,
  getTodaySalesTotal,
} from "@/lib/mock-dashboard"

const BranchMap = dynamic(() => import("@/components/dashboard/branch-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
      <MapPin className="h-8 w-8 animate-pulse text-muted-foreground" />
    </div>
  ),
})

const statCards = [
  {
    title: "Total Revenue",
    value: `฿${formatLAK(getTotalRevenue())}`,
    change: "+14.2%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  {
    title: "Total Expense",
    value: `฿${formatLAK(getTotalExpense())}`,
    change: "+8.1%",
    trend: "up" as const,
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Net Profit",
    value: `฿${formatLAK(getTotalProfit())}`,
    change: "+22.5%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Today's Sales",
    value: `฿${formatLAK(getTodaySalesTotal())}`,
    change: "+5.8%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    title: "Total Orders",
    value: getTotalOrders().toLocaleString(),
    change: "+12 today",
    trend: "up" as const,
    icon: Package,
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    title: "Active Branches",
    value: `${mockBranches.filter((b) => b.status === "active").length}/${mockBranches.length}`,
    change: "1 inactive",
    trend: "down" as const,
    icon: Store,
    color: "text-sky-600",
    bg: "bg-sky-500/10",
  },
]

export default function SuperAdminDashboard() {
  const maxRevenue = Math.max(...mockMonthlySales.map((m) => m.revenue))
  const maxCategoryRevenue = Math.max(...mockRevenueByCategory.map((c) => c.revenue))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all Xaithavi Supermarket branches in Vientiane
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Map + Branch List row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Branch Locations — Vientiane, Laos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <BranchMap branches={mockBranches} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              Branch List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[420px]">
              <div className="divide-y">
                {mockBranches.map((branch) => (
                  <div key={branch.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{branch.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{branch.address}</p>
                      </div>
                      <Badge
                        variant={branch.status === "active" ? "default" : "secondary"}
                        className="text-[10px] shrink-0"
                      >
                        {branch.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Revenue</span>
                        <p className="font-semibold text-green-600">฿{formatLAK(branch.totalRevenue)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expense</span>
                        <p className="font-semibold text-red-500">฿{formatLAK(branch.totalExpense)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profit</span>
                        <p className="font-semibold text-primary">฿{formatLAK(branch.profit)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{branch.employeeCount} staff</span>
                      <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{branch.totalOrders} orders</span>
                      <span className="flex items-center gap-1">👤 {branch.manager}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Revenue vs Expense bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Revenue vs Expense</CardTitle>
            <p className="text-xs text-muted-foreground">Last 12 months overview</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {mockMonthlySales.map((m) => (
                <div key={m.month} className="flex items-center gap-3 text-xs">
                  <span className="w-16 shrink-0 text-muted-foreground">{m.month.slice(0, 3)}</span>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-3 rounded-sm bg-primary"
                        style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        ฿{formatLAK(m.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-3 rounded-sm bg-red-400/70"
                        style={{ width: `${(m.expense / maxRevenue) * 100}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        ฿{formatLAK(m.expense)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-400/70" /> Expense</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Category</CardTitle>
            <p className="text-xs text-muted-foreground">Product category breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRevenueByCategory.map((cat) => {
                const pct = (cat.revenue / mockRevenueByCategory.reduce((s, c) => s + c.revenue, 0)) * 100
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                        <span className="text-xs font-semibold">฿{formatLAK(cat.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${(cat.revenue / maxCategoryRevenue) * 100}%`,
                          opacity: 0.4 + (cat.revenue / maxCategoryRevenue) * 0.6,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Top Selling Products
          </CardTitle>
          <p className="text-xs text-muted-foreground">Across all branches this month</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {mockTopProducts.map((product, i) => (
              <div
                key={product.id}
                className="flex flex-col items-center rounded-xl border bg-card p-3 text-center hover:border-primary/40 transition-colors"
              >
                <div className="relative mb-2">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                <p className="text-[10px] text-muted-foreground">{product.category}</p>
                <Separator className="my-1.5 w-8" />
                <p className="text-xs font-bold text-primary">{product.totalSold.toLocaleString()} sold</p>
                <p className="text-[10px] text-muted-foreground">฿{formatLAK(product.revenue)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
