import { useEffect, useState } from "react";
import { Plus, Trash2, ShieldCheck, ShieldOff, Lock } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

const emptyForm = { name: "", email: "", password: "", role: "admin" };

export default function AdminUsersAdmin() {
  const { show } = useToast();
  const { admin } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  // Backend already enforces superadmin-only on every /api/admin/users route
  // (requireRole middleware) — this client-side check just avoids showing a
  // page that would immediately 403 for a regular admin.
  const isSuperadmin = admin?.role === "superadmin";

  useEffect(() => {
    if (isSuperadmin) fetchAdmins();
    else setLoading(false);
  }, [isSuperadmin]);

  async function fetchAdmins() {
    try {
      setLoading(true);
      const res = await apiGet("/api/admin/users");
      setAdmins(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      show(err.message || "Failed to load admin users.", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 8) {
      show("Name, email, and an 8+ character password are required.", "error");
      return;
    }
    try {
      setSaving(true);
      await apiPost("/api/admin/users", form);
      show("Admin account created.", "success");
      setModalOpen(false);
      fetchAdmins();
    } catch (err) {
      show(err.message || "Error creating admin.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRole(item) {
    const nextRole = item.role === "superadmin" ? "admin" : "superadmin";
    try {
      await apiPut(`/api/admin/users/${item._id}`, { role: nextRole });
      show(`Role updated to ${nextRole}.`, "success");
      fetchAdmins();
    } catch (err) {
      show(err.message || "Failed to update role.", "error");
    }
  }

  async function toggleActive(item) {
    try {
      await apiPut(`/api/admin/users/${item._id}`, { isActive: !item.isActive });
      show(item.isActive ? "Account deactivated." : "Account reactivated.", "success");
      fetchAdmins();
    } catch (err) {
      show(err.message || "Failed to update account.", "error");
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/admin/users/${confirmTarget}`);
      show("Admin account removed.", "success");
      setConfirmTarget(null);
      fetchAdmins();
    } catch (err) {
      show(err.message || "Failed to remove admin.", "error");
    }
  }

  if (!isSuperadmin) {
    return (
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
        <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Superadmin access required</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Only superadmins can manage other admin accounts.</p>
      </div>
    );
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
            row.role === "superadmin"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            row.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {row.isActive ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      key: "lastLoginAt",
      label: "Last Login",
      render: (row) => (row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : "Never"),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{admins.length} admin account{admins.length === 1 ? "" : "s"}</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Admin
        </button>
      </div>

      <DataTable
        columns={columns}
        data={admins}
        loading={loading}
        emptyMessage="No admin accounts found."
        renderActions={(row) => {
          const isSelf = row._id === admin?.id;
          return (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => toggleRole(row)}
                disabled={isSelf}
                className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                title={row.role === "superadmin" ? "Demote to admin" : "Promote to superadmin"}
              >
                {row.role === "superadmin" ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </button>
              <button
                onClick={() => toggleActive(row)}
                disabled={isSelf}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {row.isActive ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => setConfirmTarget(row._id)}
                disabled={isSelf}
                className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        }}
      />

      <Modal open={modalOpen} title="Create New Admin Account" onClose={() => setModalOpen(false)}>
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
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Password (min 8 characters) *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
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
              {saving ? "Creating…" : "Create Admin"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Remove this admin account?"
        message="They will immediately lose access to the console."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
