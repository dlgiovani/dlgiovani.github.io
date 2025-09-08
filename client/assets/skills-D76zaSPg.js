import{w as l,j as s}from"./chunk-PVWAREVJ-D7LgcLjQ.js";import{I as n,C as i}from"./TypingText-B71FtNii.js";import{d as t,a as c}from"./index-BhFB9p4H.js";function p({location:a}){const e=t(a.pathname),o=c(e);return[{title:o.skills.title},{name:"description",content:o.skills.description},{property:"og:title",content:o.skills.title},{property:"og:description",content:o.skills.description}]}const g=l(function(){return s.jsx(n,{children:({t:e})=>s.jsxs("div",{className:"space-y-8",children:[s.jsx(i,{command:e.skills.commands.which,output:"/usr/local/bin/fullstack-developer",delay:0}),s.jsx(i,{command:e.skills.commands.cat,output:`#!/bin/bash
# Full Stack Developer Skills v8.0

# ${e.skills.categories.languages}
javascript --version    # ████████████ ${e.common.expert}
typescript --version    # ███████████▒ ${e.common.advanced}  
python --version        # ████████▒▒▒▒ ${e.common.intermediate}
html5 --version         # ████████████ ${e.common.expert}
css3 --version          # ███████████▒ ${e.common.advanced}`,delay:1e3}),s.jsx(i,{command:e.skills.commands.npm,output:`${e.skills.categories.frontend}
├── react@19.0.0          # ████████████ ${e.common.expert}
├── next.js@15.0.0        # ███████████▒ ${e.common.advanced}
├── vue@3.0.0             # ██████▒▒▒▒▒▒ ${e.common.beginner}
└── tailwindcss@4.0.0     # ████████████ ${e.common.expert}

${e.skills.categories.backend}
├── node.js@22.0.0        # ███████████▒ ${e.common.advanced}
├── express@5.0.0         # ███████████▒ ${e.common.advanced}  
├── fastapi@0.110.0       # ████████▒▒▒▒ ${e.common.intermediate}
└── postgresql@16.0.0     # ██████████▒▒ ${e.common.advanced}`,delay:3e3}),s.jsx(i,{command:e.skills.commands.docker,output:`${e.skills.categories.tools}
tools/git                latest    ████████████ ${e.common.expert}
tools/docker             latest    ████████▒▒▒▒ ${e.common.intermediate}
tools/aws                latest    ███████▒▒▒▒▒ ${e.common.intermediate}
tools/vercel             latest    ███████████▒ ${e.common.advanced}
tools/figma              latest    ██████▒▒▒▒▒▒ ${e.common.beginner}`,delay:5e3}),s.jsx(i,{command:e.skills.commands.systemctl,output:`● integrations.service - ${e.skills.categories.integrations}
   Loaded: loaded (/etc/systemd/system/integrations.service; enabled)
   Active: active (running) since 2017-01-01 00:00:00 UTC; 8y ago
   
   Specialties:
   ✓ Payment Gateways (Stripe, PayPal, PagSeguro)
   ✓ CRM Systems (HubSpot, Salesforce, Pipedrive) 
   ✓ Communication APIs (WhatsApp Business, Email)
   ✓ E-commerce Platforms (Shopify, WooCommerce)
   ✓ Business Intelligence & Analytics
   ✓ Custom REST/GraphQL API development`,delay:7e3}),s.jsx(i,{command:e.skills.commands.ps,output:`giovani  1001  0.5  1.2  ${e.skills.categories.softSkills[0]}
giovani  1002  0.3  0.8  ${e.skills.categories.softSkills[1]}
giovani  1003  0.2  0.6  ${e.skills.categories.softSkills[2]}
giovani  1004  0.4  1.0  ${e.skills.categories.softSkills[3]}
giovani  1005  0.1  0.4  ${e.skills.categories.softSkills[4]}`,delay:9e3}),s.jsxs("div",{className:"mt-12 space-y-6",children:[s.jsxs("div",{className:"p-4 border border-[--color-terminal-secondary] rounded",children:[s.jsx("div",{className:"text-[--color-terminal-accent] mb-2",children:"Skill Progression:"}),s.jsx("div",{className:"text-[--color-terminal-secondary] space-y-1 text-xs",children:s.jsx("div",{children:e.skills.legend})})]}),s.jsxs("div",{className:"p-4 border border-[--color-terminal-secondary] rounded",children:[s.jsx("div",{className:"text-[--color-terminal-accent] mb-2",children:e.skills.learning.title}),s.jsx("div",{className:"ml-4 text-[--color-terminal-secondary] space-y-1",children:e.skills.learning.items.map(o=>s.jsx("div",{children:o},o))})]})]})]})})});export{g as default,p as meta};
