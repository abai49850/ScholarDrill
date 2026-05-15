// src/lib/utils/seo.ts
import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  slug?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  slug = '',
  ogImage = '/og-image.png',
  noIndex = false,
}: SEOConfig): Metadata {
  return {
    title: `${title} | ScholarDrill`,
    description,
    keywords: ['NAPLAN', 'HSC', 'VCE', 'Selective Schools', 'Scholarship Exams', 'Australia Education'],
    openGraph: {
      title,
      description,
      url: `https://scholardrill.com.au/${slug}`,
      images: [{ url: ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://scholardrill.com.au/${slug}`,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Generates JSON-LD Structured Data for FAQs
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * Generates JSON-LD Structured Data for an Educational Exam
 */
export function generateExamSchema(name: string, description: string, state: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name,
    description,
    credentialCategory: 'Exam',
    educationalLevel: 'K-12',
    address: {
      '@type': 'PostalAddress',
      addressRegion: state,
      addressCountry: 'AU',
    },
  };
}
