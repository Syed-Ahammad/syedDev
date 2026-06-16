import { Sidebar, MobileDashboardNav } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <MobileDashboardNav />
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
