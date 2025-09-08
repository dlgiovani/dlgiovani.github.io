import { Terminal } from "../components/Terminal";
import { CommandOutput } from "../components/TypingText";
import type { Route } from "./+types/work";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Work & Projects - Giovani Drosda Lima" },
    { name: "description", content: "Explore Giovani's professional work, projects, and contributions in web development, integrations, and business solutions." },
    { property: "og:title", content: "Work & Projects - Giovani Drosda Lima" },
    { property: "og:description", content: "Explore Giovani's professional work, projects, and contributions in web development, integrations, and business solutions." },
  ];
}

export default function Work() {
  return (
    <Terminal>
      <div className="space-y-8">
        <CommandOutput
          command="ls -la ~/work/"
          output={`total 42
drwxr-xr-x  5 giovani staff   160 Jan  1 12:00 .
drwxr-xr-x  8 giovani staff   256 Jan  1 12:00 ..
-rw-r--r--  1 giovani staff  2048 Jan  1 12:00 experience.md
drwxr-xr-x  4 giovani staff   128 Jan  1 12:00 projects/
drwxr-xr-x  3 giovani staff    96 Jan  1 12:00 integrations/`}
          delay={0}
        />

        <CommandOutput
          command="cat experience.md"
          output={`# Professional Experience

## Full Stack Developer (2017 - Present)
• Specialized in React, Node.js, and modern web technologies
• Built 50+ web applications for various industries
• Developed integration solutions for business automation
• Created dashboards for data visualization and analytics

## Key Achievements:
• Reduced manual processes by 80% through custom integrations
• Built scalable applications serving 10k+ daily active users
• Implemented CI/CD pipelines improving deployment efficiency by 60%
• Led technical decisions for multiple high-impact projects`}
          delay={2000}
        />

        <CommandOutput
          command="ls projects/"
          output={`real-estate-platform/
business-dashboard/
inventory-management/
payment-integrations/
analytics-suite/`}
          delay={5000}
        />

        <CommandOutput
          command="head -n 20 projects/real-estate-platform/README.md"
          output={`# Real Estate Platform
Stack: React, Node.js, PostgreSQL, AWS

A comprehensive platform for real estate management featuring:
• Property listings with advanced search
• CRM for lead management
• Integration with multiple property sources
• Automated reporting and analytics
• Mobile-responsive design

Impact: 300% increase in lead conversion rates`}
          delay={7000}
        />

        <CommandOutput
          command="cat integrations/overview.txt"
          output={`Integration Expertise:

• Payment Gateways (Stripe, PayPal, PagSeguro)
• CRM Systems (HubSpot, Salesforce, Pipedrive)
• E-commerce Platforms (Shopify, WooCommerce)
• Communication APIs (WhatsApp, Email, SMS)
• Business Intelligence Tools
• Custom API development and consumption`}
          delay={10000}
        />

        <div className="mt-12 p-4 border border-[--color-terminal-secondary] rounded">
          <div className="text-[--color-terminal-accent]">Featured Technologies:</div>
          <div className="ml-4 text-[--color-terminal-secondary] grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-[--color-terminal-text]">Frontend:</div>
              <div>React, TypeScript, Next.js</div>
              <div>Tailwind CSS, Material-UI</div>
            </div>
            <div>
              <div className="text-[--color-terminal-text]">Backend:</div>
              <div>Node.js, Python, PostgreSQL</div>
              <div>REST APIs, GraphQL</div>
            </div>
            <div>
              <div className="text-[--color-terminal-text]">Tools:</div>
              <div>Docker, AWS, Vercel</div>
              <div>Git, CI/CD Pipelines</div>
            </div>
            <div>
              <div className="text-[--color-terminal-text]">Integrations:</div>
              <div>Payment Gateways</div>
              <div>CRM & Business Tools</div>
            </div>
          </div>
        </div>
      </div>
    </Terminal>
  );
}