// DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { links, SidebarLink, UserRole } from "@/utils/sidebarInfo";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { useSessionStore } from "@/store/sessionStore";

export default function DashboardSidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { state } = useSidebar();

  const user = useSessionStore((s) => s.user);
  const isLoading = useSessionStore((s) => s.isLoading);

  const VALID_ROLES: UserRole[] = ["ADMIN", "OPERATOR"];
  const userRole = user?.role && VALID_ROLES.includes(user.role)
    ? user.role
    : undefined;

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const filteredLinks = links
    .filter((link) => userRole && link.roles.includes(userRole))
    .map((link) => ({
      ...link,
      children: link.children?.filter(
        (child) => userRole && child.roles.includes(userRole)
      ),
    }));

  const renderLink = (link: SidebarLink) => {
    const { href, label, icon: Icon, children = [] } = link;

    const visibleChildren = children.filter(
      (child) => userRole && child.roles.includes(userRole)
    );

    const hasChildren = visibleChildren.length > 0;
    const isOpen = openMenus[href] ?? false;
    const isActive = pathname === href;
    const isChildActive = visibleChildren.some((child) => pathname === child.href);

    if (hasChildren && state === "expanded") {
      return (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            onClick={() => toggleMenu(href)}
            className={cn(
              "w-full border-none shadow-none hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer",
              (isActive || isChildActive) && "bg-green-100 hover:bg-green-100 font-semibold"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
          </SidebarMenuButton>

          {isOpen && (
            <SidebarMenu className="ml-4 mt-1 border-l border-gray-200 pl-2">
              {visibleChildren.map(({ href: childHref, label: childLabel, icon: ChildIcon }) => (
                <SidebarMenuItem key={childHref}>
                  <SidebarMenuButton
                    className={cn(
                      "border-none shadow-none hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0",
                      pathname === childHref && "bg-green-100 hover:bg-green-100 font-semibold"
                    )}
                  >
                    <Link href={childHref} className="flex items-center gap-3 py-2 text-sm w-full font-medium">
                      <ChildIcon className="w-4 h-4 shrink-0" />
                      <span>{childLabel}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarMenuItem>
      );
    }

    if (hasChildren && state === "collapsed") {
      return (
        <SidebarMenuItem key={href} className="p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={label}
                className={cn(
                  "w-full border-none shadow-none hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer justify-center",
                  (isActive || isChildActive) && "bg-green-100 hover:bg-green-100 font-semibold"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-64 rounded-xl p-2">
              <div className="px-2 py-2 text-sm font-semibold">{label}</div>
              <div className="mt-1 flex flex-col gap-1">
                {visibleChildren.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white",
                        pathname === sub.href && "bg-green-100 hover:bg-green-100 font-semibold"
                      )}
                    >
                      <SubIcon className="w-4 h-4 shrink-0" />
                      <span>{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={href}>
        <SidebarMenuButton
          tooltip={state === "collapsed" ? label : undefined}
          className={cn(
            "border-none shadow-none hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0",
            isActive && "bg-green-100 hover:bg-green-100 font-semibold"
          )}
        >
          <Link href={href} className="flex items-center gap-3 py-3 text-sm w-full font-medium">
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header del sidebar con logo */}
      <SidebarHeader className="px-4 py-3 group-data-[collapsible=icon]:hidden">
        <div className=" text-(--color-brand-green) font-semibold text-lg">
          Administración
        </div>
        {/* Logo colapsado — puedes poner un ícono aquí */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center">
          {/* <YourLogoIcon /> */}
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          {isLoading ? null : (
            <SidebarMenu>{filteredLinks.map(renderLink)}</SidebarMenu>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}