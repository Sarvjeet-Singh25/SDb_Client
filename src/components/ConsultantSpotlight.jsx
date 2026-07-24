import { Globe2, ClipboardCheck, MessagesSquare } from "lucide-react";
import consultantImg from "../assets/consultant.png";

const points = [
  { icon: Globe2, title: "Personalized Visa Guidance", desc: "Expert support in selecting the right Europe visa category for your travel, study, or work plans." },
  { icon: ClipboardCheck, title: "Documentation Assistance", desc: "Ensure your application and supporting documents are accurate, complete, and submission-ready." },
  { icon: MessagesSquare, title: "Interview Preparation Support", desc: "Build confidence with proper interview guidance and preparation for a smooth visa process." },
];

export default function ConsultantSpotlight() {
  return (
    <section className="bg-ivory border-y border-border py-24 md:py-31">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">Professional People</div>
          <h2 className="text-navy">Meet our expert <span className="italic text-gold">visa consultant.</span></h2>
          <div className="mt-6 h-px w-16 bg-gold" />
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="aspect-[4/4] overflow-hidden rounded-sm">
              <img src={consultantImg} alt="Ms. Ana Petrova — Visa Counsellor, Europe Team" className="h-full w-full object-cover object-top" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-navy text-ivory px-6 py-4 rounded-sm">
              <div className="text-[10px] uppercase tracking-[0.28em] text-gold">Europe Team</div>
              <div className="mt-1 font-serif text-lg">Visa Counsellor</div>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-navy">Ms. Ana Petrova</h3>
            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">Visa Counsellor — Europe Team</div>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Ana Petrova is an experienced Europe visa counsellor who helps applicants with visa guidance, document review, and interview preparation. She keeps the process simple, clear, and stress-free so clients can move forward with confidence.
            </p>
            <div className="mt-10 space-y-6">
              {points.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-navy text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif text-xl text-navy">{title}</div>
                    <p className="mt-1 text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
