import { Outlet } from "react-router";
import AdminSidebar from "~/components/AdminSidebar";

export default function AdminLayout() {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen w-screen">
        <AdminSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
}