import { useEffect, useRef, useState } from "react";
import { UploadCloud, Trash2, Copy, Pencil, Check, X } from "lucide-react";
import { apiGet, apiUpload, apiDelete, apiPatch } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// This page is dedicated to ONE thing: the homepage "Success Stories"
// gallery. Every photo uploaded here is tagged to the "success-stories"
// folder automatically and shows up on the site right away. Blog and
// Testimonial photos are uploaded from their own screens, not here.
const FOLDER = "success-stories";

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default function MediaAdmin() {
  const { show } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [pendingFile, setPendingFile] = useState(null); // { file, previewUrl }
  const [pendingCaption, setPendingCaption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingCaption, setEditingCaption] = useState("");
  const [savingCaption, setSavingCaption] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    try {
      setLoading(true);
      const res = await apiGet(`/api/media?limit=100&folder=${FOLDER}`);
      setFiles(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      show(err.message || "Failed to load the Success Stories gallery.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handlePickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile({ file, previewUrl: URL.createObjectURL(file) });
    setPendingCaption("");
  }

  function cancelPending() {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
    setPendingCaption("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function confirmUpload() {
    if (!pendingFile) return;
    const fd = new FormData();
    fd.append("file", pendingFile.file);
    fd.append("folder", FOLDER);
    fd.append("caption", pendingCaption.trim());
    try {
      setUploading(true);
      await apiUpload("/api/media", fd);
      show("Photo added — now live in the homepage Success Stories gallery.", "success");
      cancelPending();
      fetchFiles();
    } catch (err) {
      show(err.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    try {
      await apiDelete(`/api/media/${confirmTarget}`);
      show("Photo deleted.", "success");
      setConfirmTarget(null);
      fetchFiles();
    } catch (err) {
      show(err.message || "Failed to delete photo.", "error");
    }
  }

  function startEditCaption(file) {
    setEditingId(file._id);
    setEditingCaption(file.caption || "");
  }

  async function saveCaption(id) {
    try {
      setSavingCaption(true);
      await apiPatch(`/api/media/${id}`, { caption: editingCaption.trim() });
      show("Caption saved.", "success");
      setEditingId(null);
      fetchFiles();
    } catch (err) {
      show(err.message || "Failed to save caption.", "error");
    } finally {
      setSavingCaption(false);
    }
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(`${BASE}${url}`);
    show("URL copied to clipboard.", "info");
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} photo{files.length === 1 ? "" : "s"} in the Success Stories gallery
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Only Success Story photos are posted here. Upload a photo, add the caption that should appear below it on the
          website, and it goes live on the homepage instantly.
        </p>
      </div>

      {!pendingFile ? (
        <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors w-fit mb-6">
          <UploadCloud className="w-4 h-4" />
          Add a Success Story Photo
          <input ref={inputRef} type="file" accept="image/*" onChange={handlePickFile} className="hidden" />
        </label>
      ) : (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <img src={pendingFile.previewUrl} alt="Preview" className="w-full sm:w-40 h-40 object-cover rounded-lg shrink-0" />
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Caption (shown below the photo on the website)
              </label>
              <input
                type="text"
                autoFocus
                value={pendingCaption}
                onChange={(e) => setPendingCaption(e.target.value)}
                placeholder="e.g. Warehouse Visa · Greece"
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-auto">
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {uploading ? "Uploading…" : "Publish to Success Stories"}
              </button>
              <button
                onClick={cancelPending}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-sm text-gray-400 py-16">Loading gallery…</p>
      ) : files.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg py-16 text-center text-sm text-gray-400">
          No success story photos yet. Use the button above to add your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((f) => (
            <div
              key={f._id}
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-900">
                <img src={`${BASE}${f.url}`} alt={f.caption || f.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                {editingId === f._id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={editingCaption}
                      onChange={(e) => setEditingCaption(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveCaption(f._id)}
                      className="flex-1 min-w-0 rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-2 py-1 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                      placeholder="Caption for this photo"
                    />
                    <button
                      onClick={() => saveCaption(f._id)}
                      disabled={savingCaption}
                      className="p-1 text-emerald-500 hover:text-emerald-600 shrink-0"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-red-600 shrink-0" title="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditCaption(f)}
                    className="flex items-center gap-1.5 text-left w-full group"
                    title="Click to edit caption"
                  >
                    <span className={`text-xs flex-1 truncate ${f.caption ? "text-gray-700 dark:text-gray-300" : "text-gray-400 italic"}`}>
                      {f.caption || "No caption — click to add one"}
                    </span>
                    <Pencil className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 shrink-0" />
                  </button>
                )}

                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 truncate" title={f.filename}>
                  {f.filename} · {formatBytes(f.size)}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => copyUrl(f.url)} className="p-1 text-gray-400 hover:text-blue-600" title="Copy URL">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmTarget(f._id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this photo?"
        message="This will remove it from the homepage Success Stories gallery permanently."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
