import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FAQ from "../components/FAQ.jsx";
import CTASection from "../components/CTASection.jsx";
import SEO from "../components/SEO.jsx";
import { faqs } from "../lib/siteData.js";
import bgImage from "../assets/visas-hero.jpg";

export default function FAQPage() {
  return (
    <PageShell transparentHeader>
      <SEO 
        title="Frequently Asked Questions — SDB International Group" 
        description="Answers to common questions about SDB International Group's immigration services, timelines, fees, approval rates and consultation process." 
        path="/faq" 
      />

      {/* Hero Section matching the shared design system */}
      <Hero
        image={bgImage}
        imageAlt="FAQ background"
        eyebrow="Frequently asked"
        title={
          <h1 className="text-white">
            Everything you might ask{" "}
            <span className="italic text-gold">before you enquire.</span>
          </h1>
        }
        intro="A curated selection of the questions our senior consultants hear most often."
        primaryCta={{ to: "/contact", label: "Speak with an advisor" }}
      />

      <div className="container-page pt-1">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "FAQ" }]} />
      </div>

      <FAQ items={faqs} title="Your questions, answered." />
      <CTASection />
    </PageShell>
  );
}