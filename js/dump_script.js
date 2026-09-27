const fs = require('fs');
const html = fs.readFileSync('cpanel.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
fs.writeFileSync('dumped_script_2.js', scripts[2].replace(/<\/?script.*?>/gi, ''));
console.log('Dumped to dumped_script_2.js');
