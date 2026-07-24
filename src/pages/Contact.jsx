import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import SEO from "../components/SEO.jsx";
import { apiPost } from "../lib/api";
import bgImage from "../assets/visas-hero.jpg";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", message: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/api/contact", form);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please email us at hello@sdbinternational.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell transparentHeader>
      <SEO
        title="Contact — SDB International Group"
        description="Speak with a senior SDB International consultant. Complimentary 30-minute assessment, response within one business day."
        path="/contact"
      />

      {/* Hero Section matching the shared design system */}
      <Hero
        image={bgImage}
        imageAlt="Contact hero background"
        eyebrow="Get in touch"
        title={
          <h1 className="text-white">
            Speak with a senior <span className="italic text-gold">consultant.</span>
          </h1>
        }
        intro="Every relationship begins with a 30-minute assessment. Share a few details and we'll match you with the right consultant within one business day."
        primaryCta={{ to: "#contact-form", label: "Assess my eligibility" }}
      />

      <div className="container-page pt-1">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Contact" }]} />
      </div>

      {/* Contact Channels & Form Section */}
      <section id="contact-form" className="container-page py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Reach us" title={<>Three channels. <span className="italic text-gold">One dedicated team.</span></>} />
            <div className="mt-8 space-y-6">
              {[
                { icon: MapPin, k: "Head office", v: "SDB International Group, Business Bay, Dubai, UAE" },
                { icon: Phone, k: "Phone / WhatsApp", v: "+971 52 873 4411", href: "tel:+971528734411" },
                { icon: Mail, k: "Email", v: "hello@sdbinternational.com", href: "mailto:hello@sdbinternational.com" },
                { icon: Clock, k: "Hours", v: "Sunday – Friday · 09:00 – 19:00 GST" },
              ].map((c) => (
                <div key={c.k} className="flex items-start gap-4 border-b border-border pb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border text-gold">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{c.k}</div>
                    {c.href ? (
                      <a href={c.href} className="text-navy hover:text-gold transition-colors">{c.v}</a>
                    ) : (
                      <div className="text-navy">{c.v}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-8 md:p-10">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-12 w-12 text-gold mx-auto" />
                <h2 className="mt-6 font-serif text-3xl text-navy">Thank you.</h2>
                <p className="mt-3 text-muted-foreground">
                  We've received your request. A senior consultant will reach out within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    { name: "name", label: "Full name", required: true, placeholder: "Your full name" },
                    { name: "email", label: "Email", required: true, type: "email", placeholder: "you@example.com" },
                    { name: "phone", label: "Phone / WhatsApp", placeholder: "+971 ..." },
                    { name: "country", label: "Destination country", placeholder: "e.g. Germany, Poland, UAE" },
                  ].map((f) => (
                    <label key={f.name} className="block">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {f.label}{f.required && <span className="text-gold ml-1">*</span>}
                      </span>
                      <input
                        type={f.type || "text"}
                        required={f.required}
                        value={form[f.name]}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        placeholder={f.placeholder}
                        className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-navy focus:border-gold focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    How can we help?<span className="text-gold ml-1">*</span>
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your goals, background and timeline..."
                    className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-navy focus:border-gold focus:outline-none resize-none"
                  />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary group disabled:opacity-60">
                  {loading ? "Sending..." : "Send enquiry"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-xs text-muted-foreground">Enquiries are handled by a senior consultant only.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}