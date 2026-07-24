import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, ExternalLink } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import { getIcon, ICON_OPTIONS } from "../../lib/icons.js";
import { slugify } from "../../lib/slugify.js";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import RichTextEditor from "../../components/admin/RichTextEditor.jsx";
import MediaPickerModal from "../../components/admin/MediaPickerModal.jsx";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function resolveImageSrc(image) {
  if (!image) return "";
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

const emptyForm = { title: "", slug: "", description: "", content: "", image: "", icon: "Briefcase", order: 0, isActive: true };

export default function ServicesAdmin() {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await apiGet("/api/services?all=true");
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
    } catch (err) {
      show(err.message || "Failed to load services.", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setSlugTouched(false);
    setForm({ ...emptyForm, order: items.length + 1 });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id || item.id);
    setSlugTouched(true);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      description: item.description || "",
      content: item.content || "",
      image: item.image || "",
      icon: item.icon || "Briefcase",
      order: item.order ?? 0,
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  }

  function updateField(field, val) {
    setForm((f) => {
      const next = { ...f, [field]: val };
      if (field === "title" && !slugTouched) next.slug = slugify(val);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.description) {
      show("Title and description are required.", "error");
      return;
    }
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      content: form.content,
      image: form.image,
      icon: form.icon,
      order: Number(form.order) || 0,
      isActive: form.isActive,
    };
    try {
      setSaving(true);
      if (editingId) {
        await apiPut(`/api/services/${editingId}`, payload);
        show("Service updated.", "success");
      } else {
        await apiPost("/api/services", payload);
        show("Service added.", "success");
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      show(err.message || "Error saving service.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/services/${confirmTarget}`);
      show("Service deleted.", "success");
      setConfirmTarget(null);
      fetchItems();
    } catch (err) {
      show(err.message || "Failed to delete service.", "error");
    }
  }

  const columns = [
    {
      key: "order",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-gray-400">
          <GripVertical className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{row.order ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "icon",
      label: "",
      render: (row) => {
        const Icon = getIcon(row.icon);
        return (
          <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>
        );
      },
    },
    { key: "title", label: "Title" },
    {
      key: "description",
      label: "Description",
      render: (row) => <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-md block">{row.description}</span>,
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
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} service{items.length === 1 ? "" : "s"}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            These are the service cards shown on the homepage and the Services page. Order controls the display sequence.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No services yet."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <Link
              to={`/services/${row.slug || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-blue-600"
              title="View live page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
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

      <Modal open={modalOpen} title={editingId ? "Edit Service" : "New Service"} onClose={() => setModalOpen(false)} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map((name) => {
                const Icon = getIcon(name);
                const selected = form.icon === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setForm({ ...form, icon: name })}
                    title={name}
                    className={`aspect-square rounded-lg flex items-center justify-center border transition-colors ${
                      selected ? "bg-navy border-navy text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Slug (page URL) *
            </label>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="shrink-0">/services/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField("slug", slugify(e.target.value));
                }}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Card Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Shown on the service card and as the intro on the service's own page.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Hero Image (service page)</label>
            {form.image ? (
              <img src={resolveImageSrc(form.image)} alt="" className="w-full aspect-[21/9] object-cover rounded border border-gray-200 dark:border-gray-700 mb-2" />
            ) : (
              <div className="w-full aspect-[21/9] rounded border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-300 mb-2">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <ImageIcon className="w-4 h-4" /> {form.image ? "Change Image" : "Choose from Media Library"}
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Optional — falls back to the default services banner if left blank.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
              Full Page Content
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => updateField("content", html)}
              placeholder="Write the full detail-page content here — process, requirements, timelines, pricing…"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Shown on the service's own page below the hero. Leave blank to just show the card description.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 mt-6">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              Visible on public site
            </label>
          </div>

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
              {saving ? "Saving…" : editingId ? "Save Changes" : "Add Service"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this service?"
        message="This will remove it from the homepage and Services page."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(file) => {
          updateField("image", file.url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
