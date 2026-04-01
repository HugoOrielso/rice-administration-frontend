import {
  ClipboardList,
  LayoutDashboard,
  Package,
  PackagePlus,
} from "lucide-react";

export type UserRole = "ADMIN" | "OPERATOR";

export type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  children?: Omit<SidebarLink, "children">[];
};

export const links: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "OPERATOR"],
  },
  {
    href: "/dashboard/products",
    label: "Inventario",
    icon: Package,
    roles: ["ADMIN", "OPERATOR"],
    children: [
      {
        href: "/dashboard/products",
        label: "Ver productos",
        icon: ClipboardList,
        roles: ["ADMIN", "OPERATOR"],
      },
      {
        href: "/dashboard/products/create",
        label: "Crear producto",
        icon: PackagePlus,
        roles: ["ADMIN"],
      }
    ]
  },
];