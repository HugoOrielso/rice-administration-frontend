// app/dashboard/layout.tsx
import SessionInitializer from "@/components/common/SessionInitializer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import LogoutButton from "@/components/common/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SessionInitializer />
      <TooltipProvider>
        {/* Sidebar solo desktop */}
        <DashboardSidebar />

        {/* Contenido principal */}
        <SidebarInset className="flex flex-col min-h-screen w-full">

          {/* Header del main — desktop y mobile */}
          <header className="flex py-3 shrink-0 items-center justify-between border-b bg-white px-4">
            {/* SidebarTrigger aquí es lo que controla el sidebar en desktop */}
            <SidebarTrigger className="cursor-pointer" />

            <div className="flex items-center gap-3">
              <LogoutButton />
            </div>
          </header>

          {/* Página */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}