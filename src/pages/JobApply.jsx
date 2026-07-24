import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, UploadCloud, ShieldAlert } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SEO from "../components/SEO.jsx";
import { apiGet } from "../lib/api";

const SKILL_LEVELS = ["Entry Level", "Semi-Skilled", "Skilled", "Supervisor", "Management"];
const EXPERIENCE_LEVELS = ["0-1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentLocation: "",
    preferredCountry: "",
    skillLevel: "",
    experience: "",
    notes: "",
    termsAccepted: false,
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setJobLoading(true);
      setJobError(false);
      try {
        const res = await apiGet(`/api/jobs/${id}`);
        if (!cancelled) {
          setJob(res);
          setForm((f) => ({ ...f, preferredCountry: res.country || "" }));
        }
      } catch {
        if (!cancelled) setJobError(true);
      } finally {
        if (!cancelled) setJobLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    const okType = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
    if (!okType) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      setError("Resume must be under 5MB.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }
    setError("");
    setResumeFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }
    if (!resumeFile) {
      setError("Please attach your CV / resume.");
      return;
    }
    if (!form.termsAccepted) {
      setError("Please accept the Terms & Privacy Policy to continue.");
      return;
    }

    const fd = new FormData();
    fd.append("job", id);
    fd.append("fullName", form.fullName);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("currentLocation", form.currentLocation);
    fd.append("preferredCountry", form.preferredCountry);
    fd.append("skillLevel", form.skillLevel);
    fd.append("experience", form.experience);
    fd.append("notes", form.notes);
    fd.append("termsAccepted", "true");
    fd.append("resume", resumeFile);

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE}/api/applications`, { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (body.errors && body.errors.map((er) => er.message).join(", ")) || body.message || "Failed to submit application."
        );
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (jobLoading) {
    return (
      <PageShell>
        <div className="container-page py-24 text-center text-sm text-muted-foreground">Loading…</div>
      </PageShell>
    );
  }

  if (jobError || !job) {
    return (
      <PageShell>
        <div className="container-page py-24 text-center">
          <h1 className="font-serif text-3xl text-navy mb-3">This role isn't available anymore</h1>
          <Link to="/jobs" className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-xs font-medium text-ivory hover:bg-navy/90">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
          </Link>
        </div>
      </PageShell>
    );
  }

  if (submitted) {
    return (
      <PageShell>
        <SEO title={`Application submitted — ${job.title}`} description="Your job application has been received." path={`/jobs/${id}/apply`} noindex />
        <div className="container-page py-24 max-w-lg mx-auto text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-3xl text-navy mb-3">Application received</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Thank you for applying to <span className="text-navy font-medium">{job.title}</span>. Our mobility desk will
            review your profile and reach out at {form.email} if you're shortlisted.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/jobs" className="rounded-sm bg-navy px-5 py-2.5 text-xs font-medium text-ivory hover:bg-navy/90">
              Browse more jobs
            </Link>
            <Link to="/" className="rounded-sm border border-border px-5 py-2.5 text-xs font-medium text-navy hover:bg-muted">
              Back home
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SEO title={`Apply — ${job.title} | SDB International Group`} description={`Apply for ${job.title} in ${job.country}.`} path={`/jobs/${id}/apply`} noindex />

      <div className="bg-navy">
        <div className="container-page pt-6 pb-8">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/jobs", label: "Jobs" }, { to: `/jobs/${id}`, label: job.title }, { label: "Apply" }]} />
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-white leading-tight">Apply for {job.title}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory/60">{job.country} · {job.category}</p>
        </div>
      </div>

      <section className="container-page py-14 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-card p-6 sm:p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Email *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Phone (with country code) *</label>
              <input
                type="tel"
                placeholder="+971 55 123 4567"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Current City & Country</label>
              <input
                type="text"
                placeholder="Ambala, India"
                value={form.currentLocation}
                onChange={(e) => update("currentLocation", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Skill Level</label>
              <select
                value={form.skillLevel}
                onChange={(e) => update("skillLevel", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
              >
                <option value="">Select</option>
                {SKILL_LEVELS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Preferred Country</label>
              <input
                type="text"
                value={form.preferredCountry}
                onChange={(e) => update("preferredCountry", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Selected Job</label>
              <input
                type="text"
                value={job.title}
                disabled
                className="w-full rounded-sm border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Years of Experience</label>
              <select
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy"
              >
                <option value="">Select</option>
                {EXPERIENCE_LEVELS.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Upload CV / Resume (PDF/DOC) *</label>
            <label className="flex items-center gap-3 rounded-sm border border-dashed border-border bg-background px-3.5 py-3 text-sm cursor-pointer hover:border-navy transition-colors">
              <UploadCloud className="h-4 w-4 text-gold shrink-0" />
              <span className="text-muted-foreground">{resumeFile ? resumeFile.name : "Choose file — no file chosen"}</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" required />
            </label>
            <p className="mt-1.5 text-[11px] text-muted-foreground">Max 5MB. Allowed: PDF, DOC, DOCX.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy mb-1.5">Additional Notes (optional)</label>
            <textarea
              rows={3}
              placeholder="Share anything that helps us match you better…"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-navy resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => update("termsAccepted", e.target.checked)}
              className="rounded border-border text-navy focus:ring-navy h-4 w-4"
            />
            I accept the Terms & Privacy Policy
          </label>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-xs font-medium text-navy hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to job
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-navy px-7 py-3 text-sm font-medium text-ivory hover:bg-navy/90 disabled:opacity-60 transition-all"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
