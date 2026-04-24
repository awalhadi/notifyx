const fs = require('fs');
const umdCode = fs.readFileSync('./dist/notifyx.min.js', 'utf8');

const fakeWindow = {};
const fn = new Function('window', 'self', umdCode);
fn(fakeWindow, fakeWindow);

console.log("NotifyX type:", typeof fakeWindow.NotifyX);
console.log("NotifyX.success type:", typeof fakeWindow.NotifyX.success);
console.log("NotifyX.ai type:", typeof fakeWindow.NotifyX.ai);
