const html = require('fs').readFileSync('cpanel.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
if(scripts) {
  const code = scripts[2].replace(/<\/?script.*?>/gi, '');
  console.log(code.split('\n').slice(65, 95).join('\n'));
}
