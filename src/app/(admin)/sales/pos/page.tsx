"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  mockCategories,
  mockProducts,
  searchProducts,
  getProductByBarcode,
  type Product,
  type ProductUnit,
  type Member,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  Tag,
  PauseCircle,
  FileText,
  MoreVertical,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Delete,
  CheckCircle2,
  Printer,
  FileDown,
  X,
  ScanBarcode,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────

interface CartItem {
  id: string
  product: Product
  unit: ProductUnit
  quantity: number
  unit_price: number
  subtotal: number
}

interface Transaction {
  id: string
  label: string
  cart: CartItem[]
  member: Member | null
}

type PaymentMethod = "cash" | "card" | "transfer" | "ewallet"

// ── Constants ──────────────────────────────────────────────────

const TAX_RATE = 0.07
const MAX_TABS = 3

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { key: "cash", label: "Cash", icon: <Banknote className="h-5 w-5" /> },
  { key: "card", label: "Card", icon: <CreditCard className="h-5 w-5" /> },
  { key: "transfer", label: "Transfer", icon: <Building2 className="h-5 w-5" /> },
  { key: "ewallet", label: "E-Wallet", icon: <Smartphone className="h-5 w-5" /> },
]

// ── Helpers ────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

let tabCounter = 1

function makeTransaction(): Transaction {
  return { id: `tab-${Date.now()}`, label: `#${tabCounter++}`, cart: [], member: null }
}

// ── Checkout Dialog ────────────────────────────────────────────

