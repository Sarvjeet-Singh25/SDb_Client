import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  danger = true,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-[#151d30] w-full max-w-sm rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              danger ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" : "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{title}</h3>
            {message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-sm font-semibold text-white transition-colors ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
