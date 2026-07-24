import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, Moon, Sun, ChevronDown, LogOut, KeyRound, ShieldCheck } from "lucide-react";
import { useAdmin } from "../../context/AdminContext.jsx";

const titles = {
  "/admin": "Overview",
  "/admin/jobs": "Jobs",
  "/admin/contacts": "Contacts",
  "/admin/blogs": "Blogs",
  "/admin/services": "Services",
  "/admin/media": "Success Stories",
  "/admin/admins": "Admin Users",
  "/admin/profile": "My Profile",
};

export default function Topbar({ onMenuClick }) {
  const { admin, dark, setDark } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const pageTitle = titles[loc.pathname] || "Dashboard";

  function handleLogout() {
    localStorage.removeItem("adminToken");
    nav("/admin/login");
  }

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white shrink-0">
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium truncate">
            Admin / <span className="text-gray-600 dark:text-gray-300">{pageTitle}</span>
          </p>
          <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          title="Toggle dark mode"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {(admin?.name || "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight">{admin?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 capitalize">
                {admin?.role === "superadmin" && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                {admin?.role || "admin"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a2236] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
                <Link
                  to="/admin/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <KeyRound className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
