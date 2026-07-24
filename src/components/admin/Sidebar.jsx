import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, ClipboardList, Mail, Newspaper, Layers, Images, UserCog, Tag, X } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/applications", label: "Jobs Applications", icon: ClipboardList },
  { to: "/admin/contacts", label: "Contacts", icon: Mail },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { to: "/admin/categories", label: "Blog Categories", icon: Tag },
  { to: "/admin/services", label: "Services", icon: Layers },
  { to: "/admin/media", label: "Success Stories ", icon: Images },
];

function linkClasses({ isActive }) {
  return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
  }`;
}

export default function Sidebar({ open, onClose, role }) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-[#1a2236] flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <span className="font-semibold text-white text-sm tracking-wide uppercase">SDB Console</span>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose} className={linkClasses}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {role === "superadmin" && (
            <NavLink to="/admin/admins" onClick={onClose} className={linkClasses}>
              <UserCog className="w-4 h-4 shrink-0" />
              Admin Users
            </NavLink>
          )}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-[11px] text-gray-500 shrink-0">
          &copy; Sdb International
        </div>
      </aside>
    </>
  );
}