function CheckoutDialog({
  open,
  onClose,
  total,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  total: number
  onSuccess: (method: PaymentMethod, tendered: number) => void
}) {
  const [method, setMethod] = useState<PaymentMethod>("cash")
  const [numpad, setNumpad] = useState("")

  const tendered = numpad === "" ? 0 : parseFloat(numpad)
  const change = tendered - total

  const handleNumpad = (val: string) => {
    if (val === "DEL") { setNumpad((p) => p.slice(0, -1)); return }
    if (val === "CLR") { setNumpad(""); return }
    if (val === "EXACT") { setNumpad(total.toFixed(2)); return }
    if (val === "." && numpad.includes(".")) return
    if (numpad.length >= 10) return
    setNumpad((p) => p + val)
  }

  const handleQuick = (amount: number) => setNumpad(amount.toString())

  const canConfirm = method !== "cash" || tendered >= total

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle className="text-lg">Checkout</DialogTitle>
        </DialogHeader>

        {/* Payment method tabs */}
        <div className="flex border-b">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.key}
              onClick={() => setMethod(pm.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2",
                method === pm.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {pm.icon}
              {pm.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Amount display */}
          <div className="bg-muted rounded-lg px-4 py-3 text-right">
            <p className="text-xs text-muted-foreground mb-1">
              {method === "cash" ? "Amount Tendered" : "Total Due"}
            </p>
            <p className="text-3xl font-bold tabular-nums">
              {method === "cash" ? (numpad || "0") : formatCurrency(total)}
            </p>
          </div>

          {method === "cash" && (
            <>
              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2">
                {[1000, 500, 100].map((a) => (
                  <Button key={a} variant="outline" size="sm" onClick={() => handleQuick(a)}>
                    {a}
                  </Button>
                ))}
                <Button variant="outline" size="sm" onClick={() => handleNumpad("EXACT")}>
                  Exact
                </Button>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-4 gap-2">
                {["7","8","9","4","5","6","1","2","3",".",  "0"].map((k) => (
                  <Button key={k} variant="outline" className="h-11 text-base" onClick={() => handleNumpad(k)}>
                    {k}
                  </Button>
                ))}
                <Button variant="outline" className="h-11" onClick={() => handleNumpad("DEL")}>
                  <Delete className="h-4 w-4" />
                </Button>
              </div>

              {/* Change */}
              {tendered > 0 && (
                <div className="flex justify-between items-center bg-green-50 dark:bg-green-950/30 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Change</span>
                  <span className={cn("text-lg font-bold", change >= 0 ? "text-green-600" : "text-destructive")}>
                    ฿{formatCurrency(Math.max(0, change))}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            disabled={!canConfirm}
            onClick={() => onSuccess(method, method === "cash" ? tendered : total)}
          >
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Success Dialog ─────────────────────────────────────────────

function SuccessDialog({
  open,
  onClose,
  total,
  tendered,
  method,
}: {
  open: boolean
  onClose: () => void
  total: number
  tendered: number
  method: PaymentMethod
}) {
  const change = tendered - total

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center gap-0 p-0 overflow-hidden">
        <div className="px-8 pt-8 pb-6 space-y-3">
          <div className="flex justify-center">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
          </div>
          <h2 className="text-xl font-bold">Payment Successful</h2>
          {method === "cash" && change >= 0 && (
            <>
              <p className="text-muted-foreground text-sm">Change</p>
              <p className="text-4xl font-bold text-green-600">฿{formatCurrency(change)}</p>
            </>
          )}
          <div className="text-sm text-muted-foreground">
            Total paid: ฿{formatCurrency(total)}
          </div>
        </div>

        <Separator />

        <div className="p-5 space-y-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Receipt (80mm)
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Printer className="h-4 w-4" />
            Print A4
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <FileDown className="h-4 w-4" />
            Save as PDF
          </Button>
          <Button className="w-full mt-2" onClick={onClose}>
            New Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main POS Page ──────────────────────────────────────────────

export default function PosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([makeTransaction()])
  const [activeTabId, setActiveTabId] = useState(transactions[0].id)
  const [search, setSearch] = useState("")
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [lastPayment, setLastPayment] = useState<{ method: PaymentMethod; tendered: number } | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const activeTab = transactions.find((t) => t.id === activeTabId)!

  const filteredProducts = search.length > 0
    ? searchProducts(search)
    : activeCategoryId
      ? mockProducts.filter((p) => p.category_id === activeCategoryId)
      : mockProducts

  // ── Cart helpers ─────────────────────────────────────────────

  const updateTab = useCallback((updater: (t: Transaction) => Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === activeTabId ? updater(t) : t)))
  }, [activeTabId])

  const addToCart = useCallback((product: Product) => {
    const unit = product.units[0]
    updateTab((t) => {
      const existing = t.cart.find((i) => i.unit.id === unit.id)
      if (existing) {
        return {
          ...t,
          cart: t.cart.map((i) =>
            i.unit.id === unit.id
              ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unit_price }
              : i
          ),
        }
      }
      const newItem: CartItem = {
        id: `${product.id}-${unit.id}-${Date.now()}`,
        product,
        unit,
        quantity: 1,
        unit_price: unit.selling_price,
        subtotal: unit.selling_price,
      }
      return { ...t, cart: [...t.cart, newItem] }
    })
  }, [updateTab])

  const updateQty = (itemId: string, delta: number) => {
    updateTab((t) => ({
      ...t,
      cart: t.cart
        .map((i) => i.id === itemId
          ? { ...i, quantity: i.quantity + delta, subtotal: (i.quantity + delta) * i.unit_price }
          : i
        )
        .filter((i) => i.quantity > 0),
    }))
  }

  const removeItem = (itemId: string) => {
    updateTab((t) => ({ ...t, cart: t.cart.filter((i) => i.id !== itemId) }))
  }

  const clearCart = () => updateTab((t) => ({ ...t, cart: [], member: null }))

  // ── Barcode scan (Enter key on search) ────────────────────────

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      const product = getProductByBarcode(search.trim())
      if (product) { addToCart(product); setSearch("") }
    }
  }

  // ── Tabs ──────────────────────────────────────────────────────

  const addTab = () => {
    if (transactions.length >= MAX_TABS) return
    const t = makeTransaction()
    setTransactions((prev) => [...prev, t])
    setActiveTabId(t.id)
  }

  const closeTab = (id: string) => {
    if (transactions.length === 1) { clearCart(); return }
    const next = transactions.find((t) => t.id !== id)!
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    setActiveTabId(next.id)
  }

  // ── Totals ────────────────────────────────────────────────────

  const subtotal = activeTab.cart.reduce((s, i) => s + i.subtotal, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  // ── Checkout ──────────────────────────────────────────────────

  const handleCheckoutSuccess = (method: PaymentMethod, tendered: number) => {
    setLastPayment({ method, tendered })
    setCheckoutOpen(false)
    setSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    clearCart()
  }

  // Auto-focus search
  useEffect(() => { searchRef.current?.focus() }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-96px)] bg-background overflow-hidden">

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 px-3 pt-2 border-b bg-muted/40">
        {transactions.map((t) => (
          <div
            key={t.id}
            onClick={() => setActiveTabId(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-sm font-medium cursor-pointer border border-b-0 transition-colors",
              t.id === activeTabId
                ? "bg-background text-foreground border-border"
                : "bg-muted/60 text-muted-foreground hover:bg-muted border-transparent"
            )}
          >
            <ScanBarcode className="h-3.5 w-3.5" />
            <span>Sale {t.label}</span>
            {t.cart.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px]">{t.cart.length}</Badge>
            )}
            {transactions.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(t.id) }}
                className="ml-1 rounded hover:bg-destructive/20 hover:text-destructive p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {transactions.length < MAX_TABS && (
          <Button variant="ghost" size="sm" className="h-8 px-2 rounded-t-md rounded-b-none" onClick={addTab}>
            <Plus className="h-4 w-4" />
            <span className="ml-1 text-xs">New</span>
          </Button>
        )}
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Products ── */}
        <div className="flex flex-col flex-1 min-w-0 border-r">

          {/* Search bar */}
          <div className="flex items-center gap-2 p-3 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <ScanBarcode className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search name / SKU / barcode (Enter to scan)"
                className="pl-9 pr-9"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b bg-muted/20">
            <Button
              variant={activeCategoryId === null ? "default" : "outline"}
              size="sm"
              className="shrink-0 h-7 text-xs"
              onClick={() => setActiveCategoryId(null)}
            >
              All Items
            </Button>
            {mockCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategoryId === cat.id ? "default" : "outline"}
                size="sm"
                className="shrink-0 h-7 text-xs"
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Product grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group flex flex-col rounded-xl border bg-card hover:border-primary hover:shadow-sm transition-all text-left overflow-hidden"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2 leading-snug">{product.name}</p>
                    <p className="text-sm font-bold text-primary mt-1">
                      ฿{formatCurrency(product.units[0].selling_price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{product.sku}</p>
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Search className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No products found</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Bottom action bar */}
          <div className="border-t bg-muted/30">
            <div className="flex items-center">
              <button
                onClick={clearCart}
                className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-destructive hover:bg-destructive/10 transition-colors text-xs font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <Separator orientation="vertical" className="h-10" />
              <button className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs font-medium">
                <User className="h-4 w-4" />
                Customer
              </button>
              <Separator orientation="vertical" className="h-10" />
              <button className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs font-medium">
                <Tag className="h-4 w-4" />
                Discount
              </button>
              <Separator orientation="vertical" className="h-10" />
              <button className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs font-medium">
                <PauseCircle className="h-4 w-4" />
                Hold
              </button>
              <Separator orientation="vertical" className="h-10" />
              <button className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs font-medium">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </button>
              <Separator orientation="vertical" className="h-10" />
              <button className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs font-medium">
                <FileText className="h-4 w-4" />
                Summary
              </button>
              <Separator orientation="vertical" className="h-10" />
              <button className="flex flex-col items-center gap-0.5 px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs font-medium">
                <MoreVertical className="h-4 w-4" />
                More
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Cart / Order panel ── */}
        <div className="flex flex-col w-80 xl:w-96 shrink-0 bg-card">

          {/* Cart header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Current Order</span>
            </div>
            <Badge variant="secondary" className="text-xs">{activeTab.cart.length} items</Badge>
          </div>

          {/* Cart items */}
          <ScrollArea className="flex-1">
            {activeTab.cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs mt-1 opacity-70">Tap a product to add</p>
              </div>
            ) : (
              <div className="divide-y">
                {activeTab.cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-3 py-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">฿{formatCurrency(item.unit_price)} each</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="h-5 w-5 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="h-5 w-5 rounded-full border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold">฿{formatCurrency(item.subtotal)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Totals */}
          <div className="border-t px-4 py-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>฿{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (7%)</span>
              <span>฿{formatCurrency(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">฿{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment method quick select */}
          <div className="px-3 pb-2 grid grid-cols-4 gap-1.5">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.key}
                className="flex flex-col items-center gap-0.5 rounded-lg border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {pm.icon}
                {pm.label}
              </button>
            ))}
          </div>

          {/* Checkout button */}
          <div className="px-3 pb-4">
            <Button
              className="w-full h-11 text-base font-semibold gap-2"
              disabled={activeTab.cart.length === 0}
              onClick={() => setCheckoutOpen(true)}
            >
              <CreditCard className="h-5 w-5" />
              Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={total}
        onSuccess={handleCheckoutSuccess}
      />
      {lastPayment && (
        <SuccessDialog
          open={successOpen}
          onClose={handleSuccessClose}
          total={total}
          tendered={lastPayment.tendered}
          method={lastPayment.method}
        />
      )}
    </div>
  )
}