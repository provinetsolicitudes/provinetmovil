const fs = require('fs');
let content = fs.readFileSync('inicio.html', 'utf8');

// Remove the strict Content-Security-Policy meta tag
content = content.replace(/]*>/i, '');

fs.writeFileSync('inicio.html', content, 'utf8');
console.log('Done: Removed CSP meta tag');
