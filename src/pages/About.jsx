import aboutImage from "../assets/about-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import StatGrid from "../components/StatGrid.jsx";
import CTASection from "../components/CTASection.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SEO from "../components/SEO.jsx";
import { stats, process } from "../lib/siteData.js";
import { Target, Compass, Heart, Award } from "lucide-react";

const values = [
  { icon: Target, title: "Precision", desc: "Every application, meticulously prepared to embassy standards." },
  { icon: Compass, title: "Integrity", desc: "Transparent fees, honest eligibility assessments, and route recommendations built around you." },
  { icon: Heart, title: "Empathy", desc: "Immigration is deeply personal. Our consultants treat every family as their own." },
  { icon: Award, title: "Expertise", desc: "Senior-only advisors accredited across ICCRC, OISC, MARA and MOFAIC." },
];

export default function About() {
  return (
    <PageShell transparentHeader>
      <SEO title="About SDB International Group — Two Decades of Global Immigration Expertise" description="Dubai-headquartered global immigration & visa consulting firm serving 40+ countries with 20+ years of legacy and 99% approval rate." path="/about" />
      <Hero
        image={aboutImage} imageAlt="Modern SDB International boardroom"
        eyebrow="About the firm"
        title={<>Twenty years of moving people, capital and ambition <span className="italic text-gold">across borders.</span></>}
        intro="SDB International Group is a Dubai-headquartered global immigration & visa consulting firm — trusted by professionals, investors, families and enterprises worldwide."
        primaryCta={{ to: "/contact", label: "Meet our team" }} secondaryCta={{ to: "/services", label: "Our services" }}
      />
      <div className="container-page pt-1"><Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "About" }]} /></div>

      <section className="container-page py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeader eyebrow="Our story" title={<>Founded on a simple belief — mobility should be a right, not a privilege.</>} />
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>SDB International Group was founded in Dubai over two decades ago with a singular mission: to make the intricate, often intimidating world of global immigration accessible, transparent, and outcome-driven.</p>
            <p>From a small consulting desk in the heart of Business Bay, we have grown into a multi-jurisdiction firm serving thousands of clients across the Middle East, Europe, the Americas and APAC — while preserving the private-office intimacy that defined our earliest cases.</p>
            <p>Today, we are recognised across regulator frameworks including ICCRC, OISC, MARA and MOFAIC. But the accreditations that matter most are the twelve thousand approvals, the families reunited, and the enterprises whose talent moves freely because we handled the details.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy text-ivory py-24">
        <div className="container-page grid gap-16 md:grid-cols-2">
          <div>
            <div className="eyebrow text-gold mb-5">Vision</div>
            <h2 className="text-ivory">A world where opportunity moves as freely as ambition.</h2>
            <p className="mt-6 text-ivory/80 leading-relaxed">We envision borders as thresholds — not barriers. Our work is to smooth them, one meticulous case at a time.</p>
          </div>
          <div>
            <div className="eyebrow text-gold mb-5">Mission</div>
            <h2 className="text-ivory">Guide every client to the destination that fits their life — with clarity, care and rigour.</h2>
            <p className="mt-6 text-ivory/80 leading-relaxed">Senior consultants on every file, fixed transparent fees, and support from assessment through long-term settlement.</p>
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <SectionHeader eyebrow="Our values" title={<>Four principles behind every case we accept.</>} align="center" />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map(v => (
            <div key={v.title} className="rounded-sm border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-navy text-ivory"><v.icon className="h-5 w-5" /></div>
              <h3 className="mt-6 font-serif text-2xl text-navy">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-24"><StatGrid stats={stats} /></section>

      <section className="bg-ivory border-y border-border py-24">
        <div className="container-page">
          <SectionHeader eyebrow="How we work" title={<>A disciplined five-step process.</>} />
          <div className="mt-16 grid gap-px bg-border rounded-sm overflow-hidden md:grid-cols-5">
            {process.map(p => (
              <div key={p.step} className="bg-card p-8">
                <div className="font-serif text-4xl text-gold">{p.step}</div>
                <h3 className="mt-6 font-serif text-xl text-navy">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Talk to a senior consultant." intro="Every relationship begins with a complimentary 30-minute assessment." />
    </PageShell>
  );
}
