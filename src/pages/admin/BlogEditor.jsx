import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, X as XIcon } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../../lib/api";
import { useToast } from "../../context/ToastContext.jsx";
import RichTextEditor from "../../components/admin/RichTextEditor.jsx";
import MediaPickerModal from "../../components/admin/MediaPickerModal.jsx";
import { getContentStats } from "../../lib/textStats";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const LIMITS = { title: 70, metaTitle: 60, metaDescription: 160, description: 250 };

const emptyForm = {
  title: "",
  metaTitle: "",
  metaDescription: "",
  description: "",
  content: "",
  image: "",
  category: "",
  tags: [],
  author: "SDB Admin",
  slug: "",
  status: "published",
  publishDate: new Date().toISOString().slice(0, 10),
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveImageSrc(image) {
  if (!image) return "";
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

function Counter({ value, max }) {
  const over = value > max;
  return (
    <span className={`text-xs ${over ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
      {value} / {max} Characters
    </span>
  );
}

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { show } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet("/api/categories?all=true")
      .then((res) => setCategories(res?.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const blog = await apiGet(`/api/blogs/${id}`);
        setForm({
          title: blog.title || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          description: blog.description || "",
          content: blog.content || "",
          image: blog.image || "",
          category: blog.category || "",
          tags: blog.tags || [],
          author: blog.author || "SDB Admin",
          slug: blog.slug || "",
          status: blog.status || "published",
          publishDate: blog.publishDate ? new Date(blog.publishDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        });
        setSlugTouched(true);
      } catch (err) {
        show(err.message || "Failed to load this article.", "error");
        navigate("/admin/blogs");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const stats = useMemo(() => getContentStats(form.content), [form.content]);

  function updateField(field, val) {
    setForm((f) => {
      const next = { ...f, [field]: val };
      if (field === "title" && !slugTouched) next.slug = slugify(val);
      return next;
    });
  }

  function addTag(e) {
    e.preventDefault();
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  function removeTag(t) {
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  }

  async function handleSubmit(e, statusOverride) {
    e.preventDefault();
    const status = statusOverride || form.status;

    if (!form.title.trim() || !form.image || !form.category || !form.content.trim()) {
      show("Title, featured image, category, and content are required.", "error");
      return;
    }

    const publishDateObj = new Date(form.publishDate);
    const payload = {
      ...form,
      status,
      slug: form.slug || slugify(form.title),
      day: String(publishDateObj.getDate()),
      month: publishDateObj.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      publishDate: publishDateObj.toISOString(),
    };

    try {
      setSaving(true);
      if (isEdit) {
        await apiPut(`/api/blogs/${id}`, payload);
        show("Article updated.", "success");
      } else {
        await apiPost("/api/blogs", payload);
        show(status === "draft" ? "Draft saved." : "Article published.", "success");
      }
      navigate("/admin/blogs");
    } catch (err) {
      show(err.message || "Failed to save the article.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-20 text-sm">Loading article…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/blogs" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {isEdit ? "Edit Blog Article" : "Add New Blog Article"}
        </h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Blog Title *</label>
                <Counter value={form.title.length} max={LIMITS.title} />
              </div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., How To Get A Russian Visa From Dubai In 2026"
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Slug (auto-generated) *
              </label>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="shrink-0">/blogs/</span>
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Short Description *</label>
                <Counter value={form.description.length} max={LIMITS.description} />
              </div>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Shown on the blog listing card and used as a fallback meta description"
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Content *</label>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {stats.charCount} chars · {stats.wordCount} words · {stats.readingTime}
                </span>
              </div>
              <RichTextEditor value={form.content} onChange={(html) => updateField("content", html)} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Search Engine Optimization</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Meta Title</label>
                <Counter value={form.metaTitle.length} max={LIMITS.metaTitle} />
              </div>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                placeholder="Defaults to the blog title if left blank"
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Meta Description</label>
                <Counter value={form.metaDescription.length} max={LIMITS.metaDescription} />
              </div>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                placeholder="Defaults to the short description if left blank"
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Tags / SEO Keywords
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full">
                    {t}
                    <button type="button" onClick={() => removeTag(t)}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag(e)}
                  placeholder="Type a tag/keyword and press Enter"
                  className="flex-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                />
                <button type="button" onClick={addTag} className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR COLUMN */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Publish Date</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => updateField("publishDate", e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-[#0b1120] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <Link to="/admin/categories" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                Manage categories
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Featured Image *</label>
            {form.image ? (
              <img src={resolveImageSrc(form.image)} alt="" className="w-full aspect-video object-cover rounded border border-gray-200 dark:border-gray-700" />
            ) : (
              <div className="w-full aspect-video rounded border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-300">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <ImageIcon className="w-4 h-4" /> {form.image ? "Change Image" : "Choose from Media Library"}
            </button>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded transition-colors"
            >
              {saving ? "Saving…" : isEdit ? "Update Article" : form.status === "draft" ? "Save Draft" : "Publish Article"}
            </button>
            {!isEdit && form.status === "published" && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={saving}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Save as Draft instead
              </button>
            )}
          </div>
        </div>
      </form>

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
