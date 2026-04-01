"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { links, SidebarLink, UserRole } from "@/utils/sidebarInfo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import LogoutButton from "./common/LogoutButton";
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar, Sidebar } from "./ui/sidebar";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { state } = useSidebar();

  const VALID_ROLES: UserRole[] = ["ADMIN", "OPERATOR"];
  const rawRole = session?.user?.role;

  const userRole: UserRole | undefined = VALID_ROLES.includes(rawRole as UserRole)
    ? (rawRole as UserRole)
    : undefined;

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const filteredLinks = links
    .filter((link) => userRole && link.roles.includes(userRole))
    .map((link) => ({
      ...link,
      children: link.children?.filter((child) => userRole && child.roles.includes(userRole)),
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

    // EXPANDED + HIJOS
    if (hasChildren && state === "expanded") {
      return (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            onClick={() => toggleMenu(href)}
            className={cn(
              "w-full border-none shadow-none hover:bg-(--sidebar-hover) focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer",
              (isActive || isChildActive) &&
              "text-main hover:bg-gray-50 hover:text-main"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
          </SidebarMenuButton>

          {isOpen && (
            <SidebarMenu className="ml-4 mt-1 border-l border-gray-200 dark:border-white/10 pl-2">
              {visibleChildren.map(({ href: childHref, label: childLabel, icon: ChildIcon }) => (
                <SidebarMenuItem key={childHref}>
                  <SidebarMenuButton
                    className={cn(
                      "border-none shadow-none hover:bg-(--sidebar-hover) focus-visible:ring-0 focus-visible:ring-offset-0",
                      pathname === childHref &&
                      "text-main hover:bg-gray-50 hover:text-main"
                    )}
                  >
                    <Link
                      href={childHref}
                      className="flex items-center gap-3 py-2 text-sm w-full font-medium transition"
                    >
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

    // COLLAPSED + HIJOS
    if (hasChildren && state === "collapsed") {
      return (
        <SidebarMenuItem key={href} className="p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild >
              <SidebarMenuButton
                tooltip={label}
                className={cn(
                  "w-full border-none shadow-none hover:bg-(--sidebar-hover) focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer justify-center",
                  (isActive || isChildActive) &&
                  "text-main hover:bg-gray-50 hover:text-main"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              align="start"
              className="w-64 rounded-xl p-2"
            >
              <div className="px-2 py-2 text-sm font-semibold">{label}</div>

              <div className="mt-1 flex flex-col gap-1">
                {visibleChildren.map((sub) => {
                  const SubIcon = sub.icon;
                  const subActive = pathname === sub.href;

                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-(--sidebar-hover)",
                        subActive && "text-main hover:bg-gray-50 hover:text-main"
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

    // LINK NORMAL
    return (
      <SidebarMenuItem key={href}>
        <SidebarMenuButton
          tooltip={state === "collapsed" ? label : undefined}
          className={cn(
            "border-none shadow-none hover:bg-(--sidebar-hover) focus-visible:ring-0 focus-visible:ring-offset-0",
            isActive &&
            "bg-(--sidebar-active) text-(--color-brand-orange-dark) font-semibold"
          )}
        >
          <Link href={href} className="flex items-center gap-3 py-3 text-sm w-full font-medium transition">
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className=" border-b border-(--color-brand-orange-light)">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2 text-(--color-brand-orange) font-semibold text-lg">
            Administración
          </div>

          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:ml-0 cursor-pointer border-none shadow-none bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>{filteredLinks.map(renderLink)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-white/10">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}