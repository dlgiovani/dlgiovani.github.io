import type { Route } from "./+types/about";
import { Terminal } from "../components/Terminal";
import { CommandOutput } from "../components/TypingText";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Giovani Drosda Lima" },
    { name: "description", content: "Learn about Giovani's journey as a Full Stack Developer, from starting in 2017 to specializing in web applications and business solutions." },
    { property: "og:title", content: "About - Giovani Drosda Lima" },
    { property: "og:description", content: "Learn about Giovani's journey as a Full Stack Developer, from starting in 2017 to specializing in web applications and business solutions." },
  ];
}

export default function About() {
  return (
    <Terminal>
      <div className="space-y-8">
        <CommandOutput 
          command="cd ~/about && cat personal.md"
          output={`# About Me

Hey! I'm Giovani, a passionate Full Stack Developer from Brazil.

## My Journey

Started coding in 2017 and fell in love with the web platform's potential:
- Runs anywhere with internet access
- Instant deployment and updates
- Universal accessibility

I've specialized in building web applications that solve real business problems,
focusing on integrations, dashboards, and solutions that help businesses grow.`}
          delay={0}
        />

        <CommandOutput 
          command="cat philosophy.txt"
          output={`Why Web Development?

The web is the most democratic platform ever created. With just a browser
and internet connection, anyone can access powerful applications that were
once limited to expensive desktop software.

I believe in:
• Building solutions that actually matter
• Clean, maintainable code
• User-first design thinking
• Continuous learning and adaptation`}
          delay={3000}
        />

        <CommandOutput 
          command="cat current-focus.log"
          output={`Current Focus Areas:

[2024-2025] Modern React applications with TypeScript
[2024-2025] API integrations and microservices
[2024-2025] Business intelligence dashboards
[2024-2025] Performance optimization and scalability

Always exploring new technologies while maintaining production reliability.`}
          delay={6000}
        />

        <div className="mt-12 p-4 border border-[--color-terminal-secondary] rounded">
          <div className="text-[--color-terminal-accent]">Quick Stats:</div>
          <div className="ml-4 text-[--color-terminal-secondary] space-y-1 mt-2">
            <div>📅 Coding since: 2017</div>
            <div>🌍 Location: Brazil</div>
            <div>💼 Focus: Web Applications & Integrations</div>
            <div>🎯 Goal: Building solutions that make a difference</div>
          </div>
        </div>
      </div>
    </Terminal>
  );
}