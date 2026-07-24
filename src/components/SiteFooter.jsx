import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo.png";

const columns = [
  { title: "Services", links: [{ to: "/services", label: "All Services" }, { to: "/visas", label: "Visa Processing" }, { to: "/services", label: "Immigration Consulting" }, { to: "/services", label: "Document Attestation" }, { to: "/services", label: "Business Setup" },{}] },
  { title: "Countries", links: [{ to: "/countries", label: "United Arab Emirates" }, { to: "/countries", label: "Germany" }, { to: "/countries", label: "Poland" }, { to: "/countries", label: "Czech Republic" }, { to: "/countries", label: "Australia" }] },
  { title: "Company", links: [{ to: "/about", label: "About Us" }, { to: "/jobs", label: "Jobs" }, { to: "/about", label: "Global Presence" }, { to: "/faq", label: "FAQ" }, { to: "/contact", label: "Contact" }] },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-ivory relative overflow-hidden">
      <div className="container-page relative py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="SDB International Group" className="h-16 w-16 rounded-full object-contain bg-white p-1" />
              <div>
                <div className="font-serif text-xl leading-none">SDB International</div>
                <div className="text-[10px] tracking-[0.28em] uppercase text-ivory/60 mt-1">Global Immigration Group</div>
              </div>
            </div>
            <p className="text-ivory/70 text-sm leading-relaxed max-w-sm">A globally trusted immigration & visa consulting firm headquartered in Dubai, guiding individuals, families and enterprises to opportunities across 30+ countries.</p>
            {/* <div className="mt-8 space-y-3 text-sm text-ivory/80">
              <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />Business Bay, Dubai, United Arab Emirates</div>
              <a href="tel:+971528734411" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+971 52 873 4411</a>
              <a href="mailto:info@scorpdxb.com" className="flex items-center gap-3 hover:text-gold"><Mail className="h-4 w-4 text-gold shrink-0" />info@scorpdxb.com</a>
            </div> */}
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="font-serif text-lg text-ivory mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l, i) => <li key={i}><Link to={l.to} className="text-sm text-ivory/70 hover:text-gold">{l.label}</Link></li>)}
              </ul>

            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">
            <div className="mt-8 space-y-3 text-sm text-ivory/80">
              <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />Business Bay, Dubai, United Arab Emirates</div>
              <a href="tel:+971528734411" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+971 52 873 4411</a>
              <a href="mailto:info@scorpdxb.com" className="flex items-center gap-3 hover:text-gold"><Mail className="h-4 w-4 text-gold shrink-0" />info@scorpdxb.com</a>
            </div>
            <div className="mt-8 space-y-3 text-sm text-ivory/80">
              <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />Dubai Head office </div>
              <a href="tel:+971528734411" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+971 52 873 4411</a>
              <a href="tel:+971551587635"className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+971 55 158 7635</a>
            </div>
            <div className="mt-8 space-y-3 text-sm text-ivory/80">
              <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />India</div>
              <a href="tel:+919053738080" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+91 90537 38080</a>
              <a href="tel:+919053748080" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+91 90537 48080</a>
            </div>
            <div className="mt-8 space-y-3 text-sm text-ivory/80">
              <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />Europe</div>
              <a href="tel:+420777250316" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+420 777 250 316</a>
              <a href="tel:+381 628284870" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+381 62 8284 870</a>
            </div>
            <div className="mt-8 space-y-3 text-sm text-ivory/80">
              <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />WhatsApp link</div>
              <a href="tel:+919053748080" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+91 90537 48080</a>
              <a href="tel:+420777250316" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold shrink-0" />+420 777 250 316</a>
            </div>
        </div>
        <div className="mt-16 pt-4 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-xs text-ivory/50">© {new Date().getFullYear()} SDB International Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold"><Facebook className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/_scorpdxb_" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
