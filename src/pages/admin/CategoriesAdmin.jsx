import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

const emptyForm = { name: "", order: 0, isActive: true };

export default function CategoriesAdmin() {
  const { show } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await apiGet("/api/categories?all=true");
      setCategories(res?.data || []);
    } catch (err) {
      show(err.message || "Failed to load categories.", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, order: cat.order || 0, isActive: cat.isActive });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      show("Category name is required.", "error");
      return;
    }
    try {
      setSaving(true);
      if (editing) {
        await apiPut(`/api/categories/${editing._id}`, form);
        show("Category updated.", "success");
      } else {
        await apiPost("/api/categories", form);
        show("Category created.", "success");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      show(err.message || "Failed to save category.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      const res = await apiDelete(`/api/categories/${confirmTarget}`);
      show(
        res.blogsStillUsingIt
          ? `Category deleted. ${res.blogsStillUsingIt} blog(s) still reference this name.`
          : "Category deleted.",
        "success"
      );
      setConfirmTarget(null);
      fetchCategories();
    } catch (err) {
      show(err.message || "Failed to delete category.", "error");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug", render: (row) => <span className="text-gray-400">/{row.slug}</span> },
    { key: "order", label: "Order" },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          {row.isActive ? "Active" : "Hidden"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Link to="/admin/blogs" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1">Blog Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories yet."
        renderActions={(cat) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-600" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => setConfirmTarget(cat._id)} className="p-1.5 text-gray-400 hover:text-red-600" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <Modal open={modalOpen} title={editing ? "Edit Category" : "New Category"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded"
            />
            Active (visible on the public blog filter)
          </label>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded transition-colors"
            >
              {saving ? "Saving…" : editing ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this category?"
        message="Existing blog posts using this category name will keep it as plain text, but it will no longer appear as an active filter."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
