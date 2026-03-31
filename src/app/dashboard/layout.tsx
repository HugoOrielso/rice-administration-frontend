import DashboardSidebar from "@/components/DashboardSidebar";
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
        <div className="min-h-screen  flex w-full">
          <TooltipProvider>
            <DashboardSidebar />
          </TooltipProvider>
          <SidebarInset>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}