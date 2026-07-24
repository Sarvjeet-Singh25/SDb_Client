import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import servicesHero from "../assets/services-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CTASection from "../components/CTASection.jsx";
import FAQ from "../components/FAQ.jsx";
import SEO from "../components/SEO.jsx";
import { getIcon } from "../lib/icons.js";
import { faqs } from "../lib/siteData.js";
import { apiGet } from "../lib/api";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.sdbinternational.com").replace(/\/+$/, "");

function resolveImageSrc(image) {
  if (!image) return servicesHero;
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    apiGet(`/api/services/slug/${slug}`)
      .then((res) => {
        if (cancelled) return;
        setService(res?.data || null);
        setRelated(res?.related || []);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (notFound) navigate("/not-found", { replace: true });
  }, [notFound, navigate]);

  if (loading) {
    return (
      <PageShell>
        <div className="container-page py-32 text-center text-muted-foreground font-serif text-xl">
          Loading service...
        </div>
      </PageShell>
    );
  }

  if (!service) return null;

  const Icon = getIcon(service.icon);
  const heroImage = resolveImageSrc(service.image);
  const pageUrl = `${SITE_URL}/services/${service.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "Organization", name: "SDB International Group", url: SITE_URL },
    url: pageUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
    ],
  };

  return (
    <PageShell transparentHeader>
      <SEO
        title={`${service.metaTitle || service.title} | SDB International Group`}
        description={service.metaDescription || service.description}
        path={`/services/${service.slug}`}
        image={heroImage}
        jsonLd={[serviceSchema, breadcrumbSchema]}
      />

      {/* HERO */}
      <section className="relative isolate overflow-hidden min-h-[70vh] flex items-end">
        <img src={heroImage} alt={service.title} className="absolute inset-0 h-full w-full object-cover" loading="eager" fetchpriority="high" decoding="async" />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--navy) / 0.35) 0%, hsl(var(--navy) / 0.9) 100%)" }} />
        <div className="container-page relative z-10 pb-20 pt-40">
          <Breadcrumbs items={[{ to: "/", label: "" }, { to: "/services", label: "" }, { label: service.title }]} />
          <div className="mt-6 max-w-3xl animate-rise">
            <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-gold text-navy mb-6">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="text-ivory">{service.title}</h1>
            {service.description && (
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-ivory/85 leading-relaxed font-light">{service.description}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-gold group">
                Request a consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/services" className="btn-outline-ivory">
                <ArrowLeft className="h-4 w-4" /> All services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="container-page py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12">
          {/* LEFT — content */}
          <article>
            {service.content ? (
              /* Sanitized on the server before save; safe to render as HTML */
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: service.content }} />
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
            )}

            {Array.isArray(service.highlights) && service.highlights.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {service.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-sm border border-border bg-card p-4">
                    <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-navy/80 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* RIGHT — sidebar */}
          <aside className="sticky top-24 space-y-8 self-start">
            <div className="bg-navy text-ivory rounded-sm p-6">
              <h4 className="font-serif text-xl mb-2">Talk to a consultant</h4>
              <p className="text-sm text-ivory/75 leading-relaxed mb-5">
                Get a free eligibility review for {service.title.toLowerCase()} from a senior case lead.
              </p>
              <Link to="/contact" className="btn-gold w-full justify-center group">
                <PhoneCall className="h-4 w-4" /> Book a consultation
              </Link>
            </div>

            {related.length > 0 && (
              <div className="bg-card border border-border rounded-sm p-5">
                <h4 className="font-serif text-lg text-navy mb-4">Related services</h4>
                <ul className="space-y-4">
                  {related.map((r) => {
                    const RIcon = getIcon(r.icon);
                    return (
                      <li key={r._id}>
                        <Link to={`/services/${r.slug}`} className="flex items-start gap-3 group">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-navy text-ivory group-hover:bg-gold group-hover:text-navy transition-colors">
                            <RIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-navy leading-snug group-hover:text-gold transition-colors">{r.title}</p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <FAQ items={faqs.slice(0, 4)} title="Common questions" eyebrow="Answers" />
      <CTASection secondary={{ to: "/services", label: "Explore other services" }} />
    </PageShell>
  );
}
