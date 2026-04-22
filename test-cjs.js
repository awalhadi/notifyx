const NotifyXModule = require('./dist/notifyx.umd.js');
console.log("UMD export keys:", Object.keys(NotifyXModule));
if (typeof NotifyXModule.default.success === 'function') {
  console.log("UMD core methods present! ✅");
} else {
  console.error("UMD core methods missing! ❌");
  process.exit(1);
}
