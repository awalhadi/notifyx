import NotifyX, { POSITIONS, THEMES } from './dist/notifyx.es.js';

console.log("ESM default export:", typeof NotifyX);
console.log("ESM positions export:", POSITIONS);
console.log("ESM themes export:", THEMES);
if (typeof NotifyX.success === 'function' && typeof NotifyX.stream === 'function') {
  console.log("ESM core methods present! ✅");
} else {
  console.error("ESM core methods missing! ❌");
  process.exit(1);
}
