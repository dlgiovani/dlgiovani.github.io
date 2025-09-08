import { InteractiveTerminal } from "../components/InteractiveTerminal";
import { CommandOutput } from "../components/TypingText";
import { detectLanguage, removeLanguagePrefix, getTranslation } from "../lib/i18n";
import { useLocation } from "react-router";
import type { Route } from "./+types/skills";

export function meta({ location }: Route.MetaArgs) {
  const currentLang = detectLanguage(location.pathname);
  const t = getTranslation(currentLang);
  
  return [
    { title: t.skills.title },
    { name: "description", content: t.skills.description },
    { property: "og:title", content: t.skills.title },
    { property: "og:description", content: t.skills.description },
  ];
}

export default function Skills() {
  return (
    <InteractiveTerminal>
      {({ t }) => (
        <div className="space-y-8">
          <CommandOutput
            command={t.skills.commands.which}
            output="/usr/local/bin/fullstack-developer"
            delay={0}
          />

          <CommandOutput
            command={t.skills.commands.cat}
            output={`#!/bin/bash
# Full Stack Developer Skills v8.0

# ${t.skills.categories.languages}
javascript --version    # ████████████ ${t.common.expert}
typescript --version    # ███████████▒ ${t.common.advanced}  
python --version        # ████████▒▒▒▒ ${t.common.intermediate}
html5 --version         # ████████████ ${t.common.expert}
css3 --version          # ███████████▒ ${t.common.advanced}`}
            delay={1000}
          />

          <CommandOutput
            command={t.skills.commands.npm}
            output={`${t.skills.categories.frontend}
├── react@19.0.0          # ████████████ ${t.common.expert}
├── next.js@15.0.0        # ███████████▒ ${t.common.advanced}
├── vue@3.0.0             # ██████▒▒▒▒▒▒ ${t.common.beginner}
└── tailwindcss@4.0.0     # ████████████ ${t.common.expert}

${t.skills.categories.backend}
├── node.js@22.0.0        # ███████████▒ ${t.common.advanced}
├── express@5.0.0         # ███████████▒ ${t.common.advanced}  
├── fastapi@0.110.0       # ████████▒▒▒▒ ${t.common.intermediate}
└── postgresql@16.0.0     # ██████████▒▒ ${t.common.advanced}`}
            delay={3000}
          />

          <CommandOutput
            command={t.skills.commands.docker}
            output={`${t.skills.categories.tools}
tools/git                latest    ████████████ ${t.common.expert}
tools/docker             latest    ████████▒▒▒▒ ${t.common.intermediate}
tools/aws                latest    ███████▒▒▒▒▒ ${t.common.intermediate}
tools/vercel             latest    ███████████▒ ${t.common.advanced}
tools/figma              latest    ██████▒▒▒▒▒▒ ${t.common.beginner}`}
            delay={5000}
          />

          <CommandOutput
            command={t.skills.commands.systemctl}
            output={`● integrations.service - ${t.skills.categories.integrations}
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
            command={t.skills.commands.ps}
            output={`giovani  1001  0.5  1.2  ${t.skills.categories.softSkills[0]}
giovani  1002  0.3  0.8  ${t.skills.categories.softSkills[1]}
giovani  1003  0.2  0.6  ${t.skills.categories.softSkills[2]}
giovani  1004  0.4  1.0  ${t.skills.categories.softSkills[3]}
giovani  1005  0.1  0.4  ${t.skills.categories.softSkills[4]}`}
            delay={9000}
          />

        <div className="mt-12 space-y-6">
          <div className="p-4 border border-[--color-terminal-secondary] rounded">
            <div className="text-[--color-terminal-accent] mb-2">Skill Progression:</div>
            <div className="text-[--color-terminal-secondary] space-y-1 text-xs">
              <div>{t.skills.legend}</div>
            </div>
          </div>

          <div className="p-4 border border-[--color-terminal-secondary] rounded">
            <div className="text-[--color-terminal-accent] mb-2">{t.skills.learning.title}</div>
            <div className="ml-4 text-[--color-terminal-secondary] space-y-1">
              {t.skills.learning.items.map(item => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}
    </InteractiveTerminal>
  );
}