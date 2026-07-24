import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/visas", label: "Visas" },
  { to: "/countries", label: "Countries" },
  { to: "/blogs", label: "Blogs" },
  { to: "/jobs", label: "Jobs" },
  { to: "/faq", label: "FAQ" },
  // { to: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background backdrop-blur-xl border-b border-border transition-all duration-500">
        <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="SDB International Group home">
          <img src={logo} alt="SDB International Group" className="h-16 w-16 rounded-full object-contain bg-white" />
          <div className="hidden sm:block">
            <div className="font-serif text-lg leading-none text-navy">SDB International</div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mt-1">International Manpower Solutions</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "text-navy" : "text-foreground/80 hover:text-navy"}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-sm font-medium text-ivory hover:bg-navy/80 transition-all">
            Book Consultation <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
          </Link>
        </div>
        <button className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-sm text-navy hover:bg-muted" onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-page py-6 flex flex-col gap-1">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="py-3 px-2 text-base font-medium text-foreground/80 hover:text-navy border-b border-border/60">{item.label}</Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center justify-center rounded-sm bg-navy px-5 py-3 text-sm font-medium text-ivory">Book Consultation</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
