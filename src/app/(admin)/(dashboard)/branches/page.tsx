"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Receipt,
  ArrowUpRight,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Clock,
} from "lucide-react"
import {
  mockBranches,
  mockDailySales,
  mockTopProducts,
  mockRecentSales,
  mockBranchExpenses,
  formatLAK,
  formatLAKDecimal,
} from "@/lib/mock-dashboard"

const branch = mockBranches[0]

const statCards = [
  {
    title: "Revenue (This Month)",
    value: `฿${formatLAK(branch.totalRevenue)}`,
    change: "+12.4%",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  {
    title: "Expense (This Month)",
    value: `฿${formatLAK(branch.totalExpense)}`,
    change: "+6.2%",
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Net Profit",
    value: `฿${formatLAK(branch.profit)}`,
    change: "+18.7%",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Today's Sales",
    value: `฿${formatLAK(branch.todaySales)}`,
    change: "+5.3%",
    icon: ShoppingCart,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    title: "Total Orders",
    value: branch.totalOrders.toLocaleString(),
    change: "+8 today",
    icon: Receipt,
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    title: "Employees",
    value: branch.employeeCount.toString(),
    change: "3 on shift",
    icon: Users,
    color: "text-sky-600",
    bg: "bg-sky-500/10",
  },
]

const paymentIcons: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-3.5 w-3.5" />,
  card: <CreditCard className="h-3.5 w-3.5" />,
  transfer: <Building2 className="h-3.5 w-3.5" />,
  ewallet: <Smartphone className="h-3.5 w-3.5" />,
}

export default function BranchDashboardPage() {
  const maxDailyRevenue = Math.max(...mockDailySales.map((d) => d.revenue))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Branch Dashboard</h1>
        <p className="text-muted-foreground">{branch.name}</p>
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
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Daily Sales Chart + Expense breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Sales (This Week)</CardTitle>
            <p className="text-xs text-muted-foreground">Revenue &amp; orders per day</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {mockDailySales.map((d) => {
                const revenueHeight = (d.revenue / maxDailyRevenue) * 100
                const expenseHeight = (d.expense / maxDailyRevenue) * 100
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      {d.orders}
                    </span>
                    <div className="w-full flex flex-col gap-0.5 items-center">
                      <div
                        className="w-full max-w-8 rounded-t-sm bg-primary transition-all"
                        style={{ height: `${revenueHeight}%` }}
                      />
                      <div
                        className="w-full max-w-8 rounded-b-sm bg-red-400/60 transition-all"
                        style={{ height: `${expenseHeight}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{d.date}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 pt-4 border-t mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-400/60" /> Expense</span>
              <span className="ml-auto">Numbers = orders count</span>
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              <div className="divide-y">
                {mockBranchExpenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <p className="text-sm font-medium">{exp.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{exp.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">{exp.date}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-red-500">-฿{formatLAK(exp.amount)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="px-4 py-2 border-t bg-muted/30">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Total Expenses</span>
                <span className="font-bold text-red-500">
                  -฿{formatLAK(mockBranchExpenses.reduce((s, e) => s + e.amount, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales + Top Products */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent Sales
            </CardTitle>
            <p className="text-xs text-muted-foreground">Latest transactions today</p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[380px]">
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
                          {sale.cashier} · {sale.items} items · {time}
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

        {/* Top Selling Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Top Selling Products
            </CardTitle>
            <p className="text-xs text-muted-foreground">Best sellers this month</p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[380px]">
              <div className="divide-y">
                {mockTopProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-sm font-bold text-muted-foreground w-5 text-center shrink-0">
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
                      <p className="text-xs text-muted-foreground">{product.category} · {product.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{product.totalSold.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">฿{formatLAK(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}