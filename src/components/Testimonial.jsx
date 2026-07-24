import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiGet } from "../lib/api";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// Fetches whatever the admin has uploaded to the "success-stories" media
// folder. No fallback/placeholder photos — if nothing has been uploaded
// yet, this returns an empty list and the homepage section hides itself.
export function useSuccessStories() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await apiGet("/api/media/public/success-stories");
        const files = Array.isArray(res?.data) ? res.data : [];
        if (!cancelled) {
          setPhotos(
            files.map((f) => ({
              id: f._id,
              src: `${BASE}${f.url}`,
              alt: f.caption || f.filename || "SDB International success story",
              caption: f.caption || "",
            }))
          );
        }
      } catch {
        if (!cancelled) setPhotos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { photos, loading };
}

export default function TestimonialGrid({ photos = [] }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const trackRef = useRef(null);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [photos, updateScrollButtons]);

  if (!photos.length) return null;

  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll to previous success stories"
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-navy text-ivory shadow-lg hover:bg-gold hover:text-navy transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Scroll to more success stories"
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-navy text-ivory shadow-lg hover:bg-gold hover:text-navy transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p) => (
          <figure
            key={p.id}
            data-card
            className="group relative shrink-0 snap-start overflow-hidden rounded-sm bg-navy border border-border shadow-sm w-[85%] sm:w-[46%] lg:w-[calc(25%_-_18px)]"
          >
            <img src={p.src} alt={p.alt} loading="lazy" className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            {p.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-5">
                <div className="text-[10px] uppercase tracking-[0.28em] text-gold">Success Story</div>
                <div className="mt-1 font-serif text-lg text-ivory leading-snug">{p.caption}</div>
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
