import {
  ClipboardList,
  LayoutDashboard,
  PackagePlus,
  FileText,
  Boxes,
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
    icon: LayoutDashboard, // ✔️ perfecto
    roles: ["ADMIN", "OPERATOR"],
  },
  {
    href: "/dashboard/products",
    label: "Inventario",
    icon: Boxes, // 🔥 mejor que Package (más "stock / almacén")
    roles: ["ADMIN", "OPERATOR"],
    children: [
      {
        href: "/dashboard/products",
        label: "Ver productos",
        icon: ClipboardList, // ✔️ listado
        roles: ["ADMIN", "OPERATOR"],
      },
      {
        href: "/dashboard/products/create",
        label: "Crear producto",
        icon: PackagePlus, // ✔️ crear producto
        roles: ["ADMIN"],
      },
    ],
  },
  {
    href: "/dashboard/invoices",
    label: "Ver facturas",
    icon: FileText, // 🔥 mucho más claro que ClipboardList
    roles: ["ADMIN", "OPERATOR"],
  },
];