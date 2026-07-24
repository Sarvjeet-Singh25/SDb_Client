import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import countriesHero from "../assets/countries-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import CTASection from "../components/CTASection.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SEO from "../components/SEO.jsx";
import { countries } from "../lib/siteData.js";

const regions = ["Middle East", "Europe", "North America", "Oceania", "Asia-Pacific"];

export default function Countries() {
  return (
    <PageShell transparentHeader>
      <SEO title="Countries We Serve — 40+ Destinations | SDB International Group" description="SDB International Group serves 40+ destinations including UAE, Canada, UK, USA, Australia, Germany, Schengen and New Zealand." path="/countries" />
      <Hero image={countriesHero} imageAlt="Illuminated world map showing SDB's destinations"
        eyebrow="Global presence"
        title={<>40+ destinations. <span className="italic text-gold">One dedicated partner.</span></>}
        intro="Wherever you're moving, we have specialists on the ground and inside embassy networks."
        primaryCta={{ to: "/contact", label: "Ask about a country" }} />
      <div className="container-page pt-1"><Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Countries" }]} /></div>

      <section className="container-page py-24">
        <SectionHeader eyebrow="Featured destinations" title={<>Eight of the world's most requested routes.</>} intro="These are the destinations we file most frequently — but our specialist network extends across 40+ jurisdictions worldwide." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {countries.map(c => (
            <Link key={c.name} to="/contact" className="group relative overflow-hidden rounded-sm border border-border bg-card p-8 hover:border-gold transition-all hover:-translate-y-1">
              <MapPin className="h-5 w-5 text-gold" />
              <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{c.region}</div>
              <h3 className="mt-2 font-serif text-2xl text-navy">{c.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.tag}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-gold">Discuss options <ArrowUpRight className="h-4 w-4" /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-navy text-ivory py-24">
        <div className="container-page">
          <SectionHeader eyebrow="Regions served" title={<span className="text-ivory">Five regions. Local expertise. Global standards.</span>} />
          <div className="mt-16 grid gap-px bg-ivory/10 rounded-sm overflow-hidden md:grid-cols-5">
            {regions.map(r => <div key={r} className="bg-navy p-8"><h3 className="font-serif text-xl text-ivory">{r}</h3><div className="mt-4 h-px w-10 bg-gold" /></div>)}
          </div>
        </div>
      </section>

      <section className="container-page py-10"></section>

      <CTASection secondary={{ to: "/visas", label: "Visa categories" }} />
    </PageShell>
  );
}
