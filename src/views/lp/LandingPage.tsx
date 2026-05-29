import { useEffect } from "react";
import { useParams, Navigate } from "@/lib/router";
import { landingPages } from "@/data/landingPages";
import { LandingPageTemplate } from "@/components/lp/LandingPageTemplate";

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = landingPages.find((p) => p.slug === slug);

  // Dynamic SEO meta tags
  useEffect(() => {
    if (!data) return;
    document.title = data.seoTitle;
    let meta = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = data.seoDescription;
    return () => {
      document.title = "ScholarDrill | Australian Exam Preparation";
    };
  }, [data]);

  if (!data) return <Navigate to="/" replace />;

  return <LandingPageTemplate data={data} />;
}
