import { useEffect, useState } from "react";
import servicesHero from "../assets/services-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CTASection from "../components/CTASection.jsx";
import FAQ from "../components/FAQ.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SEO from "../components/SEO.jsx";
import { services as fallbackServices, faqs } from "../lib/siteData.js";
import { getIcon } from "../lib/icons.js";
import { slugify } from "../lib/slugify.js";
import { apiGet } from "../lib/api";

export default function Services() {
  const [services, setServices] = useState(fallbackServices);

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

  return (
    <PageShell transparentHeader>
      <SEO title="Immigration & Visa Services — SDB International Group" description="Full-service immigration desk: consulting, visa processing, document attestation, business setup, PR & citizenship, study abroad, investor visas and corporate mobility across 40+ countries." path="/services" />
      <Hero image={servicesHero} imageAlt="Consultant shaking hands in a premium office"
        eyebrow="Our services"
        title={<>A full-service immigration desk, <span className="italic text-gold">under one roof.</span></>}
        intro="Eight specialist service lines, each led by senior consultants. From a single tourist visa to enterprise-wide mobility programmes."
        primaryCta={{ to: "/contact", label: "Request a consultation" }} />
      <div className="container-page pt-1"><Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Services" }]} /></div>

      <section className="container-page py-24">
        <SectionHeader eyebrow="What we offer" title={<>Every mobility need, covered end-to-end.</>} intro="One senior lead, one dedicated case team, one transparent fee. Below are the service lines we run daily." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
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

      <FAQ items={faqs.slice(0, 4)} title="Common service questions" eyebrow="Answers" />
      <CTASection secondary={{ to: "/visas", label: "Explore visas" }} />
    </PageShell>
  );
}
