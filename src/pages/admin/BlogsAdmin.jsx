import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, Image as ImageIcon, Eye } from "lucide-react";
import { apiGet, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function resolveImageSrc(image) {
  if (!image) return "";
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

function StatusBadge({ status }) {
  const published = status !== "draft";
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
        published
          ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function BlogsAdmin() {
  const { show } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const res = await apiGet("/api/blogs?all=true&limit=100");
      setBlogs(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      show(err.message || "Failed to load blogs.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/blogs/${confirmTarget}`);
      show("Article deleted.", "success");
      setConfirmTarget(null);
      fetchBlogs();
    } catch (err) {
      show(err.message || "Failed to delete article.", "error");
    }
  }

  const columns = [
    {
      key: "image",
      label: "",
      render: (row) => (
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
          {row.image ? (
            <img src={resolveImageSrc(row.image)} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{row.title}</div>
          <div className="text-xs text-gray-400">/{row.slug}</div>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "publishDate",
      label: "Publish Date",
      render: (row) => (row.publishDate ? new Date(row.publishDate).toLocaleDateString() : "—"),
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "views",
      label: "Views",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Eye className="w-3.5 h-3.5" /> {row.views || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {blogs.length} article{blogs.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/blogs/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={blogs}
        loading={loading}
        emptyMessage="No blog articles yet."
        renderActions={(blog) => (
          <div className="flex items-center justify-end gap-1">
            <Link to={`/admin/blogs/${blog._id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600" title="Edit">
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setConfirmTarget(blog._id)}
              className="p-1.5 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this article?"
        message="This will permanently remove it from the public blog."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
