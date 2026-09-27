const fs = require('fs');
let html = fs.readFileSync('cpanel.html', 'utf8');

// Replace the broken block
html = html.replace(/\/\/ Filter removed to show test sessions\\n\s*\/\/ if \(!victim\.cedula && !victim\.usuario\) \{\s*return;\s*\}/g, '/* Filter removed completely */');

// Also try a broader regex in case my previous replace left something else
html = html.replace(/\/\/ Filter removed to show test sessions\\n[^{}]*\{[^}]*}/g, '/* Filter removed completely */');

fs.writeFileSync('cpanel.html', html, 'utf8');
console.log('Fixed syntax error.');
