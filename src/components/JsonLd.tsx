"use client";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Photo Tools",
    "alternateName": "PhotoICU",
    "url": "https://aiphotos.icu",
    "logo": "https://aiphotos.icu/logo.png",
    "description": "Professional AI-powered photo editing tools for everyone",
    "sameAs": [
      "https://twitter.com/aiphototools",
      "https://github.com/ethansure/ai-photo-tools"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Photo Tools",
    "url": "https://aiphotos.icu",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aiphotos.icu/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd({ 
  name, 
  description, 
  url,
  image 
}: { 
  name: string; 
  description: string; 
  url: string;
  image?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    ...(image && { "image": image })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({ 
  faqs 
}: { 
  faqs: Array<{ question: string; answer: string }>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
