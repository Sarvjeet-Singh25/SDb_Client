import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { apiPut } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

export default function ProfileSettings() {
  const { admin } = useAdmin();
  const { show } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      show("New password must be at least 8 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      show("New password and confirmation do not match.", "error");
      return;
    }
    try {
      setSaving(true);
      await apiPut("/api/admin/me/password", { currentPassword, newPassword });
      show("Password updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      show(err.message || "Failed to update password.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {(admin?.name || "A").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{admin?.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 capitalize">
              {admin?.role === "superadmin" && <ShieldCheck className="w-3 h-3" />}
              {admin?.role}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
          <KeyRound className="w-4 h-4" /> Change Password
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">New Password (min 8 characters)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded transition-colors"
            >
              {saving ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
