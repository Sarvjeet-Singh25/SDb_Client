import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { apiGet } from "../lib/api";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function resolveImageSrc(image) {
  if (!image) return "";
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

export default function BlogSidebar({ currentSlug }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    apiGet("/api/blogs?limit=5&sort=newest")
      .then((res) => setRecent((res?.data || []).filter((b) => b.slug !== currentSlug)))
      .catch(() => setRecent([]));

    apiGet("/api/blogs?limit=5&sort=views")
      .then((res) => setPopular((res?.data || []).filter((b) => b.slug !== currentSlug)))
      .catch(() => setPopular([]));

    apiGet("/api/categories")
      .then((res) => setCategories(res?.data || []))
      .catch(() => setCategories([]));

    apiGet("/api/blogs?limit=30")
      .then((res) => {
        const all = res?.data || [];
        const tagSet = new Set();
        all.forEach((b) => (b.tags || []).forEach((t) => tagSet.add(t)));
        setTags(Array.from(tagSet).slice(0, 16));
      })
      .catch(() => setTags([]));
  }, [currentSlug]);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/blogs${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ""}`);
  }

  return (
    <aside className="lg:sticky lg:top-28 space-y-8 self-start">
      {/* SEARCH */}
      <div className="bg-card border border-border rounded-sm p-5">
        <h4 className="font-serif text-lg text-navy mb-3">Search</h4>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search the blog..."
            className="w-full bg-background border border-border pl-9 pr-3 py-2 text-sm text-navy placeholder:text-muted-foreground rounded-sm focus:outline-none focus:border-gold"
          />
          <button type="submit" aria-label="Search">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </button>
        </form>
      </div>

      {/* RECENT POSTS */}
      {recent.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h4 className="font-serif text-lg text-navy mb-4">Recent Posts</h4>
          <ul className="space-y-4">
            {recent.map((post) => (
              <li key={post._id}>
                <Link to={`/blogs/${post.slug}`} className="flex gap-3 group">
                  <img
                    src={resolveImageSrc(post.image)}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-sm shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                      {post.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : ""}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* POPULAR POSTS */}
      {popular.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h4 className="font-serif text-lg text-navy mb-4">Popular Posts</h4>
          <ul className="space-y-4">
            {popular.map((post) => (
              <li key={post._id}>
                <Link to={`/blogs/${post.slug}`} className="flex gap-3 group">
                  <img
                    src={resolveImageSrc(post.image)}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-sm shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                      {post.title}
                    </p>
                    <span className="text-xs text-muted-foreground">{post.views || 0} views</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h4 className="font-serif text-lg text-navy mb-4">Categories</h4>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/blogs?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center justify-between text-sm text-navy/80 hover:text-gold transition-colors py-1 border-b border-border/60"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TAGS */}
      {tags.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h4 className="font-serif text-lg text-navy mb-4">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/blogs?q=${encodeURIComponent(tag)}`}
                className="text-xs px-3 py-1.5 bg-background border border-border rounded-sm text-navy/70 hover:border-gold hover:text-navy transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
