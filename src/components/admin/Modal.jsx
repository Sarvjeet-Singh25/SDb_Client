import { X } from "lucide-react";

export default function Modal({
  open,
  title,
  onClose,
  children,
  maxWidth = "max-w-lg",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-xl border border-gray-700 bg-white dark:bg-[#151d30] shadow-2xl flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1a2236] px-6 py-4 border-b border-gray-700">
          <h3
            className="text-lg font-semibold text-white"
            style={{ color: "#ffffff" }}
          >
            {title}
          </h3>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}