const fs = require('fs');

// 1. Update base.css
let baseCss = fs.readFileSync('src/styles/base.css', 'utf-8');

// Replace container styles
baseCss = baseCss.replace(/\.notifyx-container \{[\s\S]*?\}/, `.notifyx-container {
  position: fixed;
  z-index: 9999;
  width: 420px;
  max-width: 95vw;
  pointer-events: none;
}`);

// Add container positioning
baseCss = baseCss.replace(/\.notifyx-container\[data-position="top-right"\][\s\S]*?transform: translate\(-50%, -50%\);\n\}/, `.notifyx-container[data-position="top-right"]    { top: 20px; right: 20px; }
.notifyx-container[data-position="top-left"]     { top: 20px; left: 20px; }
.notifyx-container[data-position="bottom-right"] { bottom: 20px; right: 20px; }
.notifyx-container[data-position="bottom-left"]  { bottom: 20px; left: 20px; }

.notifyx-container[data-position="top-center"] { top: 20px; left: 50%; transform: translateX(-50%); }
.notifyx-container[data-position="bottom-center"] { bottom: 20px; left: 50%; transform: translateX(-50%); }
.notifyx-container[data-position="center"] { top: 50%; left: 50%; transform: translate(-50%, -50%); }

.notifyx-container[data-position^="top"] .notifyx { top: 0; }
.notifyx-container[data-position^="bottom"] .notifyx { bottom: 0; }
.notifyx-container[data-position="center"] .notifyx { top: 0; }
`);

// Replace toast styles
baseCss = baseCss.replace(/\.notifyx \{[\s\S]*?isolation: isolate;\n\}/, `.notifyx {
  position: absolute;
  width: 100%;
  max-width: min(420px, 95vw);
  overflow: hidden;
  border-radius: 18px;
  cursor: default;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout style;
  pointer-events: auto;
  isolation: isolate;
  transition: transform 0.4s cubic-bezier(0.2, 1, 0.2, 1), opacity 0.4s ease, top 0.4s, bottom 0.4s;
}`);

fs.writeFileSync('src/styles/base.css', baseCss);
console.log('Updated base.css');
