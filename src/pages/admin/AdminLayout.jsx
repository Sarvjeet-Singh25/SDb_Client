import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar.jsx";
import Topbar from "../../components/admin/Topbar.jsx";
import { AdminProvider, useAdmin } from "../../context/AdminContext.jsx";
import { ToastProvider } from "../../context/ToastContext.jsx";
import SEO from "../../components/SEO.jsx";

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, loading } = useAdmin();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0b1120]">
      <SEO title="Admin Console" description="SDB International admin console." noindex />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={admin?.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {loading ? <div className="text-sm text-gray-400 py-10 text-center">Loading console…</div> : <Outlet />}
        </main>
        <footer className="text-gray-400 dark:text-gray-600 text-xs text-center py-4 border-t border-gray-200 dark:border-gray-800">
          &copy; SDB International. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </AdminProvider>
  );
}
