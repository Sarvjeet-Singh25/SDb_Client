import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({ icon: Icon, title, description, href = "/services", index }) {
  return (
    <Link to={href} className="group relative flex flex-col rounded-sm border border-border bg-card p-7 transition-all duration-500 hover:border-gold hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(var(--navy)/0.25)]">
      {typeof index === "number" && <div className="font-serif text-4xl text-muted-foreground/40 mb-6 group-hover:text-gold transition-colors">{String(index).padStart(2, "0")}</div>}
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-navy text-ivory mb-6 group-hover:bg-gold group-hover:text-navy transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-serif text-2xl text-navy mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-navy group-hover:text-gold transition-colors">
        Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
