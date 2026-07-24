import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, MapPin, User, MessageSquare, Tag } from "lucide-react";
import heroImage from "../assets/hero-dubai.jpg";
import mapImage from "../assets/countries-hero.jpg";
import aboutImage from "../assets/about-hero.jpg";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function resolveImageSrc(image) {
  if (!image) return aboutImage;
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import StatGrid from "../components/StatGrid.jsx";
import FAQ from "../components/FAQ.jsx";
import CTASection from "../components/CTASection.jsx";
import TestimonialGrid, { useSuccessStories } from "../components/Testimonial.jsx";
import ConsultantSpotlight from "../components/ConsultantSpotlight.jsx";
import SEO from "../components/SEO.jsx";
import { services as fallbackServices, visas, countries, stats, process, faqs } from "../lib/siteData.js";
import { getIcon } from "../lib/icons.js";
import { slugify } from "../lib/slugify.js";
import { apiGet } from "../lib/api";

// Helper function to extract YouTube Embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState(fallbackServices);
  const { photos: successPhotos } = useSuccessStories();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiGet("/api/services");
        const list = Array.isArray(res?.data) ? res.data : [];
        if (list.length > 0) setServices(list);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await apiGet("/api/blogs");

        const blogList = Array.isArray(response)
          ? response
          : response?.blogs || response?.data || [];

        if (Array.isArray(blogList)) {
          setBlogs(blogList.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load homepage blogs:", err);
      }
    };
    fetchLatestBlogs();
  }, []);

  return (
    <PageShell transparentHeader>
      <SEO
        title="SDB International Group — Global Immigration & Visa Consulting | Dubai"
        description="Dubai-headquartered global immigration & visa consulting group. 20+ years, 12,000+ approvals, 40+ countries. Golden Visa, PR, work, business, student and family visas."
        path="/"
        jsonLd={{ "@context": "https://schema.org", "@type": "Organization", name: "SDB International Group", url: "/", address: { "@type": "PostalAddress", streetAddress: "Business Bay", addressLocality: "Dubai", addressCountry: "AE" } }}
      />
      <Hero
        image={heroImage}
        imageAlt="Dubai skyline at golden hour with Burj Khalifa"
        eyebrow="SDB International Group"
        title={<>Global mobility,<br /><span className="italic text-gold">crafted with precision.</span></>}
        intro="Two decades of guiding individuals, families and enterprises across borders — from Dubai to 40+ destinations, with a 99% approval record and consultants who treat every case as their own."
        primaryCta={{ to: "/contact", label: "Book a consultation" }}
        secondaryCta={{ to: "/services", label: "Explore services" }}
        priority
      />

      <section className="border-b border-border bg-ivory">
        <div className="container-page py-8 flex flex-wrap items-center justify-between gap-6">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Trusted across the Middle East, Europe, Americas & APAC</p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-navy/60 font-serif text-lg">
            <span>ICCRC</span><span>·</span><span>OISC</span><span>·</span><span>MARA</span><span>·</span><span>MOFAIC</span><span>·</span><span>UAE ICP</span>
          </div>
        </div>
      </section>

      <section className="container-page py-24 md:py-30">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow mb-5">Who we are</div>
            <h2 className="text-navy">A private-office approach to global immigration.</h2>
            <div className="mt-6 h-px w-16 bg-gold" />
            <div className="mt-8 space-y-5 text-lg text-muted-foreground leading-relaxed">
              <p>SDB International Group is a specialist immigration and visa consultancy headquartered in Dubai. For over twenty years we have guided professionals, investors, students and families through the complexities of moving, working and settling abroad.</p>
              <p>What sets us apart is not scale — it is discipline. Every file is stewarded by a senior consultant, every strategy is bespoke, and every route is chosen because it fits <em className="not-italic text-navy">you</em>, not because it is convenient for us.</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {[{ k: "Consultants", v: "Senior only" }, { k: "Case model", v: "One family, one lead" }, { k: "Fee model", v: "Fixed & transparent" }, { k: "Communication", v: "Direct WhatsApp line" }].map(f => (
                <div key={f.k} className="border-l-2 border-gold pl-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{f.k}</div>
                  <div className="mt-1 font-serif text-lg text-navy">{f.v}</div>
                </div>
              ))}
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-navy font-medium border-b border-gold pb-1">Read our story <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/4] overflow-hidden rounded-sm">
              <img src={aboutImage} alt="Modern SDB International boardroom" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden md:block bg-navy text-ivory p-8 rounded-sm max-w-xs">
              <div className="font-serif text-4xl text-gold">20+</div>
              <div className="mt-2 text-sm text-ivory/80">Years guiding cross-border talent, capital and families.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-19">
        <div className="container-page"><StatGrid stats={stats} dark /></div>
      </section>

      <section className="container-page py-24 md:py-30">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <SectionHeader eyebrow="Our services" title={<>What we do, exceptionally.</>} intro="From individual visa applications to enterprise mobility programmes — a full-service immigration desk under one roof." />
          <Link to="/services" className="hidden md:inline-flex items-center gap-2 text-navy font-medium">All services <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 8).map((s, i) => (
            <ServiceCard
              key={s._id || s.title}
              icon={getIcon(s.icon)}
              title={s.title}
              description={s.description}
              href={`/services/${s.slug || slugify(s.title)}`}
              index={i + 1}
            />
          ))}
        </div>
      </section>

      <section className="bg-ivory border-y border-border py-24 md:py-30">
        <div className="container-page">
          <SectionHeader eyebrow="Visa categories" title={<>The routes we open, every day.</>} intro="Eight visa families spanning skilled migration, investor mobility, family reunification, and study — each with a dedicated specialist team." />
          <div className="mt-16 grid gap-px bg-border rounded-sm overflow-hidden md:grid-cols-2 lg:grid-cols-4">
            {visas.map(v => (
              <Link key={v.title} to="/visas" className="group bg-card p-8 hover:bg-navy hover:text-ivory transition-colors">
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.tag}</div>
                <h3 className="mt-4 font-serif text-2xl text-navy group-hover:text-ivory transition-colors">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground group-hover:text-ivory/70 leading-relaxed">{v.desc}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-navy group-hover:text-gold transition-colors">Learn more <ArrowUpRight className="h-3.5 w-3.5" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24 md:py-30">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeader eyebrow="Global presence" title={<>40+ destinations, one dedicated partner.</>} intro="Wherever you're heading — a European skilled route, a Canadian PR pathway, a UAE Golden Visa, or a US investor programme — we have specialists on the ground." />
            <div className="mt-10 max-w-3xl grid grid-cols-2 gap-x-8 gap-y-4 overflow-auto max-h-[400px]">
              {countries.map(c => (
                <Link key={c.name} to="/countries" className="group flex items-start gap-3 py-2 border-b border-border">
                  <MapPin className="h-4 w-4 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-navy group-hover:text-gold transition-colors">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.tag}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img src={mapImage} alt="Global map illustrating SDB's international destinations" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

        <section className="bg-navy text-ivory py-24 md:py-30">
          <div className="container-page">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold mb-5">How we work</div>
            <h2 className="text-ivory">A disciplined five-step process, tailored to you.</h2>
            <div className="mt-6 h-px w-16 bg-gold" />
          </div>
          <div className="mt-16 grid gap-px bg-ivory/10 rounded-sm overflow-hidden md:grid-cols-5">
            {process.map(p => (
              <div key={p.step} className="bg-navy p-8">
                <div className="font-serif text-4xl text-gold">{p.step}</div>
                <h3 className="mt-6 font-serif text-xl text-ivory">{p.title}</h3>
                <p className="mt-3 text-sm text-ivory/70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultantSpotlight />

      {successPhotos.length > 0 && (
        <section className="container-page py-24 md:py-30">
          <SectionHeader eyebrow="Success stories" title={<>Real approvals. Real families. Real journeys.</>} intro="A glimpse of the visas, work permits and placements our team has secured for clients across Europe, the Gulf and beyond." />
          <div className="mt-16"><TestimonialGrid photos={successPhotos} /></div>
        </section>
      )}

      {/* INSTAGRAM & NEWS/BLOG SECTION */}
      <section className="bg-ivory border-t border-border py-24 md:py-30">
        <div className="container-page">
          <SectionHeader eyebrow="News & Blog" title={<>Read our latest news & blog.</>} />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">Loading latest articles...</div>
            ) : (
              blogs.map((post) => {
                const embedUrl = getYouTubeEmbedUrl(post.youtubeUrl);

                return (
                  <article key={post._id || post.id} className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_60px_-20px_hsl(var(--navy)/0.25)] flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy/5">
                      {/* RENDER YOUTUBE IFRAME OR FALLBACK IMAGE */}
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={post.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0 z-10 relative"
                        />
                      ) : (
                        <img src={resolveImageSrc(post.image)} alt={post.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      )}

                      {/* DATE BADGE */}
                      <div className="absolute top-0 left-0 bg-navy text-ivory px-3.5 py-2 text-center shadow-md z-20 pointer-events-none rounded-br-lg">
                        <span className="block font-serif font-semibold text-xl leading-none text-gold">{post.day || "15"}</span>
                        <span className="block text-[10px] uppercase tracking-wider font-medium mt-0.5">{post.month || "FEB"}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        

                        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold font-semibold mb-2">
                          <Tag className="h-3 w-3" />{post.category || "Immigration"}
                        </div>

                        <h3 className="text-navy font-serif text-lg leading-snug group-hover:text-gold transition-colors line-clamp-2">
                          <Link to={post.slug ? `/blogs/${post.slug}` : "#"}>{post.title}</Link>
                        </h3>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/60">
                        <Link to={post.slug ? `/blogs/${post.slug}` : "#"} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy group-hover:text-gold transition-colors">
                          Read Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

        </div>
      </section>

      {/* FAQ & CTA SECTION */}
      <FAQ items={faqs} />
      <CTASection secondary={{ to: "/services", label: "See our services" }} />
    </PageShell>
  );
}