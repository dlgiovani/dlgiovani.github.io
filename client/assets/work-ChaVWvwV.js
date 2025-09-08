import{w as n,j as e}from"./chunk-PVWAREVJ-D7LgcLjQ.js";import{I as s,C as a}from"./TypingText-B71FtNii.js";import{d as i,a as c}from"./index-BhFB9p4H.js";function p({location:o}){const t=i(o.pathname),r=c(t);return[{title:r.work.title},{name:"description",content:r.work.description},{property:"og:title",content:r.work.title},{property:"og:description",content:r.work.description}]}const x=n(function(){return e.jsx(s,{children:({t})=>e.jsxs("div",{className:"space-y-8",children:[e.jsx(a,{command:"ls -la ~/work/",output:`total 42
drwxr-xr-x  5 giovani staff   160 Jan  1 12:00 .
drwxr-xr-x  8 giovani staff   256 Jan  1 12:00 ..
-rw-r--r--  1 giovani staff  2048 Jan  1 12:00 experience.md
drwxr-xr-x  4 giovani staff   128 Jan  1 12:00 projects/
drwxr-xr-x  3 giovani staff    96 Jan  1 12:00 integrations/`,delay:0}),e.jsx(a,{command:"cat experience.md",output:`# ${t.work.experience.title}

## ${t.work.experience.role}
${t.work.experience.bullets.map(r=>`• ${r}`).join(`
`)}

## ${t.work.experience.achievements.title}
${t.work.experience.achievements.items.map(r=>`• ${r}`).join(`
`)}`,delay:2e3}),e.jsx(a,{command:"ls projects/",output:`real-estate-platform/
business-dashboard/
inventory-management/
payment-integrations/
analytics-suite/`,delay:5e3}),e.jsx(a,{command:"head -n 20 projects/real-estate-platform/README.md",output:`# ${t.work.projects.realEstate.title}
${t.work.projects.realEstate.stack}

${t.work.projects.realEstate.description}
${t.work.projects.realEstate.features.map(r=>`• ${r}`).join(`
`)}

${t.work.projects.realEstate.impact}`,delay:7e3}),e.jsx(a,{command:"cat integrations/overview.txt",output:`${t.work.integrations.title}

${t.work.integrations.items.map(r=>`• ${r}`).join(`
`)}`,delay:1e4}),e.jsxs("div",{className:"mt-12 p-4 border border-[--color-terminal-secondary] rounded",children:[e.jsx("div",{className:"text-[--color-terminal-accent]",children:t.work.technologies.title}),e.jsxs("div",{className:"ml-4 text-[--color-terminal-secondary] grid grid-cols-2 gap-4 mt-2",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-[--color-terminal-text]",children:"Frontend:"}),e.jsx("div",{className:"whitespace-pre-line",children:t.work.technologies.frontend})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[--color-terminal-text]",children:"Backend:"}),e.jsx("div",{className:"whitespace-pre-line",children:t.work.technologies.backend})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[--color-terminal-text]",children:"Tools:"}),e.jsx("div",{className:"whitespace-pre-line",children:t.work.technologies.tools})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[--color-terminal-text]",children:"Integrations:"}),e.jsx("div",{className:"whitespace-pre-line",children:t.work.technologies.integrations})]})]})]})]})})});export{x as default,p as meta};
