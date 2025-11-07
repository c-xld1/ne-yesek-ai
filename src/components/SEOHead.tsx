import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

const SEOHead = ({
  title = "Ne Yesek AI - Yapay Zeka Destekli Tarif Platformu",
  description = "Milyonlarca tarif, AI destekli kişisel öneriler ve mutfak deneyiminizi kolaylaştıran teknoloji. Ne Yesek AI ile lezzetli tarifler keşfedin!",
  keywords = "tarif, yemek tarifi, mutfak, ai tarif, yapay zeka, ne yesek, yemek önerisi, kolay tarifler",
  image = "https://neyesek.ai/og-image.jpg",
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
}: SEOHeadProps) => {
  const siteUrl = "https://neyesek.ai";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = title.includes("Ne Yesek") ? title : `${title} | Ne Yesek AI`;

  const robotsContent = `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Ne Yesek AI" />
      <meta property="og:locale" content="tr_TR" />

      {/* Article specific tags */}
      {type === "article" && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@neyesekai" />

      {/* Additional SEO Tags */}
      <meta name="language" content="Turkish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={author || "Ne Yesek AI"} />
      <meta httpEquiv="content-language" content="tr" />
      
      {/* Mobile Web App */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Ne Yesek AI" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Schema.org for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebSite",
          name: fullTitle,
          description: description,
          url: fullUrl,
          image: image,
          ...(type === "article" && {
            headline: title,
            author: {
              "@type": "Person",
              name: author || "Ne Yesek AI",
            },
            datePublished: publishedTime,
            dateModified: modifiedTime,
            publisher: {
              "@type": "Organization",
              name: "Ne Yesek AI",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
              },
            },
          }),
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
