import { Helmet } from "react-helmet-async";

// `image` and `type` are optional and additive — every existing call site that
// only passes title/description/path/jsonLd/noindex keeps working exactly as before.
export default function SEO({ title, description, path = "/", jsonLd, noindex = false, image, type = "website" }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <link rel="canonical" href={path} />
      {jsonLd && (
        Array.isArray(jsonLd)
          ? jsonLd.map((schema, i) => (
              <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
            ))
          : <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
