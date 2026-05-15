import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
}

export function SEOManager({ title, description, keywords, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    // Update Document Title
    document.title = `${title} | ScholarDrill`;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update Keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords.join(", "));
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = keywords.join(", ");
        document.head.appendChild(meta);
      }
    }

    // Update Canonical Link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute("href", canonical);
      } else {
        link = document.createElement("link");
        (link as HTMLLinkElement).rel = "canonical";
        (link as HTMLLinkElement).href = canonical;
        document.head.appendChild(link);
      }
    }
  }, [title, description, keywords, canonical, ogImage]);

  return null; // This is a side-effect only component
}
