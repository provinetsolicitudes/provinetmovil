const fs = require('fs');
const html = fs.readFileSync('cpanel.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
if(scripts) {
  const code = scripts[2].replace(/<\/?script.*?>/gi, '');
  console.log(code.split('\n').slice(15, 30).join('\n'));
}
