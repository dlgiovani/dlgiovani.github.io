import{w as i,j as o}from"./chunk-PVWAREVJ-D7LgcLjQ.js";import{I as s,C as e}from"./TypingText-B71FtNii.js";import{d as r,a as c}from"./index-BhFB9p4H.js";function m({location:n}){const t=r(n.pathname),a=c(t);return[{title:a.about.title},{name:"description",content:a.about.description},{property:"og:title",content:a.about.title},{property:"og:description",content:a.about.description},{property:"og:locale",content:t==="en"?"en_US":t==="pt"?"pt_BR":"fr_CA"}]}const b=i(function(){return o.jsx(s,{children:({t})=>o.jsxs("div",{className:"space-y-8",children:[o.jsx(e,{command:"cd ~/about && cat personal.md",output:`# ${t.about.personal.title}

${t.about.personal.intro}

## ${t.about.personal.journey}

${t.about.personal.specialization}`,delay:0}),o.jsx(e,{command:"cat philosophy.txt",output:`${t.about.philosophy.title}

${t.about.philosophy.content}

${t.about.philosophy.beliefs.map(a=>`• ${a}`).join(`
`)}`,delay:3e3}),o.jsx(e,{command:"cat current-focus.log",output:`${t.about.currentFocus.title}

${t.about.currentFocus.areas.map((a,l)=>`[2024-2025] ${a}`).join(`
`)}

Always exploring new technologies while maintaining production reliability.`,delay:6e3}),o.jsxs("div",{className:"mt-12 p-4 border border-[--color-terminal-secondary] rounded",children:[o.jsx("div",{className:"text-[--color-terminal-accent]",children:t.about.quickStats.title}),o.jsxs("div",{className:"ml-4 text-[--color-terminal-secondary] space-y-1 mt-2",children:[o.jsxs("div",{children:["📅 ",t.about.quickStats.coding]}),o.jsxs("div",{children:["🌍 ",t.about.quickStats.location]}),o.jsxs("div",{children:["💼 ",t.about.quickStats.focus]}),o.jsxs("div",{children:["🎯 ",t.about.quickStats.goal]})]})]})]})})});export{b as default,m as meta};
