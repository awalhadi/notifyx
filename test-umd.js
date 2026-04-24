const fs = require('fs');
const umdCode = fs.readFileSync('./dist/notifyx.min.js', 'utf8');

// evaluate the UMD code in a fake browser environment
const fakeWindow = {};
const fn = new Function('window', 'self', umdCode);
fn(fakeWindow, fakeWindow);

console.log("Keys on fakeWindow.NotifyX:", Object.keys(fakeWindow.NotifyX));
