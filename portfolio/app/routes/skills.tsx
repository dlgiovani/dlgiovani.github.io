import { Terminal } from "../components/Terminal";
import { CommandOutput } from "../components/TypingText";
import type { Route } from "./+types/skills";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Skills & Expertise - Giovani Drosda Lima" },
    { name: "description", content: "Technical skills and expertise of Giovani Drosda Lima: React, TypeScript, Node.js, integrations, and full-stack development." },
    { property: "og:title", content: "Skills & Expertise - Giovani Drosda Lima" },
    { property: "og:description", content: "Technical skills and expertise of Giovani Drosda Lima: React, TypeScript, Node.js, integrations, and full-stack development." },
  ];
}

export default function Skills() {
  return (
    <Terminal>
      <div className="space-y-8">
        <CommandOutput
          command="which skills"
          output="/usr/local/bin/fullstack-developer"
          delay={0}
        />

        <CommandOutput
          command="cat /usr/local/bin/fullstack-developer"
          output={`#!/bin/bash
# Full Stack Developer Skills v8.0

# Core Languages
javascript --version    # ████████████ Expert
typescript --version    # ███████████▒ Advanced  
python --version        # ████████▒▒▒▒ Intermediate
html5 --version         # ████████████ Expert
css3 --version          # ███████████▒ Advanced`}
          delay={1000}
        />

        <CommandOutput
          command="npm list --global | head -20"
          output={`frontend-frameworks/
├── react@19.0.0          # ████████████ Expert
├── next.js@15.0.0        # ███████████▒ Advanced
├── vue@3.0.0             # ██████▒▒▒▒▒▒ Beginner
└── tailwindcss@4.0.0     # ████████████ Expert

backend-frameworks/
├── node.js@22.0.0        # ███████████▒ Advanced
├── express@5.0.0         # ███████████▒ Advanced  
├── fastapi@0.110.0       # ████████▒▒▒▒ Intermediate
└── postgresql@16.0.0     # ██████████▒▒ Advanced`}
          delay={3000}
        />

        <CommandOutput
          command="docker images | grep 'tools'"
          output={`tools/git                latest    ████████████ Expert
tools/docker             latest    ████████▒▒▒▒ Intermediate
tools/aws                latest    ███████▒▒▒▒▒ Intermediate
tools/vercel             latest    ███████████▒ Advanced
tools/figma              latest    ██████▒▒▒▒▒▒ Beginner`}
          delay={5000}
        />

        <CommandOutput
          command="systemctl status integrations.service"
          output={`● integrations.service - API Integration Specialist
   Loaded: loaded (/etc/systemd/system/integrations.service; enabled)
   Active: active (running) since 2017-01-01 00:00:00 UTC; 8y ago
   
   Specialties:
   ✓ Payment Gateways (Stripe, PayPal, PagSeguro)
   ✓ CRM Systems (HubSpot, Salesforce, Pipedrive) 
   ✓ Communication APIs (WhatsApp Business, Email)
   ✓ E-commerce Platforms (Shopify, WooCommerce)
   ✓ Business Intelligence & Analytics
   ✓ Custom REST/GraphQL API development`}
          delay={7000}
        />

        <CommandOutput
          command="ps aux | grep 'soft-skills'"
          output={`giovani  1001  0.5  1.2  problem-solving     --priority=high
giovani  1002  0.3  0.8  communication       --language=en,pt
giovani  1003  0.2  0.6  team-collaboration  --remote=true  
giovani  1004  0.4  1.0  continuous-learning --autodidact=true
giovani  1005  0.1  0.4  client-focused      --business-first=true`}
          delay={9000}
        />

        <div className="mt-12 space-y-6">
          <div className="p-4 border border-[--color-terminal-secondary] rounded">
            <div className="text-[--color-terminal-accent] mb-2">Skill Progression:</div>
            <div className="text-[--color-terminal-secondary] space-y-1 text-xs">
              <div>Legend: ████████████ Expert | ███████▒▒▒▒▒ Advanced | ██████▒▒▒▒▒▒ Intermediate | ███▒▒▒▒▒▒▒▒▒ Beginner</div>
            </div>
          </div>

          <div className="p-4 border border-[--color-terminal-secondary] rounded">
            <div className="text-[--color-terminal-accent] mb-2">Currently Learning:</div>
            <div className="ml-4 text-[--color-terminal-secondary] space-y-1">
              <div>📚 Advanced React patterns and performance optimization</div>
              <div>🔬 AI/ML integration in web applications</div>
              <div>🏗️ Microservices architecture with Docker</div>
              <div>📊 Advanced data visualization techniques</div>
            </div>
          </div>
        </div>
      </div>
    </Terminal>
  );
}