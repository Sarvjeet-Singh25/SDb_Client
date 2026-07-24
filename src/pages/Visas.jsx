import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import visasHero from "../assets/visas-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import CTASection from "../components/CTASection.jsx";
import FAQ from "../components/FAQ.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SEO from "../components/SEO.jsx";
import { visas, faqs } from "../lib/siteData.js";

export default function Visas() {
  return (
    <PageShell transparentHeader>
      <SEO title="Visa Categories — Work, Golden, Business, Student, Family | SDB International" description="Explore visa categories processed by SDB International Group across 40+ jurisdictions." path="/visas" />
      <Hero image={visasHero} imageAlt="Passport and globe on a walnut desk"
        eyebrow="Visa categories"
        title={<>Every route, <span className="italic text-gold">expertly navigated.</span></>}
        intro="From short-stay tourist visas to 10-year Golden Visas and citizenship-by-investment — a dedicated specialist team for every category we file."
        primaryCta={{ to: "/contact", label: "Assess my eligibility" }} />
      <div className="container-page pt-7"></div>

      <section className="container-page py-24">
        <SectionHeader eyebrow="Visa families" title={<>Eight visa categories. One trusted desk.</>} intro="Whichever route fits your goals, we've filed thousands of similar cases and understand each embassy's expectations in detail." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visas.map((v, i) => (
            <article key={v.title} className="group relative flex flex-col rounded-sm border border-border bg-card p-8 hover:border-gold transition-all hover:-translate-y-1">
              <div className="font-serif text-4xl text-muted-foreground/40 mb-4 group-hover:text-gold transition-colors">{String(i + 1).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.tag}</div>
              <h3 className="mt-3 font-serif text-2xl text-navy">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{v.desc}</p>
              <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-gold">Speak to a specialist <ArrowUpRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>

      <FAQ items={faqs} />
      <CTASection secondary={{ to: "/countries", label: "See countries" }} />
    </PageShell>
  );
}
