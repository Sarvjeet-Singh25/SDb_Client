import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ShieldCheck, Home as HomeIcon, Bus, Users } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

const perkIcon = { "Visa Support": ShieldCheck, Accommodation: HomeIcon, Transport: Bus };
const targetCountries = window.jobCountries || ["UAE", "Qatar", "Saudi Arabia", "Germany", "Poland"];
const targetCategories = window.jobCategories || ["Construction", "Hospitality", "Logistics", "Healthcare", "Engineering"];

const emptyForm = { title: "", category: "", country: "", description: "", salary: "", salaryValue: "", perks: [] };

export default function JobsAdmin() {
  const { show } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await apiGet("/api/jobs?limit=100");
      setJobs(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      show(err.message || "Failed to load jobs.", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(job) {
    setEditingId(job._id || job.id);
    setForm({
      title: job.title || "",
      category: job.category || "",
      country: job.country || "",
      description: job.description || "",
      salary: job.salary || "",
      salaryValue: job.salaryValue ?? "",
      perks: Array.isArray(job.perks) ? job.perks : [],
    });
    setModalOpen(true);
  }

  function togglePerk(perk) {
    setForm((f) => ({
      ...f,
      perks: f.perks.includes(perk) ? f.perks.filter((p) => p !== perk) : [...f.perks, perk],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.category || !form.country || !form.salary) {
      show("Please complete all required fields.", "error");
      return;
    }
    const payload = { ...form, salaryValue: parseFloat(form.salaryValue) || 0 };
    try {
      setSaving(true);
      if (editingId) {
        await apiPut(`/api/jobs/${editingId}`, payload);
        show("Job updated.", "success");
      } else {
        await apiPost("/api/jobs", payload);
        show("Job published.", "success");
      }
      setModalOpen(false);
      fetchJobs();
    } catch (err) {
      show(err.message || "Error saving job.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/jobs/${confirmTarget}`);
      show("Job deleted.", "success");
      setConfirmTarget(null);
      fetchJobs();
    } catch (err) {
      show(err.message || "Failed to delete job.", "error");
    }
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "country", label: "Country" },
    { key: "salary", label: "Salary" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{jobs.length} job posting{jobs.length === 1 ? "" : "s"}</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        emptyMessage="No jobs posted yet."
        renderActions={(job) => (
          <div className="flex justify-end gap-2">
            <Link
              to={`/admin/applications?job=${job._id || job.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600"
              title="View applications"
            >
              <Users className="w-4 h-4" />
            </Link>
            <button onClick={() => openEdit(job)} className="p-1.5 text-gray-400 hover:text-blue-600" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmTarget(job._id || job.id)}
              className="p-1.5 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <Modal open={modalOpen} title={editingId ? "Edit Job" : "Create New Job"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select...</option>
                {targetCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Country *</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select...</option>
                {targetCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Display Salary *</label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Position</label>
              <input
                type="number"
                value={form.salaryValue}
                onChange={(e) => setForm({ ...form, salaryValue: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Company Subsidies</label>
            <div className="flex flex-wrap gap-4 pt-1">
              {Object.keys(perkIcon).map((perk) => (
                <label key={perk} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={form.perks.includes(perk)}
                    onChange={() => togglePerk(perk)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>{perk}</span>
                </label>
              ))}
            </div>
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
              {saving ? "Saving…" : editingId ? "Save Changes" : "Publish Job"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this job posting?"
        message="This will permanently remove the listing from the public jobs page."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
