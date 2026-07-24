import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X, ArrowUpRight, Briefcase } from "lucide-react";
import servicesHero from "../assets/services-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CTASection from "../components/CTASection.jsx";
import SEO from "../components/SEO.jsx";
import JobCard from "../components/JobCard.jsx";
import { apiGet } from "../lib/api";

function CheckboxRow({ label, checked, onChange, count }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <span className="flex items-center gap-3">
        <span className={`flex h-4 w-4 items-center justify-center rounded-[3px] border transition-colors ${checked ? "border-gold bg-gold" : "border-border group-hover:border-navy"}`}>
          {checked && <span className="h-1.5 w-1.5 bg-navy rounded-[1px]" />}
        </span>
        <span className="text-sm text-foreground/80 group-hover:text-navy">{label}</span>
      </span>
      {typeof count === "number" && <span className="text-[11px] text-muted-foreground">{count}</span>}
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  );
}

export default function Jobs() {
  const navigate = useNavigate();
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Use native state for stable loading, synced manually with the browser URL window
  const [query, setQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("Newest");

  const targetCountries = window.jobCountries || [];
  const targetCategories = window.jobCategories || [];

  // Parse parameters from the URL safely on initialization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search")) setQuery(params.get("search"));
    if (params.get("sort")) setSort(params.get("sort"));
    // A direct ?jobId=... link (e.g. from an old bookmark) now sends the
    // visitor straight to that job's own page instead of opening a modal.
    if (params.get("jobId")) {
      navigate(`/jobs/${params.get("jobId")}`, { replace: true });
    }
    if (params.get("countries")) setSelectedCountries(params.get("countries").split(","));
    if (params.get("categories")) setSelectedCategories(params.get("categories").split(","));
  }, []);

  // API Fetch Hook — limit=100 is the backend's max page size; this page
  // filters/sorts client-side rather than paginating through the API.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet("/api/jobs?limit=100");
        if (!cancelled) {
          setJobsData(Array.isArray(res?.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        if (!cancelled) setJobsData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Pure state push tracker to dynamically adjust browser URL window context safely
  const updateUrlParams = (newQuery, newCountries, newCategories, newSort) => {
    const currentParams = new URLSearchParams();
    
    if (newQuery.trim()) currentParams.set("search", newQuery);
    if (newCountries.length > 0) currentParams.set("countries", newCountries.join(","));
    if (newCategories.length > 0) currentParams.set("categories", newCategories.join(","));
    if (newSort !== "Newest") currentParams.set("sort", newSort);

    const newUrl = `${window.location.pathname}${currentParams.toString() ? "?" + currentParams.toString() : ""}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  };

  const toggleCountry = (country) => {
    const next = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];
    setSelectedCountries(next);
    updateUrlParams(query, next, selectedCategories, sort);
  };

  const toggleCategory = (category) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(next);
    updateUrlParams(query, selectedCountries, next, sort);
  };

  const handleSearchChange = (val) => {
    setQuery(val);
    updateUrlParams(val, selectedCountries, selectedCategories, sort);
  };

  const handleSortChange = (val) => {
    setSort(val);
    updateUrlParams(query, selectedCountries, selectedCategories, val);
  };

  // "View Details" now opens the job's own dedicated page instead of an
  // in-page overlay — real URL, shareable, back-button friendly.
  const handleViewJobDetails = (id) => {
    navigate(`/jobs/${id}`);
  };

  const clearAll = () => {
    setQuery("");
    setSelectedCountries([]);
    setSelectedCategories([]);
    setSort("Newest");
    window.history.replaceState({}, "", window.location.pathname);
  };

  const filtered = useMemo(() => {
    let list = jobsData.filter((j) => {
      const matchQ = query.trim() === "" || j.title?.toLowerCase().includes(query.toLowerCase()) || j.description?.toLowerCase().includes(query.toLowerCase());
      const matchC = selectedCountries.length === 0 || selectedCountries.includes(j.country);
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(j.category);
      return matchQ && matchC && matchCat;
    });
    if (sort === "Salary") {
      list = [...list].sort((a, b) => (b.salaryValue || 0) - (a.salaryValue || 0));
    } else if (sort === "Title") {
      list = [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return list;
  }, [jobsData, query, selectedCountries, selectedCategories, sort]);


  // Dynamic injection of JSON-LD Schema Structure for Search Engine Bots
  useEffect(() => {
    if (!filtered.length) return;

    const existingScript = document.getElementById("jsonld-jobs-schema");
    if (existingScript) existingScript.remove();

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": filtered.slice(0, 10).map((job) => ({
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": job.createdAt || new Date().toISOString(),
        "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), 
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "SDB International Group",
          "sameAs": window.location.origin
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": job.country
          }
        },
        "baseSalary": job.salaryValue ? {
          "@type": "PriceSpecification",
          "currency": "USD",
          "value": job.salaryValue,
          "unitText": "MONTH"
        } : undefined
      }))
    };

    const script = document.createElement("script");
    script.id = "jsonld-jobs-schema";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const cleanUpScript = document.getElementById("jsonld-jobs-schema");
      if (cleanUpScript) cleanUpScript.remove();
    };
  }, [filtered]);

  const countryCounts = useMemo(() => {
    const uniques = targetCountries.length ? targetCountries : [...new Set(jobsData.map(j => j.country).filter(Boolean))];
    return uniques.map((c) => ({ name: c, count: jobsData.filter((j) => j.country === c).length }));
  }, [jobsData, targetCountries]);

  const categoryCounts = useMemo(() => {
    const uniques = targetCategories.length ? targetCategories : [...new Set(jobsData.map(j => j.category).filter(Boolean))];
    return uniques.map((c) => ({ name: c, count: jobsData.filter((j) => j.category === c).length }));
  }, [jobsData, targetCategories]);

  const FiltersPanel = (
    <aside className="rounded-sm border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold tracking-wider text-navy uppercase">Filters</h2>
        <button onClick={clearAll} className="text-[11px] uppercase tracking-[0.2em] text-gold hover:underline">Reset</button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search roles…"
          className="w-full rounded-sm border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-navy"
        />
      </div>

      {countryCounts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-navy font-medium mb-3">Country</h2>
          <div className="divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
            {countryCounts.map((c) => (
              <CheckboxRow
                key={c.name}
                label={c.name}
                count={c.count}
                checked={selectedCountries.includes(c.name)}
                onChange={() => toggleCountry(c.name)}
              />
            ))}
          </div>
        </div>
      )}

      {categoryCounts.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-navy font-medium mb-3">Category</h2>
          <div className="divide-y divide-border/60">
            {categoryCounts.map((c) => (
              <CheckboxRow
                key={c.name}
                label={c.name}
                count={c.count}
                checked={selectedCategories.includes(c.name)}
                onChange={() => toggleCategory(c.name)}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <PageShell transparentHeader>
      <SEO
        title="Overseas Jobs & Vacancies — SDB International Group"
        description="Browse verified overseas job vacancies with visa support, accommodation and transport across the UAE, Europe, and beyond."
        path="/jobs"
      />
      <Hero
        image={servicesHero}
        imageAlt="Skilled professionals working on-site abroad"
        eyebrow="Careers abroad"
        title={<h1 className="text-white"> Verified overseas roles, <span className="italic text-gold">placed with care.</span></h1>}
        intro="Live vacancies from vetted employers across the UAE, GCC and Europe — each posting includes visa sponsorship, accommodation and transport support handled end-to-end by our mobility desk."
        primaryCta={{ to: "/contact", label: "Register your profile" }}
      />

      <div className="container-page pt-1">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Jobs" }]} />
      </div>

      <section className="container-page py-16">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <SectionHeader
            eyebrow={`${jobsData.length} live openings`}
            title={<h2>Latest jobs <span className="text-gold">({filtered.length})</span></h2>}
            intro="Every vacancy is pre-screened, sponsored and supported by our destination teams."
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-sm text-navy"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
            <label className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              Sort by
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy"
              >
                <option>Newest</option>
                <option>Salary</option>
                <option>Title</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">{FiltersPanel}</div>

          <div className="h-[70vh] min-h-[420px] sm:h-[750px] overflow-y-auto pr-3">
            {loading ? (
              <div className="rounded-sm border border-border bg-card p-16 text-center text-muted-foreground">
                Loading live vacancies…
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-sm border border-border bg-card p-16 text-center">
                <div className="font-serif text-2xl text-navy">No matching roles</div>
                <p className="mt-3 text-sm text-muted-foreground">Try widening your filters or clearing the search.</p>
                <button onClick={clearAll} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-sm font-medium text-ivory">Clear filters</button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((job, i) => (
                  <JobCard key={job._id || job.id || i} job={job} index={i} onViewDetails={handleViewJobDetails} />
                ))}
              </div>
            )}

            <div className="mt-14 flex items-center justify-between rounded-sm border border-border bg-muted/30 p-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gold" />
                <div>
                  <div className="font-serif text-lg text-navy">Can't find your role?</div>
                  <div className="text-xs text-muted-foreground">Register your profile and we'll match new openings weekly.</div>
                </div>
              </div>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-sm font-medium text-ivory hover:bg-navy/90">
                Register profile <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="font-serif text-xl text-navy">Filters</div>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-navy">
                <X className="h-5 w-5" />
              </button>
            </div>
            {FiltersPanel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-sm bg-navy py-3 text-sm font-medium text-ivory"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}

      <CTASection secondary={{ to: "/services", label: "See services" }} />
    </PageShell>
  );
}