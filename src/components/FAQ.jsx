import { useState } from "react";
import { Plus, Minus, Instagram } from "lucide-react";

const INSTA_URL = "https://www.instagram.com/_scorpdxb_/";
const INSTA_EMBED = "https://www.instagram.com/_scorpdxb_/embed";

export default function FAQ({ items, title = "Frequently asked questions", eyebrow = "Answers" }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="container-page py-24">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        {/* LEFT: Instagram post embed */}
        <div className="lg:sticky lg:top-28">
          <div className="eyebrow mb-5 flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-gold" /> Latest from Instagram</div>
          <div className="rounded-sm overflow-hidden border border-border bg-card shadow-sm">
            <iframe
              title="SDB International Instagram"
              src={INSTA_EMBED}
              className="w-full"
              style={{ height: 640, border: 0 }}
              allow="encrypted-media"
              loading="lazy"
              scrolling="no"
            />
          </div>
          <a href={INSTA_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-navy font-medium border-b border-gold pb-1">
            View on Instagram @_scorpdxb_
          </a>
        </div>

        {/* RIGHT: title + questions */}
        <div>
          <div className="eyebrow mb-5">{eyebrow}</div>
          <h2 className="text-navy">{title}</h2>
          <div className="mt-6 h-px w-16 bg-gold" />
          <p className="mt-6 text-muted-foreground leading-relaxed">Answers to the questions we hear most from applicants, families and enterprises considering their next move.</p>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button className="flex w-full items-start justify-between gap-6 py-6 text-left" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span className="font-serif text-lg md:text-xl text-navy">{it.q}</span>
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-navy">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && <div className="pb-6 pr-14 text-muted-foreground leading-relaxed">{it.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(it => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })) }) }} />
    </section>
  );
}
