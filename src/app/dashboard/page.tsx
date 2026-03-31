import AdminOverview from "@/components/dashboard/AdminOverView";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminOverview />
      </div>
    </main>
  );
}