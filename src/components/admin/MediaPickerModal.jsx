import { useEffect, useState } from "react";
import { UploadCloud, Check } from "lucide-react";
import Modal from "./Modal.jsx";
import { apiGet, apiUpload } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// onSelect receives the full media file object: { _id, filename, url, ... }
export default function MediaPickerModal({ open, onClose, onSelect }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function load() {
    try {
      setLoading(true);
      const res = await apiGet("/api/media?limit=60&excludeFolder=success-stories");
      setFiles(res?.data || []);
    } catch (err) {
      show(err.message || "Failed to load media library.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "general");
    try {
      setUploading(true);
      await apiUpload("/api/media", fd);
      show("Image uploaded.", "success");
      load();
    } catch (err) {
      show(err.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Modal open={open} title="Select an Image" onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg py-6 mb-5 cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 transition-colors text-center px-4">
          <UploadCloud className="w-5 h-5 shrink-0" />
          <span>{uploading ? "Uploading…" : "Click to upload a new image (JPG, PNG, WEBP, GIF, SVG — max 5MB)"}</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>

        {loading ? (
          <p className="text-center text-sm text-gray-400 py-8">Loading library…</p>
        ) : files.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No images uploaded yet — use the box above to add one.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
            {files.map((f) => (
              <button
                key={f._id}
                type="button"
                onClick={() => onSelect(f)}
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-blue-500"
                title={f.filename}
              >
                <img src={`${BASE}${f.url}`} alt={f.filename} className="w-full h-full object-cover" />
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Check className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
