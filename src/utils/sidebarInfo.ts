import {
  LayoutDashboard,
  FileText,
  FileCheck,
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
  // {
  //   href: "/dashboard/inventory",
  //   label: "Inventario",
  //   icon: FileText,
  //   roles: ["ADMIN", "OPERATOR"],
  // },
  // {
  //   href: "/dashboard/invoices",
  //   label: "Facturas",
  //   icon: FileCheck,
  //   roles: ["ADMIN", "OPERATOR"],
  // }
];