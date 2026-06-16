import { Sidebar, MobileAdminNav } from "@/components/admin/Sidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <MobileAdminNav />
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
