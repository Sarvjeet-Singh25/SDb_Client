export default function StatGrid({ stats, dark = false }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-px rounded-sm overflow-hidden ${dark ? "bg-ivory/10" : "bg-border"}`}>
      {stats.map((s) => (
        <div key={s.label} className={`${dark ? "bg-navy" : "bg-card"} p-8 md:p-12 flex flex-col items-start`}>
          <div className={`font-serif text-4xl md:text-5xl ${dark ? "text-ivory" : "text-navy"}`}>{s.value}<span className="text-gold">.</span></div>
          <div className={`mt-3 text-xs uppercase tracking-[0.22em] ${dark ? "text-ivory/60" : "text-muted-foreground"}`}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
