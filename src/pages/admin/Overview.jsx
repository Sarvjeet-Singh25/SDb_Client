import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Mail, Newspaper, Layers, ClipboardList } from "lucide-react";
import { apiGet } from "../../lib/api";
import { useAdmin } from "../../context/AdminContext.jsx";

const cards = [
  { key: "jobs", label: "Job Postings", icon: Briefcase, to: "/admin/jobs", color: "bg-blue-500" },
  { key: "applications", label: "Jobs Applications", icon: ClipboardList, to: "/admin/applications", color: "bg-rose-500" },
  { key: "contacts", label: "Contact Inquiries", icon: Mail, to: "/admin/contacts", color: "bg-emerald-500" },
  { key: "blogs", label: "Blog Articles", icon: Newspaper, to: "/admin/blogs", color: "bg-amber-500" },
  { key: "services", label: "Services", icon: Layers, to: "/admin/services", color: "bg-purple-500" },
];

export default function Overview() {
  const { admin } = useAdmin();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [jobs, applications, contacts, blogs, services] = await Promise.allSettled([
        apiGet("/api/jobs?limit=1"),
        apiGet("/api/applications?limit=1"),
        apiGet("/api/contact?limit=1"),
        apiGet("/api/blogs?limit=1"),
        apiGet("/api/services?all=true"),
      ]);
      setCounts({
        jobs: jobs.status === "fulfilled" ? jobs.value?.pagination?.total ?? 0 : "—",
        applications: applications.status === "fulfilled" ? applications.value?.pagination?.total ?? 0 : "—",
        contacts: contacts.status === "fulfilled" ? contacts.value?.pagination?.total ?? 0 : "—",
        blogs: blogs.status === "fulfilled" ? blogs.value?.pagination?.total ?? 0 : "—",
        services: services.status === "fulfilled" ? services.value?.data?.length ?? 0 : "—",
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${c.color} text-white flex items-center justify-center mb-4`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{loading ? "…" : counts[c.key]}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Welcome back{admin?.name ? `, ${admin.name}` : ""}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Use the sidebar to manage job postings, contact inquiries, blog articles, services, and your media
          library — all wired to MongoDB, nothing here is placeholder data. Additional modules from your spec
          (Users/RBAC beyond admins, Newsletter, Reviews, Countries/Visa, Pages, SEO, Analytics, Notifications,
          Activity Logs, System Status, Backup) still need their own backend models and routes before they can be
          added here for real.
        </p>
      </div>
    </div>
  );
}
