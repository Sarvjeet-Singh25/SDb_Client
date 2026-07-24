import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero({ image, imageAlt, eyebrow, title, intro, primaryCta, secondaryCta, minimal = false, priority = false }) {
  return (
    <section className={`relative isolate overflow-hidden ${minimal ? "min-h-[60vh]" : "min-h-[92vh]"} flex items-end`}>
      <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" loading={priority ? "eager" : "lazy"} fetchpriority={priority ? "high" : "auto"} decoding="async" />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--navy) / 0.35) 0%, hsl(var(--navy) / 0.85) 100%)" }} />
      <div className="container-page relative z-10 pb-24 pt-40">
        <div className="max-w-3xl animate-rise">
          {eyebrow && (
            <div className="inline-flex items-center gap-3 rounded-full border border-ivory/30 bg-ivory/5 px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-ivory">{eyebrow}</span>
            </div>
          )}
          <h1 className="mt-6 text-ivory">{title}</h1>
          {intro && <p className="mt-8 max-w-2xl text-lg md:text-xl text-ivory/85 leading-relaxed font-light">{intro}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {primaryCta && (
                <Link to={primaryCta.to} className="btn-gold group">
                  {primaryCta.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {secondaryCta && <Link to={secondaryCta.to} className="btn-outline-ivory">{secondaryCta.label}</Link>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
