const fs = require('fs');
const umdCode = fs.readFileSync('./dist/notifyx.min.js', 'utf8');

const fakeWindow = {};
const fn = new Function('window', 'self', umdCode);
fn(fakeWindow, fakeWindow);

console.log("Keys on fakeWindow.NotifyX:", Object.keys(fakeWindow.NotifyX));
