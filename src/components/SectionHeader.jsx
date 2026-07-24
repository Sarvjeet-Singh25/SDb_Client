export default function SectionHeader({ eyebrow, title, intro, align = "left", as: Tag = "h2" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
      <Tag className="text-navy">{title}</Tag>
      {intro && <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{intro}</p>}
      <div className={`mt-6 h-px w-16 bg-gold ${align === "center" ? "mx-auto" : ""}`} aria-hidden />
    </div>
  );
}
