import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs">
      <ol className="flex flex-wrap items-center gap-1.5 text-ivory/70">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.to ? <Link to={it.to} className="hover:text-gold">{it.label}</Link> : <span className="text-ivory">{it.label}</span>}
            {i < items.length - 1 && <ChevronRight className="h-3 w-3 text-ivory/40" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
