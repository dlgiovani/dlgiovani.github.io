import type { Route } from "./+types/portfolio";

export async function loader({}: Route.LoaderArgs) {
  const portfolioData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Giovani Drosda Lima",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer specializing in web applications, integrations, and business solutions with 8+ years of experience.",
    "url": "https://dlgiovani.github.io",
    "sameAs": [
      "https://github.com/dlgiovani",
      "https://linkedin.com/in/giovani-drosda-lima"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "knowsAbout": [
      "React",
      "TypeScript",
      "Node.js",
      "Full Stack Development",
      "API Integration",
      "Business Solutions",
      "Web Applications",
      "JavaScript",
      "Python",
      "PostgreSQL"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "occupationLocation": {
        "@type": "Country",
        "name": "Brazil"
      },
      "skills": [
        "React Development",
        "TypeScript",
        "Node.js",
        "API Integration",
        "Database Design",
        "Business Solutions"
      ]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+5541984486463",
      "contactType": "professional",
      "email": "contatogiovanidl@gmail.com"
    },
    "experience": {
      "yearsActive": "2017-present",
      "projectsCompleted": "50+",
      "specialization": "Web Applications and Business Integrations"
    },
    "availability": {
      "status": "available",
      "timezone": "America/Sao_Paulo",
      "responseTime": "within 24 hours"
    }
  };

  return Response.json(portfolioData, {
    headers: {
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, max-age=3600"
    }
  });
}