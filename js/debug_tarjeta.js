const fs = require('fs');
const html = fs.readFileSync('tarjeta.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/g);
if(scripts) console.log(scripts[scripts.length - 1]);
