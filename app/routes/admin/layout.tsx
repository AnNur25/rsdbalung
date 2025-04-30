import { Outlet } from "react-router";
import AdminSidebar from "~/components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:px-14">
        <Outlet />
      </main>
    </div>
  );
}
