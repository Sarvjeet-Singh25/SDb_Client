import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, User, Clock, Tag, Search, ChevronLeft, ChevronRight } from "lucide-react";
import blogHeroImage from "../assets/about-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import FAQ from "../components/FAQ.jsx";
import CTASection from "../components/CTASection.jsx";
import SEO from "../components/SEO.jsx";
import { faqs } from "../lib/siteData.js";
import { apiGet } from "../lib/api";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const POSTS_PER_PAGE = 9;

function resolveImageSrc(image) {
  if (!image) return blogHeroImage;
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    apiGet("/api/categories")
      .then((res) => setCategories(res?.data || []))
      .catch(() => setCategories([]));
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", POSTS_PER_PAGE);
      if (activeQuery) params.set("q", activeQuery);
      if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);

      const res = await apiGet(`/api/blogs?${params.toString()}`);
      setBlogs(Array.isArray(res?.data) ? res.data : []);
      setPagination(res?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to load blog articles:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [activeQuery, selectedCategory, currentPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const params = {};
    if (activeQuery) params.q = activeQuery;
    if (selectedCategory !== "All") params.category = selectedCategory;
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery, selectedCategory, currentPage]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setCurrentPage(1);
    setActiveQuery(searchInput.trim());
  }

  function handleCategoryClick(name) {
    setSelectedCategory(name);
    setCurrentPage(1);
  }

  return (
    <PageShell transparentHeader>
      <SEO
        title="Immigration Insights & Visa Policy News | SDB International Group"
        description="Stay updated with global visa policy changes, Golden Visa guides, and expert immigration insights from SDB International Group."
        path="/blogs"
      />

      <Hero
        image={blogHeroImage}
        imageAlt="SDB International Insights & News"
        eyebrow="News & Insights"
        title={
          <>
            Navigating global pathways,<br />
            <span className="italic text-gold">demystified.</span>
          </>
        }
        intro="Expert analysis, policy updates, and practical guidance on international immigration, Golden Visas, and residency programs worldwide."
        primaryCta={{ to: "/contact", label: "Speak to a consultant" }}
        secondaryCta={{ to: "/services", label: "Explore services" }}
        priority
      />

      {/* FILTER & SEARCH BAR */}
      <section className="bg-ivory border-b border-border py-8">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => handleCategoryClick("All")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                selectedCategory === "All"
                  ? "bg-navy text-ivory"
                  : "bg-card text-navy/70 border border-border hover:border-navy hover:text-navy"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-navy text-ivory"
                    : "bg-card text-navy/70 border border-border hover:border-navy hover:text-navy"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-card border border-border pl-10 pr-4 py-2 text-sm text-navy placeholder:text-muted-foreground rounded-sm focus:outline-none focus:border-gold transition-colors"
            />
            <button type="submit" aria-label="Search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </button>
          </form>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="container-page py-20 md:py-26">
        <SectionHeader
          eyebrow="Latest Articles"
          title="Immigration Updates & Global Mobility News"
          intro="Timely guides and immigration updates compiled by our senior specialists."
        />

        {loading ? (
          <div className="text-center text-muted-foreground py-20 font-serif text-xl">
            Loading latest articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-ivory border border-border rounded-sm mt-12">
            <h3 className="font-serif text-2xl text-navy">No articles found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Try adjusting your search query or category filter.
            </p>
            <button
              onClick={() => {
                setSearchInput("");
                setActiveQuery("");
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy border-b border-gold pb-1"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <article
                  key={post._id}
                  className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_60px_-20px_hsl(var(--navy)/0.25)] flex flex-col"
                >
                  <Link to={`/blogs/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-navy/5 block">
                    <img
                      src={resolveImageSrc(post.image)}
                      alt={post.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-0 left-0 bg-navy text-ivory px-4 py-3 text-center shadow-md z-20 pointer-events-none rounded-br-lg">
                      <span className="block font-serif font-semibold text-xl leading-none text-gold">{post.day || "—"}</span>
                      <span className="block text-[10px] uppercase tracking-wider font-medium mt-0.5">{post.month || ""}</span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      

                      <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold font-semibold mb-2">
                        <Tag className="h-3 w-3" />
                        {post.category || "Immigration"}
                      </div>

                      <h3 className="text-navy font-serif text-lg leading-snug group-hover:text-gold transition-colors line-clamp-2">
                        <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                      </h3>

                      {post.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.description}</p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/60">
                      <Link
                        to={`/blogs/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy group-hover:text-gold transition-colors"
                      >
                        Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-border text-navy rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <span className="text-sm font-medium text-navy">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.pages))}
                  disabled={currentPage === pagination.pages}
                  className="p-2 border border-border text-navy rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FAQ items={faqs} />
      <CTASection secondary={{ to: "/services", label: "See our services" }} />
    </PageShell>
  );
}
