import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection({ eyebrow = "Begin your journey", title = "Ready to move forward?", intro = "Speak with a senior consultant. We'll assess your eligibility, map the fastest route, and stand with you until you land.", primary = { to: "/contact", label: "Book a consultation" }, secondary }) {
  return (
    <section className="container-page py-22 pt-18">
      <div className="relative overflow-hidden rounded-sm p-10 md:p-20 text-ivory" style={{ background: "linear-gradient(135deg, hsl(var(--navy)) 0%, hsl(224 40% 24%) 100%)" }}>
        <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "hsl(var(--gold))" }} />
        <div className="relative max-w-2xl">
          <div className="eyebrow text-gold mb-5">{eyebrow}</div>
          <h2 className="text-ivory">{title}</h2>
          <p className="mt-6 text-lg text-ivory/80 leading-relaxed">{intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={primary.to} className="btn-gold group">{primary.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            {secondary && <Link to={secondary.to} className="inline-flex items-center gap-2 rounded-sm border border-ivory/40 px-7 py-4 text-sm font-medium text-ivory hover:bg-ivory hover:text-navy transition-all">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
