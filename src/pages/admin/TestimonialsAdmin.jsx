import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, User } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import MediaPickerModal from "../../components/admin/MediaPickerModal.jsx";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const emptyForm = { name: "", role: "", message: "", rating: 5, imageFileId: null, imageUrl: "", isActive: true };

export default function TestimonialsAdmin() {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await apiGet("/api/testimonials?all=true&limit=100");
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      show(err.message || "Failed to load testimonials.", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id || item.id);
    setForm({
      name: item.name || "",
      role: item.role || "",
      message: item.message || "",
      rating: item.rating || 5,
      imageFileId: item.imageFileId || null,
      imageUrl: item.imageFileId ? `/api/media/file/${item.imageFileId}` : "",
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.message) {
      show("Name and message are required.", "error");
      return;
    }
    const payload = {
      name: form.name,
      role: form.role,
      message: form.message,
      rating: form.rating,
      imageFileId: form.imageFileId,
      isActive: form.isActive,
    };
    try {
      setSaving(true);
      if (editingId) {
        await apiPut(`/api/testimonials/${editingId}`, payload);
        show("Testimonial updated.", "success");
      } else {
        await apiPost("/api/testimonials", payload);
        show("Testimonial added.", "success");
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      show(err.message || "Error saving testimonial.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/testimonials/${confirmTarget}`);
      show("Testimonial deleted.", "success");
      setConfirmTarget(null);
      fetchItems();
    } catch (err) {
      show(err.message || "Failed to delete testimonial.", "error");
    }
  }

  const columns = [
    {
      key: "photo",
      label: "",
      render: (row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center">
          {row.imageFileId ? (
            <img src={`${BASE}/api/media/file/${row.imageFileId}`} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-gray-300" />
          )}
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "role", label: "Role", render: (row) => row.role || "—" },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < row.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
          ))}
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            row.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {row.isActive ? "Live" : "Hidden"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} testimonial{items.length === 1 ? "" : "s"}</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Testimonial
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No testimonials yet."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-blue-600" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmTarget(row._id || row.id)}
              className="p-1.5 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <Modal open={modalOpen} title={editingId ? "Edit Testimonial" : "New Testimonial"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Photo (optional)</label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                {form.imageUrl ? (
                  <img src={`${BASE}${form.imageUrl}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                {form.imageUrl ? "Change Photo" : "Choose from Media Library"}
              </button>
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageFileId: null, imageUrl: "" })}
                  className="text-xs text-gray-400 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Role / Placement</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g., Nurse, placed in Dubai"
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setForm({ ...form, rating: i + 1 })}>
                  <Star className={`w-6 h-6 ${i < form.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            Visible on public site
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
              {saving ? "Saving…" : editingId ? "Save Changes" : "Add Testimonial"}
            </button>
          </div>
        </form>
      </Modal>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(file) => {
          setForm((f) => ({ ...f, imageFileId: file._id, imageUrl: file.url }));
          setPickerOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this testimonial?"
        message="This will permanently remove it."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
