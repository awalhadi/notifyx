const fs = require('fs');
const umdCode = fs.readFileSync('./dist/notifyx.min.js', 'utf8');

const fakeWindow = {};
const fn = new Function('window', 'self', umdCode);
fn(fakeWindow, fakeWindow);

console.log("Keys on fakeWindow:", Object.keys(fakeWindow));
console.log("NotifyX type:", typeof fakeWindow.NotifyX);
if (fakeWindow.NotifyX) {
    console.log("NotifyX keys:", Object.keys(fakeWindow.NotifyX));
    console.log("NotifyX.default type:", typeof fakeWindow.NotifyX.default);
}
