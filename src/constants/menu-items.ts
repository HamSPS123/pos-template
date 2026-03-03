import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Tags,
  Boxes,
  TrendingUp,
  PieChart,
  UserRound,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  badge?: string | number;
  submenu?: MenuItem[];
  permission?: string | string[];
}

export interface MenuSection {
  section: string;
  icon: LucideIcon;
  items: MenuItem[];
}

export const menuConfig: MenuSection[] = [
  {
    section: "General",
    icon: LayoutDashboard,
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },
  {
    section: "Sales",
    icon: ShoppingCart,
    items: [
      {
        title: "POS",
        href: "/sales/pos",
        icon: ShoppingCart,
        permission: "sales.view",
      },
      {
        title: "Orders",
        href: "/sales/orders",
        icon: CreditCard,
        permission: "sales.view",
      },
    ],
  },
  {
    section: "Inventory",
    icon: Package,
    items: [
      {
        title: "Products",
        href: "/inventory/products",
        icon: Package,
        permission: "inventory.view",
      },
      {
        title: "Categories",
        href: "/inventory/categories",
        icon: Tags,
        permission: "inventory.view",
      },
      {
        title: "Stock",
        href: "/inventory/stock",
        icon: Boxes,
        permission: "inventory.view",
      },
    ],
  },
  {
    section: "Customers",
    icon: UserRound,
    items: [
      {
        title: "Customer List",
        href: "/customers",
        icon: UserRound,
        permission: "customers.view",
      },
    ],
  },
  {
    section: "Reports",
    icon: BarChart3,
    items: [
      {
        title: "Revenue",
        href: "/reports/revenue",
        icon: TrendingUp,
        permission: "dashboard.view",
      },
      {
        title: "Sales Report",
        href: "/reports/sales",
        icon: BarChart3,
        permission: "dashboard.view",
      },
      {
        title: "Inventory Report",
        href: "/reports/inventory",
        icon: PieChart,
        permission: "dashboard.view",
      },
    ],
  },
  {
    section: "Settings",
    icon: Settings,
    items: [
      {
        title: "General",
        href: "/settings/general",
        icon: Settings,
        permission: "settings.view",
      },
      {
        title: "Users & Roles",
        href: "/settings/users",
        icon: Users,
        permission: "users.manage",
      },
      {
        title: "Payment Methods",
        href: "/settings/payment-methods",
        icon: CreditCard,
        permission: "settings.view",
      },
    ],
  },
];
