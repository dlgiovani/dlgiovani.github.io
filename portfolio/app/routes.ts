import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Default language routes (English)
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("work", "routes/work.tsx"),
  route("skills", "routes/skills.tsx"), 
  route("contact", "routes/contact.tsx"),
  
  // Portuguese routes
  route("pt", "routes/pt/home.tsx"),
  route("pt/sobre", "routes/pt/about.tsx"),
  route("pt/trabalho", "routes/pt/work.tsx"),
  route("pt/habilidades", "routes/pt/skills.tsx"),
  route("pt/contato", "routes/pt/contact.tsx"),
  
  // French routes
  route("fr", "routes/fr/home.tsx"),
  route("fr/à-propos", "routes/fr/about.tsx"),
  route("fr/travail", "routes/fr/work.tsx"),
  route("fr/compétences", "routes/fr/skills.tsx"),
  route("fr/contact", "routes/fr/contact.tsx"),
  
  // API routes
  route("api/portfolio", "routes/api/portfolio.tsx"),
] satisfies RouteConfig;
