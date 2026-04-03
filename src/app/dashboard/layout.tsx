import LogoutButton from "@/components/common/LogoutButton";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full flex-col lg:flex-row">
          <TooltipProvider>
            {/* Sidebar */}
            <div className="w-full lg:w-auto">
              <DashboardSidebar />
            </div>
          </TooltipProvider>

          {/* Contenido */}
          <SidebarInset className="flex-1">
            <div className="hidden p-3 items-center justify-end lg:flex">
                <LogoutButton/>
            </div>
            <Separator/>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}