import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { User, CalendarDays, Clock, Tag as TagIcon, Facebook, Linkedin, Twitter, MessageCircle, Link2, ArrowRight, ArrowLeft } from "lucide-react";
import blogHeroImage from "../assets/about-hero.jpg";
import PageShell from "../components/PageShell.jsx";
import BlogSidebar from "../components/BlogSidebar.jsx";
import CTASection from "../components/CTASection.jsx";
import SEO from "../components/SEO.jsx";
import { apiGet } from "../lib/api";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.sdbinternational.com").replace(/\/+$/, "");

function resolveImageSrc(image) {
  if (!image) return blogHeroImage;
  return image.startsWith("/api/") ? `${BASE}${image}` : image;
}

function ShareButtons({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const [copied, setCopied] = useState(false);

  const links = [
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Twitter / X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "WhatsApp", icon: MessageCircle, href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
  ];

  function copyLink() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy/60">Share:</span>
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-navy/70 hover:border-gold hover:text-navy transition-colors"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-navy/70 hover:border-gold hover:text-navy transition-colors"
      >
        <Link2 className="h-4 w-4" />
      </button>
      {copied && <span className="text-xs text-gold">Link copied!</span>}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    apiGet(`/api/blogs/slug/${slug}`)
      .then((res) => {
        if (cancelled) return;
        setPost(res?.data || null);
        setRelated(res?.related || []);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (notFound) navigate("/not-found", { replace: true });
  }, [notFound, navigate]);

  if (loading) {
    return (
      <PageShell>
        <div className="container-page py-32 text-center text-muted-foreground font-serif text-xl">
          Loading article...
        </div>
      </PageShell>
    );
  }

  if (!post) return null;

  const pageUrl = `${SITE_URL}/blogs/${post.slug}`;
  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.description;
  const featuredImage = resolveImageSrc(post.image);
  const publishDateISO = post.publishDate ? new Date(post.publishDate).toISOString() : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: metaDescription,
    image: [featuredImage],
    author: { "@type": "Person", name: post.author || "SDB Admin" },
    publisher: {
      "@type": "Organization",
      name: "SDB International Group",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    datePublished: publishDateISO,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : publishDateISO,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE_URL}/blogs` },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  return (
    <PageShell>
      <SEO
        title={`${metaTitle} | SDB International Group`}
        description={metaDescription}
        path={`/blogs/${post.slug}`}
        image={featuredImage}
        type="article"
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      <section className="container-page pt-8 md:pt-12 pb-4">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-navy transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>


        <h1 className="text-navy mb-8 max-w-4xl">
          {post.title}
        </h1>
      </section>

      <section className="container-page pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12">
          {/* LEFT — 70% */}
          <article>
            <div className="rounded-2xl overflow-hidden shadow-xl mb-10 bg-navy/5">
              <img
                src={featuredImage}
                alt={post.title}
                className="w-full h-auto block"
                loading="eager"
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground pb-6 border-b border-border mb-8">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4 text-gold" /> {post.author || "SDB Admin"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-gold" />
                {post.publishDate ? new Date(post.publishDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : ""}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold" /> {post.readingTime || "1 min read"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-red-600 font-medium capitalize">
                <TagIcon className="h-4 w-4" /> {post.category}
              </span>
            </div>

            {/* Sanitized on the server before save; safe to render as HTML */}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blogs?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1.5 bg-ivory border border-border rounded-sm text-navy/70 hover:border-gold hover:text-navy transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-border">
              <ShareButtons url={pageUrl} title={post.title} />
            </div>

            {related.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border">
                <h3 className="font-serif text-2xl text-navy mb-8">Related Articles</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r._id}
                      to={`/blogs/${r.slug}`}
                      className="group flex gap-4 bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img src={resolveImageSrc(r.image)} alt={r.title} className="w-28 h-28 object-cover shrink-0" loading="lazy" />
                      <div className="p-4 min-w-0">
                        <p className="text-xs text-red-600 font-medium capitalize mb-1">{r.category}</p>
                        <p className="text-sm text-navy font-serif leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                          {r.title}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-navy/60 mt-2 group-hover:text-gold">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* RIGHT — 30%, sticky */}
          <BlogSidebar currentSlug={post.slug} />
        </div>
      </section>

      <CTASection secondary={{ to: "/services", label: "See our services" }} />
    </PageShell>
  );
}
