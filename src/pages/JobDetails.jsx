import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  Home as HomeIcon,
  Bus,
  FileText,
  DollarSign,
  Briefcase,
  Clock,
} from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CTASection from "../components/CTASection.jsx";
import SEO from "../components/SEO.jsx";
import { apiGet } from "../lib/api";

const perkIcon = { "Visa Support": ShieldCheck, Accommodation: HomeIcon, Transport: Bus };

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="border-b border-border/60 py-4 last:border-b-0">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-medium text-navy">{value}</div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await apiGet(`/api/jobs/${id}`);
        if (!cancelled) setJob(res);
      } catch (err) {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="container-page py-24 text-center text-sm text-muted-foreground">Loading role…</div>
      </PageShell>
    );
  }

  if (notFound || !job) {
    return (
      <PageShell>
        <div className="container-page py-24 text-center">
          <h1 className="font-serif text-3xl text-navy mb-3">This role isn't available anymore</h1>
          <p className="text-sm text-muted-foreground mb-6">It may have been filled or removed by our team.</p>
          <Link to="/jobs" className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-xs font-medium text-ivory hover:bg-navy/90">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
          </Link>
        </div>
      </PageShell>
    );
  }

  const perks = Array.isArray(job.perks) ? job.perks : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const postedDate = job.date || new Date(job.createdAt || Date.now()).toLocaleDateString();
  const jobId = job._id || job.id;

  return (
    <PageShell>
      <SEO
        title={`${job.title} — ${job.country} | SDB International Group`}
        description={(job.description || "").slice(0, 155)}
        path={`/jobs/${jobId}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: job.title,
          description: job.description,
          datePosted: job.createdAt || new Date().toISOString(),
          employmentType: (job.employmentType || "FULL_TIME").toUpperCase().replace(/[^A-Z_]/g, "_"),
          hiringOrganization: { "@type": "Organization", name: "SDB Group" },
          jobLocation: { "@type": "Place", address: job.country },
        }}
      />

      {/* Header band */}
      <div className="bg-navy">
        <div className="container-page pt-6 pb-8">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/jobs", label: "Jobs" }, { label: job.title }]} />

          <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">{job.category}</span>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">{job.title}</h1>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-ivory/60">SDB Group</div>
              <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-ivory/70">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" /> {job.country}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gold" /> Posted {postedDate}</span>
                {job.employmentType && (
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold" /> {job.employmentType}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(`/jobs/${jobId}/apply`)}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-xs font-semibold text-navy hover:bg-gold/90 transition-all whitespace-nowrap"
            >
              Apply Now <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <section className="container-page py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-navy flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gold" /> Overview
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {requirements.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-navy mb-3">Requirements & Skills</h2>
                <ul className="space-y-2">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {perks.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-navy mb-3">Benefits & Support Included</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {perks.map((p) => {
                    const Icon = perkIcon[p] || ShieldCheck;
                    return (
                      <div key={p} className="flex items-center gap-3 rounded-sm border border-border bg-muted/30 p-3 text-sm text-navy">
                        <Icon className="h-4 w-4 text-gold shrink-0" />
                        <span>{p} (Company Provided)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-sm border border-border bg-muted/30 p-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gold" />
                <div>
                  <div className="font-serif text-lg text-navy">Ready to apply?</div>
                  <div className="text-xs text-muted-foreground">It only takes a couple of minutes.</div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/jobs/${jobId}/apply`)}
                className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-sm font-medium text-ivory hover:bg-navy/90"
              >
                Apply Now <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rounded-sm border border-border bg-card p-6 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3 pb-5 border-b border-border/60">
              <div className="rounded-full bg-gold/10 p-2.5 text-gold">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif text-2xl text-navy font-semibold">{job.salary}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">per month</div>
              </div>
            </div>

            <InfoRow label="Type" value={job.employmentType} />
            <InfoRow label="Category" value={job.category} />
            <InfoRow label="Location" value={job.country} />
            <InfoRow label="Posted" value={postedDate} />

            <button
              onClick={() => navigate(`/jobs/${jobId}/apply`)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-5 py-3 text-xs font-medium text-ivory hover:bg-navy/90 transition-all"
            >
              Apply Now <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <Link
              to="/jobs"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 text-xs font-medium text-navy hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
            </Link>
          </aside>
        </div>
      </section>

      <CTASection secondary={{ to: "/services", label: "See services" }} />
    </PageShell>
  );
}
